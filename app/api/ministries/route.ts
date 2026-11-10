import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Ministry from "@/models/Ministry";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const ministries = await Ministry.find().sort({ name: 1 });
    return NextResponse.json({ ministries }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const ministry = await Ministry.create(body);
    return NextResponse.json({ ministry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
