import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sermon from "@/models/Sermon";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const sermon = await Sermon.findById(params.id);
    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json({ sermon }, { status: 200 });
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
    const sermon = await Sermon.findByIdAndUpdate(params.id, body, { new: true });
    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json({ sermon }, { status: 200 });
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
    const sermon = await Sermon.findByIdAndDelete(params.id);
    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sermon deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

