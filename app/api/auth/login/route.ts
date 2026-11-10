import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import MemberCredential from "@/models/MemberCredential";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 200) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

    const admin = await AdminUser.findOne({ email });
    if (admin && await admin.comparePassword(password)) {
      const response = NextResponse.json({ user: { email: admin.email, name: admin.name, role: admin.role } });
      setSessionCookie(response, createSessionToken({ sub: String(admin._id), email: admin.email, name: admin.name, role: admin.role }));
      return response;
    }
    const credential = await MemberCredential.findOne({ email }).select("+passwordHash").populate("member");
    if (credential && await credential.comparePassword(password)) {
      const member = credential.member as any;
      const response = NextResponse.json({ user: { email: credential.email, name: member.fullName, role: "member" } });
      setSessionCookie(response, createSessionToken({ sub: String(member._id), email: credential.email, name: member.fullName, role: "member" }));
      return response;
    }
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
