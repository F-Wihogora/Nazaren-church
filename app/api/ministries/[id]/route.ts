import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ministry from "@/models/Ministry";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const ministry = await Ministry.findById(params.id).populate("members");
    if (!ministry) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }
    return NextResponse.json({ ministry }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const ministry = await Ministry.findByIdAndUpdate(params.id, body, { new: true }).populate(
      "members"
    );
    if (!ministry) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }
    return NextResponse.json({ ministry }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const ministry = await Ministry.findByIdAndDelete(params.id);
    if (!ministry) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ministry deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

