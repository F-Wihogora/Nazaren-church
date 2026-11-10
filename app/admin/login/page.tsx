"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user?.role === "member") {
          window.location.href = "/account";
        } else if (data.user?.role === "admin" || data.user?.role === "superadmin") {
          window.location.href = "/admin";
        } else {
          setError("Your account does not have church administration privileges.");
        }
      } else {
        setError(data.error || "Invalid administrator credentials.");
      }
    } catch {
      setError("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle showSystem />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl border border-border/80 shadow-lg p-2 sm:p-4 bg-card">
          <CardHeader className="text-center space-y-3 pb-6">
            <div className="flex justify-center">
              <img
                src="/images/logo.png"
                alt="Church Logo"
                className="h-14 w-14 object-contain rounded-full bg-white p-1 shadow-sm border"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Personnel Only</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Staff &amp; Admin Portal</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Remera Church of the Nazarene • Church Management System
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs font-semibold">
                  Administrator Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@nazarene.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 rounded-xl text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm mt-2"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In to Administration"}
              </Button>
            </form>

            <div className="pt-4 border-t text-center space-y-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to main church website
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
