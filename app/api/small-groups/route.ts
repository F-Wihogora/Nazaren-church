import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SmallGroup from "@/models/SmallGroup";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const smallGroups = await SmallGroup.find().populate("members").sort({ name: 1 });
    return NextResponse.json({ smallGroups }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const smallGroup = await SmallGroup.create(body);
    return NextResponse.json({ smallGroup }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

