import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sermon from "@/models/Sermon";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const preacher = searchParams.get("preacher");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let query: any = {};

    if (preacher) {
      query.preacher = { $regex: preacher, $options: "i" };
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    let sermonsQuery = Sermon.find(query).sort({ date: -1 });

    if (limit) {
      sermonsQuery = sermonsQuery.limit(parseInt(limit));
    }

    const sermons = await sermonsQuery;

    return NextResponse.json({ sermons }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const sermon = await Sermon.create(body);
    return NextResponse.json({ sermon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

