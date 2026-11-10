import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Milestone from "@/models/Milestone";
import Family from "@/models/Family";
import GivingRecord from "@/models/GivingRecord";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [
      membersByDivision,
      roleAgg,
      newMembers,
      baptized,
      families,
      recentAttendance,
      givingAgg,
      baptismMilestones,
    ] = await Promise.all([
      Member.aggregate([{ $group: { _id: "$division", count: { $sum: 1 } } }]),
      Member.aggregate([
        { $unwind: { path: "$churchRoles", preserveNullAndEmptyArrays: true } },
        { $group: { _id: { $ifNull: ["$churchRoles.role", "$role"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Member.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Member.countDocuments({ baptismStatus: true }),
      Family.countDocuments(),
      Attendance.find().sort({ date: -1 }).limit(5).select("date serviceType presentMembers"),
      GivingRecord.aggregate([{ $group: { _id: "$purpose", total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
      Milestone.countDocuments({ type: "Baptism" }),
    ]);

    const attendanceSummary = recentAttendance.map((a) => ({
      date: a.date,
      serviceType: a.serviceType,
      count: a.presentMembers?.length ?? 0,
    }));

    return NextResponse.json({
      reports: {
        membersByDivision,
        membersByRole: roleAgg,
        newMembersLast30Days: newMembers,
        baptizedMembers: baptized,
        baptismMilestones,
        families,
        recentAttendance: attendanceSummary,
        givingByPurpose: givingAgg,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to generate reports.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
