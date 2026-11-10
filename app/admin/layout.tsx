"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  Building2,
  Bell,
  Heart,
  UserPlus,
  DollarSign,
  UsersRound,
  Mail,
  Home,
  ClipboardList,
  Award,
  BarChart3,
  LogOut,
  Menu,
  X,
  Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setChecking(false); return; }
    fetch("/api/auth/session").then((res) => res.json()).then(({ user }) => {
      if (!user || !["admin", "superadmin"].includes(user.role)) router.replace("/admin/login");
      else setAdmin(user);
    }).catch(() => router.replace("/admin/login")).finally(() => setChecking(false));
  }, [pathname, router]);

  const handleLogout = () => {
    fetch("/api/auth/session", { method: "DELETE" }).finally(() => {
      window.location.href = "/admin/login";
    });
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sermons", label: "Sermons", icon: BookOpen },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/members", label: "Members", icon: Users },
    { href: "/admin/birthdays", label: "Birthdays", icon: Cake },
    { href: "/admin/families", label: "Families", icon: Home },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardList },
    { href: "/admin/milestones", label: "Milestones & Care", icon: Award },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/ministries", label: "Ministries", icon: Building2 },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/prayer-requests", label: "Prayer Requests", icon: Heart },
    { href: "/admin/visitors", label: "Visitors", icon: UserPlus },
    { href: "/admin/contacts", label: "Contact Messages", icon: Mail },
    { href: "/admin/giving", label: "Giving Records", icon: DollarSign },
    { href: "/admin/small-groups", label: "Small Groups", icon: UsersRound },
  ];

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }
  if (checking || !admin) return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Checking your secure session…</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2.5">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain rounded-full bg-white p-0.5 shadow-sm" />
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle showSystem />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r z-40 transition-transform duration-300 flex flex-col justify-between`}
        >
          <div className="p-4 border-b shrink-0 flex items-center space-x-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain rounded-full bg-white p-0.5 shadow-sm shrink-0" />
            <div>
              <h2 className="text-sm font-bold leading-tight">REMERA NAZARENE</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center space-x-3 p-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t space-y-2 bg-card shrink-0">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle showSystem />
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {admin && (
            <div className="mb-6 flex justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {admin.name}</h1>
                <p className="text-muted-foreground">{admin.email}</p>
              </div>
              <ThemeToggle showSystem className="hidden lg:inline-flex" />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

