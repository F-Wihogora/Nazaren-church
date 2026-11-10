import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Milestone from "@/models/Milestone";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const memberId = request.nextUrl.searchParams.get("memberId");
    const query = memberId ? { member: memberId } : {};
    const milestones = await Milestone.find(query)
      .populate("member", "fullName email")
      .sort({ date: -1 })
      .limit(100);
    return NextResponse.json({ milestones }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load milestones.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    if (!body.member || !body.type || !body.date) {
      return NextResponse.json({ error: "Member, type, and date are required." }, { status: 400 });
    }
    const milestone = await Milestone.create({
      member: body.member,
      type: body.type,
      date: new Date(body.date),
      notes: body.notes,
    });
    const populated = await Milestone.findById(milestone._id).populate("member", "fullName");
    return NextResponse.json({ milestone: populated }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save milestone.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
