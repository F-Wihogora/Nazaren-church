"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Users,
  Building2,
  Bell,
  Heart,
  UserPlus,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    sermons: 0,
    events: 0,
    members: 0,
    ministries: 0,
    announcements: 0,
    prayerRequests: 0,
    visitors: 0,
    givingTotal: 0,
  });

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/admin/login");
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [
        sermonsRes,
        eventsRes,
        membersRes,
        ministriesRes,
        announcementsRes,
        prayerRes,
        visitorsRes,
        givingRes,
      ] = await Promise.all([
        fetch("/api/sermons"),
        fetch("/api/events"),
        fetch("/api/members"),
        fetch("/api/ministries"),
        fetch("/api/announcements"),
        fetch("/api/prayer-requests"),
        fetch("/api/visitors"),
        fetch("/api/giving-records"),
      ]);

      const sermons = await sermonsRes.json();
      const events = await eventsRes.json();
      const members = await membersRes.json();
      const ministries = await ministriesRes.json();
      const announcements = await announcementsRes.json();
      const prayer = await prayerRes.json();
      const visitors = await visitorsRes.json();
      const giving = await givingRes.json();

      const givingTotal = (giving.givingRecords || []).reduce(
        (sum: number, record: any) => sum + (record.amount || 0),
        0
      );

      setStats({
        sermons: sermons.sermons?.length || 0,
        events: events.events?.length || 0,
        members: members.members?.length || 0,
        ministries: ministries.ministries?.length || 0,
        announcements: announcements.announcements?.length || 0,
        prayerRequests: prayer.prayerRequests?.length || 0,
        visitors: visitors.visitors?.length || 0,
        givingTotal,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    { label: "Sermons", value: stats.sermons, icon: BookOpen, href: "/admin/sermons" },
    { label: "Events", value: stats.events, icon: Calendar, href: "/admin/events" },
    { label: "Members", value: stats.members, icon: Users, href: "/admin/members" },
    { label: "Ministries", value: stats.ministries, icon: Building2, href: "/admin/ministries" },
    {
      label: "Announcements",
      value: stats.announcements,
      icon: Bell,
      href: "/admin/announcements",
    },
    {
      label: "Prayer Requests",
      value: stats.prayerRequests,
      icon: Heart,
      href: "/admin/prayer-requests",
    },
    { label: "Visitors", value: stats.visitors, icon: UserPlus, href: "/admin/visitors" },
    {
      label: "Total Giving",
      value: `$${stats.givingTotal.toLocaleString()}`,
      icon: DollarSign,
      href: "/admin/giving",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
