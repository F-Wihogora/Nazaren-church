"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Calendar, Users, Building2, Bell, Heart, UserPlus, DollarSign, Mail, UsersRound, Home, Cake,
} from "lucide-react";
import Link from "next/link";

type Stats = {
  sermons: number;
  events: number;
  members: number;
  ministries: number;
  announcements: number;
  prayerRequests: number;
  visitors: number;
  contacts: number;
  smallGroups: number;
  families: number;
  givingTotal: number;
  pendingPrayers: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    sermons: 0, events: 0, members: 0, ministries: 0,
    announcements: 0, prayerRequests: 0, visitors: 0, contacts: 0,
    smallGroups: 0, families: 0, givingTotal: 0, pendingPrayers: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.stats) setStats(d.stats); })
      .catch(console.error);
  }, []);

  const statCards = [
    { label: "Sermons", value: stats.sermons, icon: BookOpen, href: "/admin/sermons" },
    { label: "Events", value: stats.events, icon: Calendar, href: "/admin/events" },
    { label: "Members", value: stats.members, icon: Users, href: "/admin/members" },
    { label: "Birthdays", value: "Calendar & Care", icon: Cake, href: "/admin/birthdays" },
    { label: "Families", value: stats.families, icon: Home, href: "/admin/families" },
    { label: "Ministries", value: stats.ministries, icon: Building2, href: "/admin/ministries" },
    { label: "Small Groups", value: stats.smallGroups, icon: UsersRound, href: "/admin/small-groups" },
    { label: "Announcements", value: stats.announcements, icon: Bell, href: "/admin/announcements" },
    { label: "Prayer Requests", value: stats.prayerRequests, icon: Heart, href: "/admin/prayer-requests", hint: stats.pendingPrayers ? `${stats.pendingPrayers} pending` : undefined },
    { label: "Visitors", value: stats.visitors, icon: UserPlus, href: "/admin/visitors" },
    { label: "Contact Messages", value: stats.contacts, icon: Mail, href: "/admin/contacts" },
    { label: "Total Giving", value: `RWF ${stats.givingTotal.toLocaleString()}`, icon: DollarSign, href: "/admin/giving" },
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
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    {"hint" in card && card.hint && (
                      <p className="text-xs text-muted-foreground mt-1">{card.hint}</p>
                    )}
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
