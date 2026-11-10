"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sparkles,
  Users,
  Lock,
  Heart,
  UserPlus,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/sermons", label: "Sermons" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const actionLinks = [
    { href: "/prayer-request", label: "Prayer" },
    { href: "/visitor-registration", label: "Visit Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm transition-all">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Church Branding & Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="Nazarene Church Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-full bg-white p-0.5 shadow-sm border"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-700 dark:to-blue-400 bg-clip-text text-transparent leading-none">
                  NAZARENE
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  Remera Church
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <span className="h-4 w-px bg-border/80 mx-1" />

            {actionLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/account">
              <Button
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" /> Member Portal
              </Button>
            </Link>

            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Lock className="w-3 h-3 mr-1.5" /> Staff
              </Button>
            </Link>

            <ThemeToggle showSystem />
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle showSystem />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-xl"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden border-t py-4 space-y-3"
          >
            <div className="space-y-1">
              {[...mainLinks, ...actionLinks].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t space-y-2">
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full h-10 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  <Users className="w-3.5 h-3.5 mr-1.5" /> Member Portal
                </Button>
              </Link>

              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-medium">
                  <Lock className="w-3.5 h-3.5 mr-1.5" /> Church Staff Login
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
