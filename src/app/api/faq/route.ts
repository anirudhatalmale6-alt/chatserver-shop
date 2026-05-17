import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faqs = await prisma.faqItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, question: true, answer: true },
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json([]);
  }
}
