import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import { getDaysUntilBirthday, formatMonthDay } from "@/lib/birthdays";
import { requireMember } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = requireMember(request);
  if (authError) return authError;

  try {
    await connectDB();

    const now = new Date();
    const currentMonth = now.getMonth();

    // Find active members with a recorded birthday
    const adultBirthdayCutoff = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate());
    const members = await Member.find({
      isActive: true,
      shareBirthdayWithMembers: true,
      birthday: { $exists: true, $ne: null, $lte: adultBirthdayCutoff },
    }).select("fullName birthday").setOptions({ maxTimeMS: 5000 });

    const todayList: { name: string; birthdayDate: string }[] = [];
    const thisWeekList: {
      name: string;
      birthdayDate: string;
      isToday: boolean;
      daysUntil: number;
    }[] = [];
    const thisMonthList: { name: string; birthdayDate: string }[] = [];

    for (const m of members) {
      if (!m.birthday) continue;
      const bDate = new Date(m.birthday);
      if (isNaN(bDate.getTime())) continue;

      const daysUntil = getDaysUntilBirthday(bDate, now);
      const isToday = daysUntil === 0;
      const isThisWeek = daysUntil >= 0 && daysUntil <= 7;
      const isThisMonth = bDate.getMonth() === currentMonth;
      const birthdayDate = formatMonthDay(bDate);

      const firstName = m.fullName.trim().split(/\s+/)[0];
      if (!firstName) continue;
      const privacySafeItem = {
        name: firstName,
        birthdayDate,
      };

      if (isToday) {
        todayList.push(privacySafeItem);
      }
      if (isThisWeek) {
        thisWeekList.push({
          ...privacySafeItem,
          isToday,
          daysUntil,
        });
      }
      if (isThisMonth) {
        thisMonthList.push(privacySafeItem);
      }
    }

    // Sort this week by upcoming days
    thisWeekList.sort((a, b) => a.daysUntil - b.daysUntil);

    return NextResponse.json(
      {
        today: todayList,
        thisWeek: thisWeekList,
        thisMonth: thisMonthList,
        totalThisWeek: thisWeekList.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load birthdays." }, { status: 500 });
  }
}
