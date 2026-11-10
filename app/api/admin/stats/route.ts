import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Sermon from "@/models/Sermon";
import Event from "@/models/Event";
import Member from "@/models/Member";
import Ministry from "@/models/Ministry";
import Announcement from "@/models/Announcement";
import PrayerRequest from "@/models/PrayerRequest";
import Visitor from "@/models/Visitor";
import Contact from "@/models/Contact";
import SmallGroup from "@/models/SmallGroup";
import GivingRecord from "@/models/GivingRecord";
import Family from "@/models/Family";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const [
      sermons,
      events,
      members,
      ministries,
      announcements,
      prayerRequests,
      visitors,
      contacts,
      smallGroups,
      givingAgg,
      pendingPrayers,
      families,
    ] = await Promise.all([
      Sermon.countDocuments(),
      Event.countDocuments(),
      Member.countDocuments(),
      Ministry.countDocuments(),
      Announcement.countDocuments(),
      PrayerRequest.countDocuments(),
      Visitor.countDocuments(),
      Contact.countDocuments(),
      SmallGroup.countDocuments(),
      GivingRecord.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      PrayerRequest.countDocuments({ status: "pending" }),
      Family.countDocuments(),
    ]);
    const givingTotal = givingAgg[0]?.total ?? 0;
    return NextResponse.json({
      stats: {
        sermons,
        events,
        members,
        ministries,
        announcements,
        prayerRequests,
        visitors,
        contacts,
        smallGroups,
        givingTotal,
        pendingPrayers,
        families,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load dashboard stats.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
