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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sermons", label: "Sermons", icon: BookOpen },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/members", label: "Members", icon: Users },
    { href: "/admin/ministries", label: "Ministries", icon: Building2 },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/prayer-requests", label: "Prayer Requests", icon: Heart },
    { href: "/admin/visitors", label: "Visitors", icon: UserPlus },
    { href: "/admin/giving", label: "Giving Records", icon: DollarSign },
    { href: "/admin/small-groups", label: "Small Groups", icon: UsersRound },
  ];

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r z-40 transition-transform duration-300`}
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Nazarene Church</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {admin && (
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {admin.name}</h1>
                <p className="text-muted-foreground">{admin.email}</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

