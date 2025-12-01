import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Visitor from "@/models/Visitor";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    return NextResponse.json({ visitors }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const visitor = await Visitor.create(body);
    return NextResponse.json({ visitor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

