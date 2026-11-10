import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Family from "@/models/Family";
import { syncFamilyMembers } from "@/lib/sync-family";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const memberIds = Array.isArray(body.members) ? body.members.map(String) : undefined;
    const family = await Family.findByIdAndUpdate(
      params.id,
      {
        ...(body.name && { name: String(body.name).trim() }),
        ...(body.head !== undefined && { head: body.head || null }),
        ...(memberIds && { members: memberIds }),
        ...(body.division && { division: body.division }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      { new: true }
    );
    if (!family) return NextResponse.json({ error: "Family not found" }, { status: 404 });
    if (memberIds) await syncFamilyMembers(family._id, memberIds);
    const populated = await Family.findById(family._id)
      .populate("head", "fullName email")
      .populate("members", "fullName email division role");
    return NextResponse.json({ family: populated }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update family.";
    return NextResponse.json({ error: message }, { status: 500 });
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
    await syncFamilyMembers(params.id, []);
    const family = await Family.findByIdAndDelete(params.id);
    if (!family) return NextResponse.json({ error: "Family not found" }, { status: 404 });
    return NextResponse.json({ message: "Family deleted" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to delete family.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
