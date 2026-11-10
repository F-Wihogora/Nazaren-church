import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Visitor from "@/models/Visitor";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const visitor = await Visitor.findById(params.id);
    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }
    return NextResponse.json({ visitor }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const visitor = await Visitor.findByIdAndUpdate(params.id, body, { new: true });
    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }
    return NextResponse.json({ visitor }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const visitor = await Visitor.findByIdAndDelete(params.id);
    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Visitor deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
