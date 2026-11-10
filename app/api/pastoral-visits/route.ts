import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import PastoralVisit from "@/models/PastoralVisit";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const visits = await PastoralVisit.find()
      .populate("member", "fullName phone email")
      .sort({ date: -1 })
      .limit(100);
    return NextResponse.json({ visits }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load pastoral visits.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    if (!body.member || !body.visitType || !body.date || !body.leader) {
      return NextResponse.json({ error: "Member, visit type, date, and leader are required." }, { status: 400 });
    }
    const visit = await PastoralVisit.create({
      member: body.member,
      visitType: body.visitType,
      date: new Date(body.date),
      leader: String(body.leader).trim(),
      notes: body.notes,
    });
    const populated = await PastoralVisit.findById(visit._id).populate("member", "fullName");
    return NextResponse.json({ visit: populated }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save visit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
