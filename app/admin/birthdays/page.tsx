"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Cake,
  Search,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface BirthdayRecord {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  division?: string;
  birthday: string;
  birthdayFormatted: string;
  birthDateFull: string;
  age: number;
  daysUntil: number;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
}

interface Summary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

export default function AdminBirthdaysPage() {
  const [birthdays, setBirthdays] = useState<BirthdayRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({ today: 0, thisWeek: 0, thisMonth: 0, total: 0 });
  const [filter, setFilter] = useState<"week" | "today" | "month" | "all">("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBirthdays = async (currentFilter: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/birthdays?filter=${currentFilter}`);
      const data = await res.json();
      setBirthdays(data.birthdays || []);
      if (data.summary) setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching admin birthdays:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays(filter);
  }, [filter]);

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return birthdays;
    const q = searchTerm.toLowerCase();
    return birthdays.filter(
      (b) =>
        b.fullName.toLowerCase().includes(q) ||
        (b.phone && b.phone.toLowerCase().includes(q)) ||
        (b.division && b.division.toLowerCase().includes(q))
    );
  }, [birthdays, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Cake className="w-3.5 h-3.5" />
            <span>Church Pastoral Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Member Birthday Directory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track, celebrate, and send pastoral blessings for member birthdays.
          </p>
        </div>

        <Link href="/admin/members">
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
            <User className="w-3.5 h-3.5" /> View All Members
          </Button>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => setFilter("today")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            filter === "today" ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40"
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="text-2xl font-bold text-foreground">{summary.today}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 flex items-center justify-center font-bold">
              🎂
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilter("week")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            filter === "week" ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40"
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">This Week</p>
              <p className="text-2xl font-bold text-foreground">{summary.thisWeek}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilter("month")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            filter === "month" ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40"
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">This Month</p>
              <p className="text-2xl font-bold text-foreground">{summary.thisMonth}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilter("all")}
          className={`cursor-pointer transition-all rounded-2xl border ${
            filter === "all" ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40"
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recorded</p>
              <p className="text-2xl font-bold text-foreground">{summary.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-card border">
        {/* Segmented Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setFilter("week")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "week" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            This Week ({summary.thisWeek})
          </button>
          <button
            type="button"
            onClick={() => setFilter("today")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "today" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Today ({summary.today})
          </button>
          <button
            type="button"
            onClick={() => setFilter("month")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "month" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            This Month ({summary.thisMonth})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Recorded ({summary.total})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Main Table View */}
      <Card className="rounded-3xl border border-border/80 overflow-hidden shadow-sm bg-card">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
            <p>Loading member birthdays...</p>
          </div>
        ) : filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground text-left">
                  <th className="py-3 px-4 font-semibold">Member Name</th>
                  <th className="py-3 px-4 font-semibold">Birthday</th>
                  <th className="py-3 px-4 font-semibold">Age</th>
                  <th className="py-3 px-4 font-semibold">Division</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredList.map((member) => (
                  <tr key={member._id} className="hover:bg-muted/20 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-sm text-foreground">{member.fullName}</p>
                      <p className="text-[11px] text-muted-foreground">{member.birthDateFull}</p>
                    </td>

                    {/* Birthday */}
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {member.birthdayFormatted}
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 font-medium">
                      {member.age > 0 ? `${member.age} yrs` : "—"}
                    </td>

                    {/* Division */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                        {member.division || "General"}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {member.phone ? (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-primary" />
                          <span>{member.phone}</span>
                        </div>
                      ) : member.email ? (
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-primary" />
                          <span>{member.email}</span>
                        </div>
                      ) : (
                        <span className="italic text-muted-foreground/60">None</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-right">
                      {member.isToday ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs animate-pulse">
                          🎉 Celebrating Today!
                        </span>
                      ) : member.daysUntil === 1 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-200">
                          Tomorrow
                        </span>
                      ) : member.daysUntil <= 7 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                          In {member.daysUntil} days
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          {member.birthdayFormatted}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <Cake className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="font-semibold text-sm text-foreground">No member birthdays found</p>
            <p>
              {filter === "today"
                ? "No church members have a birthday today."
                : filter === "week"
                ? "No church members are celebrating a birthday this week."
                : filter === "month"
                ? "No birthdays recorded in the current calendar month."
                : "No members have recorded date of birth records yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
