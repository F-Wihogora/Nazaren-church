import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { readSession, requireMember } from "@/lib/auth";
import Member from "@/models/Member";
import "@/models/Family";
import "@/models/Ministry";

export async function GET(request: NextRequest) {
  const authError = requireMember(request);
  if (authError) return authError;
  try {
    await connectDB();
    const session = readSession(request)!;
    const member = await Member.findById(session.sub)
      .populate("ministries", "name division")
      .populate({ path: "family", populate: { path: "members", select: "fullName division role" } })
      .lean();
    if (!member) return NextResponse.json({ error: "Member profile not found." }, { status: 404 });
    return NextResponse.json({ member }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireMember(request);
  if (authError) return authError;
  try {
    await connectDB();
    const session = readSession(request)!;
    const body = await request.json();

    const updateFields: Record<string, any> = {};
    if (typeof body.phone === "string") updateFields.phone = body.phone.trim();
    if (typeof body.address === "string") updateFields.address = body.address.trim();
    if (["Male", "Female", "Other"].includes(body.gender)) updateFields.gender = body.gender;
    if (body.birthday) updateFields.birthday = new Date(body.birthday);
    if (typeof body.shareBirthdayWithMembers === "boolean") {
      updateFields.shareBirthdayWithMembers = body.shareBirthdayWithMembers;
    }

    const member = await Member.findByIdAndUpdate(session.sub, updateFields, { new: true })
      .populate("ministries", "name division")
      .populate({ path: "family", populate: { path: "members", select: "fullName division role" } })
      .lean();

    if (!member) return NextResponse.json({ error: "Member profile not found." }, { status: 404 });
    return NextResponse.json({ member, message: "Profile updated successfully." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
