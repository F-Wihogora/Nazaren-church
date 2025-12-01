import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const isPublic = searchParams.get("isPublic");

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (isPublic === "true") {
      query.isPublic = true;
    }

    const prayerRequests = await PrayerRequest.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ prayerRequests }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const prayerRequest = await PrayerRequest.create(body);
    return NextResponse.json({ prayerRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

