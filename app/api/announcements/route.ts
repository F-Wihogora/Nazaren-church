import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");
    const type = searchParams.get("type");

    let query: any = {};

    if (active === "true") {
      query.isActive = true;
    }

    if (type) {
      query.type = type;
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ announcements }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const announcement = await Announcement.create(body);
    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

