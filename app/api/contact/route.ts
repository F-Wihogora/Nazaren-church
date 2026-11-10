import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Contact from "@/models/Contact";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load messages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Please enter your name, a valid email, and a message." }, { status: 400 });
    }
    const contact = await Contact.create({ name, email, phone: phone || undefined, message });
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
