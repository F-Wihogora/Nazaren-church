import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GivingRecord from "@/models/GivingRecord";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const purpose = searchParams.get("purpose");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let query: any = {};

    if (purpose) {
      query.purpose = purpose;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const givingRecords = await GivingRecord.find(query).sort({ date: -1 });

    return NextResponse.json({ givingRecords }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const givingRecord = await GivingRecord.create(body);
    return NextResponse.json({ givingRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

