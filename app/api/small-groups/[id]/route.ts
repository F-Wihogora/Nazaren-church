import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SmallGroup from "@/models/SmallGroup";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const smallGroup = await SmallGroup.findById(params.id).populate("members");
    if (!smallGroup) {
      return NextResponse.json({ error: "Small group not found" }, { status: 404 });
    }
    return NextResponse.json({ smallGroup }, { status: 200 });
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
    const smallGroup = await SmallGroup.findByIdAndUpdate(params.id, body, { new: true }).populate(
      "members"
    );
    if (!smallGroup) {
      return NextResponse.json({ error: "Small group not found" }, { status: 404 });
    }
    return NextResponse.json({ smallGroup }, { status: 200 });
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
    const smallGroup = await SmallGroup.findByIdAndDelete(params.id);
    if (!smallGroup) {
      return NextResponse.json({ error: "Small group not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Small group deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

