import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, readSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = readSession(request);
  return NextResponse.json({ user: session ? { name: session.name, email: session.email, role: session.role } : null }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
