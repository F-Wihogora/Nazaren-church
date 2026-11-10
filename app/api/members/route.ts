import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Member from "@/models/Member";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const division = searchParams.get("division");
    const search = searchParams.get("search");
    const active = searchParams.get("active");

    const query: Record<string, unknown> = {};

    if (role) {
      query.$or = [{ role }, { "churchRoles.role": role }];
    }
    if (division) query.division = division;
    if (active === "true") query.isActive = true;
    if (active === "false") query.isActive = false;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const members = await Member.find(query)
      .populate("ministries")
      .populate("family", "name")
      .sort({ fullName: 1 });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load members.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    const churchRoles = Array.isArray(body.churchRoles) ? body.churchRoles : [];
    const primaryRole = body.role || churchRoles[0]?.role || "Member";
    const member = await Member.create({
      ...body,
      role: primaryRole,
      churchRoles: churchRoles.length
        ? churchRoles
        : [{ role: primaryRole, status: "active", assignedAt: new Date() }],
    });
    return NextResponse.json({ member }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
