import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requirePastoralTeam } from "@/lib/auth";
import PrayerRequest from "@/models/PrayerRequest";

export async function GET(request: NextRequest) {
  const authError = requirePastoralTeam(request);
  if (authError) return authError;
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
    const prayerRequest = await PrayerRequest.create({ name: String(body.name || "").trim().slice(0, 100), email: String(body.email || "").trim().slice(0, 200), phone: String(body.phone || "").trim().slice(0, 40), request: String(body.request || "").trim().slice(0, 5000), isPublic: false });
    return NextResponse.json({ prayerRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

