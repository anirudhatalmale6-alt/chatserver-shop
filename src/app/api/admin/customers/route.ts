import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/adminAuth";

const DUTCHCHAT_URL = process.env.DUTCHCHAT_URL || "https://127.0.0.1:443";

async function getDutchChatToken(): Promise<string | null> {
  try {
    const res = await fetch(`${DUTCHCHAT_URL}/hostpanel/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.DUTCHCHAT_HOST_USER || "admin",
        password: process.env.DUTCHCHAT_HOST_PASS || "admin",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "50")));
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() || "";
  const customerId = searchParams.get("id");

  if (customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(customerId) },
      include: {
        loginLogs: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { customerEmail: customer.email },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, orderId: true, tierName: true, tierPrice: true,
        paymentMethod: true, paymentStatus: true, createdAt: true, confirmedAt: true,
        totalPrice: true, optionsPrice: true, oneTimeFees: true, notes: true,
      },
    });

    return NextResponse.json({ customer, orders });
  }

  const where = search
    ? { OR: [
        { email: { contains: search, mode: "insensitive" as const } },
        { name: { contains: search, mode: "insensitive" as const } },
      ]}
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true, email: true, name: true, active: true, banned: true,
        banReason: true, createdAt: true, lastLogin: true,
        _count: { select: { loginLogs: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const customersWithOrders = await Promise.all(
    customers.map(async (c) => {
      const [orderCount, cmsOrders] = await Promise.all([
        prisma.order.count({ where: { customerEmail: c.email } }),
        prisma.order.count({
          where: {
            customerEmail: c.email,
            notes: { contains: "[CMS Auto-Created]" },
          },
        }),
      ]);
      return { ...c, orderCount, cmsCount: cmsOrders };
    })
  );

  return NextResponse.json({
    customers: customersWithOrders,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { customerId, action, banReason } = body;

  if (!customerId || !action) {
    return NextResponse.json({ error: "customerId and action are required" }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  if (action === "activate") {
    await prisma.customer.update({ where: { id: customer.id }, data: { active: true, banned: false, banReason: null } });
  } else if (action === "deactivate") {
    await prisma.customer.update({ where: { id: customer.id }, data: { active: false } });
  } else if (action === "ban") {
    await prisma.customer.update({ where: { id: customer.id }, data: { banned: true, banReason: banReason || null } });
  } else if (action === "unban") {
    await prisma.customer.update({ where: { id: customer.id }, data: { banned: false, banReason: null } });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");
    if (!customerId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    // Find orders with CMS notes to extract CMS IDs for deletion
    const orders = await prisma.order.findMany({
      where: { customerEmail: customer.email },
      select: { id: true, notes: true },
    });

    const cmsDeleted: string[] = [];
    const cmsFailed: string[] = [];

    // Delete chat instances linked to this customer's orders
    const token = await getDutchChatToken();
    for (const order of orders) {
      if (!order.notes) continue;
      const match = order.notes.match(/\[CMS Auto-Created\] ID: (\S+)/);
      if (!match) continue;
      const instanceId = match[1];
      try {
        if (token) {
          const delRes = await fetch(`${DUTCHCHAT_URL}/hostpanel/api/instances/${instanceId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (delRes.ok) {
            cmsDeleted.push(instanceId);
          } else {
            cmsFailed.push(instanceId);
          }
        } else {
          cmsFailed.push(instanceId);
        }
      } catch (err) {
        console.error(`Failed to delete chat instance ${instanceId}:`, err);
        cmsFailed.push(instanceId);
      }
    }

    // Delete customer login logs, orders, then customer
    await prisma.customerLoginLog.deleteMany({ where: { customerId: customer.id } });
    await prisma.order.deleteMany({ where: { customerEmail: customer.email } });
    await prisma.customer.delete({ where: { id: customer.id } });

    return NextResponse.json({
      ok: true,
      message: `Customer ${customer.email} deleted`,
      cmsDeleted,
      cmsFailed,
    });
  } catch (err) {
    console.error("Customer delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
