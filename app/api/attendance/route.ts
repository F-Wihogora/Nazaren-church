import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Attendance from "@/models/Attendance";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50", 10);
    const records = await Attendance.find()
      .populate("presentMembers", "fullName division")
      .populate("ministry", "name")
      .sort({ date: -1 })
      .limit(limit);
    return NextResponse.json({ attendance: records }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load attendance.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const record = await Attendance.create({
      date: body.date ? new Date(body.date) : new Date(),
      serviceType: body.serviceType || "Sunday Service",
      ministry: body.ministry || undefined,
      presentMembers: Array.isArray(body.presentMembers) ? body.presentMembers : [],
      notes: body.notes,
    });
    const populated = await Attendance.findById(record._id)
      .populate("presentMembers", "fullName division")
      .populate("ministry", "name");
    return NextResponse.json({ attendance: populated }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save attendance.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
