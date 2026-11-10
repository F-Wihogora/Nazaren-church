import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Family from "@/models/Family";
import { syncFamilyMembers } from "@/lib/sync-family";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const families = await Family.find()
      .populate("head", "fullName email")
      .populate("members", "fullName email division role")
      .sort({ name: 1 });
    return NextResponse.json({ families }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load families.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2) return NextResponse.json({ error: "Family name is required." }, { status: 400 });
    const memberIds = Array.isArray(body.members) ? body.members.map(String) : [];
    const family = await Family.create({
      name,
      head: body.head || undefined,
      members: memberIds,
      division: body.division || "General",
      address: body.address,
      phone: body.phone,
      notes: body.notes,
    });
    await syncFamilyMembers(family._id, memberIds);
    const populated = await Family.findById(family._id)
      .populate("head", "fullName email")
      .populate("members", "fullName email division role");
    return NextResponse.json({ family: populated }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create family.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
