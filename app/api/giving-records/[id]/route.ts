import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GivingRecord from "@/models/GivingRecord";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const givingRecord = await GivingRecord.findByIdAndUpdate(params.id, body, { new: true });
    if (!givingRecord) {
      return NextResponse.json({ error: "Giving record not found" }, { status: 404 });
    }
    return NextResponse.json({ givingRecord }, { status: 200 });
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
    const givingRecord = await GivingRecord.findByIdAndDelete(params.id);
    if (!givingRecord) {
      return NextResponse.json({ error: "Giving record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Giving record deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

