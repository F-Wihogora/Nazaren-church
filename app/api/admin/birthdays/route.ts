import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Member from "@/models/Member";
import { getDaysUntilBirthday, calculateAge, formatMonthDay, AdminBirthdayRecord } from "@/lib/birthdays";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all"; // "today" | "week" | "month" | "all"
    const search = searchParams.get("search") || "";

    const now = new Date();
    const currentMonth = now.getMonth();

    const members = await Member.find({
      isActive: true,
      birthday: { $exists: true, $ne: null },
    }).select("fullName email phone gender division birthday role");

    let countToday = 0;
    let countThisWeek = 0;
    let countThisMonth = 0;

    const allRecords: AdminBirthdayRecord[] = [];

    for (const m of members) {
      if (!m.birthday) continue;
      const bDate = new Date(m.birthday);
      if (isNaN(bDate.getTime())) continue;

      const daysUntil = getDaysUntilBirthday(bDate, now);
      const isToday = daysUntil === 0;
      const isThisWeek = daysUntil >= 0 && daysUntil <= 7;
      const isThisMonth = bDate.getMonth() === currentMonth;

      if (isToday) countToday++;
      if (isThisWeek) countThisWeek++;
      if (isThisMonth) countThisMonth++;

      const record: AdminBirthdayRecord = {
        _id: String(m._id),
        fullName: m.fullName,
        email: m.email || undefined,
        phone: m.phone || undefined,
        gender: m.gender || undefined,
        division: m.division || undefined,
        birthday: m.birthday.toISOString(),
        birthdayFormatted: formatMonthDay(bDate),
        birthDateFull: `${formatMonthDay(bDate)}, ${bDate.getFullYear()}`,
        age: calculateAge(bDate, now),
        daysUntil,
        isToday,
        isThisWeek,
        isThisMonth,
      };

      allRecords.push(record);
    }

    // Apply filtering
    let filtered = allRecords;

    if (filter === "today") {
      filtered = filtered.filter((r) => r.isToday);
    } else if (filter === "week") {
      filtered = filtered.filter((r) => r.isThisWeek);
    } else if (filter === "month") {
      filtered = filtered.filter((r) => r.isThisMonth);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          (r.phone && r.phone.toLowerCase().includes(q)) ||
          (r.division && r.division.toLowerCase().includes(q))
      );
    }

    // Sort by upcoming days
    filtered.sort((a, b) => a.daysUntil - b.daysUntil);

    return NextResponse.json(
      {
        birthdays: filtered,
        summary: {
          today: countToday,
          thisWeek: countThisWeek,
          thisMonth: countThisMonth,
          total: allRecords.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load admin birthdays." },
      { status: 500 }
    );
  }
}
