"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Heart,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function PrayerRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "General Prayer",
    request: "",
    isPublic: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim() || "Anonymous",
          request: formData.request,
          isPublic: formData.isPublic,
          status: "pending",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", category: "General Prayer", request: "", isPublic: false });
      } else {
        setError("Failed to submit prayer request. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background border-b py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Intercessory Prayer Ministry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Submit a Prayer Request
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo;
            </p>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">
              — Philippians 4:6
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Form */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="rounded-3xl border border-border/80 p-6 sm:p-10 shadow-sm bg-card">
          <CardHeader className="p-0 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Pastoral Confidentiality Guaranteed</span>
            </div>
            <CardTitle className="text-2xl font-bold">How May We Pray for You?</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Our pastoral leadership and intercessory prayer team lift up every prayer request during our Friday revival services and weekly dawn prayers.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <h3 className="text-2xl font-bold text-foreground">We Are Praying With You</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your request has been received by our pastoral team. May God grant you His peace, strength, and divine breakthrough.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl text-xs mt-2"
                >
                  Submit Another Prayer Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-destructive/10 text-destructive p-3.5 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="prayer-name" className="text-xs font-semibold">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="prayer-name"
                    placeholder="Leave blank to remain anonymous"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    You may leave this blank if you prefer complete privacy.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prayer-category" className="text-xs font-semibold">
                    Prayer Category
                  </Label>
                  <Select
                    id="prayer-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="h-11 rounded-xl"
                  >
                    <option value="General Prayer">General Prayer Need</option>
                    <option value="Healing & Health">Healing &amp; Physical Health</option>
                    <option value="Family & Marriage">Family &amp; Marriage</option>
                    <option value="Spiritual Growth & Faith">Spiritual Growth &amp; Faith</option>
                    <option value="Employment & Financial Breakthrough">Employment &amp; Financial Breakthrough</option>
                    <option value="Comfort in Grief">Comfort &amp; Peace in Grief</option>
                    <option value="Thanksgiving & Praise">Thanksgiving &amp; Praise Report</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prayer-request" className="text-xs font-semibold">
                    Your Prayer Request
                  </Label>
                  <Textarea
                    id="prayer-request"
                    rows={5}
                    placeholder="Share what is on your heart..."
                    value={formData.request}
                    onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                    required
                    className="rounded-xl resize-none text-sm"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-secondary/30 border space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="mt-0.5 rounded border-border"
                    />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Allow church congregation to pray for this:</strong> Check this if you are comfortable having this request included in our church community prayer list. Otherwise, it remains strictly confidential with the pastoral team.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm gap-2"
                >
                  {submitting ? (
                    "Sending Request..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Submit Prayer Request
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
