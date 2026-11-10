import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export type Session = { sub: string; email: string; name: string; role: "admin" | "superadmin" | "member" };
const COOKIE = "naz_session";
const secret = () => process.env.NEXTAUTH_SECRET;

export function createSessionToken(session: Session) {
  if (!secret() || secret()!.length < 32) throw new Error("NEXTAUTH_SECRET must be at least 32 characters.");
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })).toString("base64url");
  const signature = createHmac("sha256", secret()!).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readSession(request: NextRequest): Session | null {
  const token = request.cookies.get(COOKIE)?.value;
  const [payload, signature] = token?.split(".") ?? [];
  if (!payload || !signature || !secret() || secret()!.length < 32) return null;
  const expected = createHmac("sha256", secret()!).update(payload).digest();
  let actual: Buffer;
  try { actual = Buffer.from(signature, "base64url"); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session & { exp: number };
    if (data.exp < Date.now() / 1000 || !data.sub || !data.role) return null;
    return data;
  } catch { return null; }
}

export function unauthorized() { return NextResponse.json({ error: "Authentication required" }, { status: 401 }); }
export function forbidden() { return NextResponse.json({ error: "Administrator access required" }, { status: 403 }); }
export function requireAdmin(request: NextRequest) {
  const session = readSession(request);
  return session?.role === "admin" || session?.role === "superadmin" ? null : session ? forbidden() : unauthorized();
}

export function requireMember(request: NextRequest) {
  const session = readSession(request);
  if (!session) return unauthorized();
  if (session.role !== "member") return forbidden();
  return null;
}

export function requirePastoralTeam(request: NextRequest) {
  const session = readSession(request);
  if (!session) return unauthorized();
  if (session.role !== "admin" && session.role !== "superadmin") return forbidden();

  const allowedEmails = new Set(
    (process.env.PASTORAL_TEAM_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
  return allowedEmails.has(session.email.toLowerCase())
    ? null
    : NextResponse.json({ error: "Pastoral team access required" }, { status: 403 });
}
export function setSessionCookie(response: NextResponse, token: string) {
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export function clearSessionCookie(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
