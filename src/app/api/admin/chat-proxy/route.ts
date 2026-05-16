import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = req.nextUrl.searchParams.get("path") || "/api/instances";
  const token = await getDutchChatToken();
  if (!token) return NextResponse.json({ error: "Cannot connect to chat backend" }, { status: 502 });

  try {
    const res = await fetch(`${DUTCHCHAT_URL}/hostpanel${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Backend error" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = req.nextUrl.searchParams.get("path") || "/api/instances";
  const body = await req.json().catch(() => ({}));
  const token = await getDutchChatToken();
  if (!token) return NextResponse.json({ error: "Cannot connect to chat backend" }, { status: 502 });

  try {
    const res = await fetch(`${DUTCHCHAT_URL}/hostpanel${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend error" }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = req.nextUrl.searchParams.get("path") || "";
  const token = await getDutchChatToken();
  if (!token) return NextResponse.json({ error: "Cannot connect to chat backend" }, { status: 502 });

  try {
    const res = await fetch(`${DUTCHCHAT_URL}/hostpanel${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend error" }, { status: 502 });
  }
}
