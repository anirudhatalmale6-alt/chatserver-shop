import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromRequest as verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const faqs = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const faq = await prisma.faqItem.create({
    data: {
      question: body.question || "",
      answer: body.answer || "",
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(faq);
}

export async function PUT(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const faq = await prisma.faqItem.update({
    where: { id: body.id },
    data: {
      question: body.question,
      answer: body.answer,
      active: body.active,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(faq);
}

export async function DELETE(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.faqItem.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
