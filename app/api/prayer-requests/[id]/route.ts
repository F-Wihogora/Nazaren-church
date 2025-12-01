import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const prayerRequest = await PrayerRequest.findByIdAndUpdate(params.id, body, { new: true });
    if (!prayerRequest) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }
    return NextResponse.json({ prayerRequest }, { status: 200 });
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
    const prayerRequest = await PrayerRequest.findByIdAndDelete(params.id);
    if (!prayerRequest) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Prayer request deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

