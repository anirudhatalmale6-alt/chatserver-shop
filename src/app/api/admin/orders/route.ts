import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { sendOrderConfirmedEmail, sendAccountCreatedEmail } from "@/lib/cmsEmail";
import { generateInvoicePdf } from "@/lib/invoicePdf";
import { PaymentStatus } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";

function generatePassword(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "50")));
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && ["pending", "paid", "failed", "refunded"].includes(status)) {
      where.paymentStatus = status as PaymentStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const serializedOrders = orders.map((order) => ({
      ...order,
      tierPrice: Number(order.tierPrice),
    }));

    return NextResponse.json({
      orders: serializedOrders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status, notes, paymentId, cryptoTxHash } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const validStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id: Number(orderId) } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.paymentStatus = status as PaymentStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentId !== undefined) updateData.paymentId = paymentId;
    if (cryptoTxHash !== undefined) updateData.cryptoTxHash = cryptoTxHash;

    if (status === "paid" && existing.paymentStatus !== "paid") {
      updateData.confirmedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id: Number(orderId) },
      data: updateData,
    });

    // Send order confirmation email with PDF invoice
    if (status === "paid" && existing.paymentStatus !== "paid") {
      try {
        const invoicePdf = await generateInvoicePdf({
          orderId: existing.orderId,
          customerName: existing.customerName,
          customerEmail: existing.customerEmail,
          tierName: existing.tierName,
          tierPrice: Number(existing.tierPrice),
          optionsPrice: Number(existing.optionsPrice),
          oneTimeFees: Number(existing.oneTimeFees),
          totalPrice: Number(existing.totalPrice),
          paymentMethod: existing.paymentMethod,
          confirmedAt: new Date(),
          createdAt: existing.createdAt,
          selectedOptions: existing.selectedOptions as Record<string, string> | null,
        });
        await sendOrderConfirmedEmail({
          email: existing.customerEmail,
          name: existing.customerName,
          orderId: existing.orderId,
          tierName: existing.tierName,
          tierPrice: Number(existing.tierPrice),
          invoicePdf,
        });
        console.log(`Order confirmation email with invoice sent to ${existing.customerEmail}`);
      } catch (emailErr) {
        console.error(`Failed to send order confirmation email:`, emailErr);
      }

      // Auto-create customer account
      try {
        const existingCustomer = await prisma.customer.findUnique({
          where: { email: existing.customerEmail },
        });
        if (!existingCustomer) {
          const customerPassword = generatePassword(10);
          const passwordHash = await bcrypt.hash(customerPassword, 10);
          await prisma.customer.create({
            data: {
              email: existing.customerEmail,
              name: existing.customerName,
              passwordHash,
            },
          });
          await sendAccountCreatedEmail({
            email: existing.customerEmail,
            name: existing.customerName,
            password: customerPassword,
          });
          console.log(`Customer account created for ${existing.customerEmail}`);
        }
      } catch (custErr) {
        console.error(`Customer creation error:`, custErr);
      }

      // TODO: Auto-create chat instance via dutchchat hostpanel API
    }

    return NextResponse.json({
      ...updated,
      tierPrice: Number(updated.tierPrice),
    });
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({ where: { id: Number(orderId) } });
    return NextResponse.json({ ok: true, message: `Order ${order.orderId} deleted` });
  } catch (err) {
    console.error("Order delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
