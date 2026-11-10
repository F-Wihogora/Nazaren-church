import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Visitor from "@/models/Visitor";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    return NextResponse.json({ visitors }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const visitor = await Visitor.create({ name: String(body.name || "").trim().slice(0, 100), contact: String(body.contact || "").trim().slice(0, 200), howFound: String(body.howFound || "").trim().slice(0, 100), wantsFollowUp: Boolean(body.wantsFollowUp), notes: String(body.notes || "").trim().slice(0, 2000) });
    return NextResponse.json({ visitor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

