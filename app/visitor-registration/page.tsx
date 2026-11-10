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
  UserPlus,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  Smile,
  CheckCircle2,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function VisitorRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    howFound: "",
    wantsFollowUp: true,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", contact: "", howFound: "", wantsFollowUp: true, notes: "" });
      } else {
        setError("Failed to submit registration. Please try again.");
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
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>You Belong Here</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Plan Your Visit &amp; Register
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We consider it an honor to welcome you to Remera Church of the Nazarene. Let us know you are coming so our hospitality team can greet you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
        {/* What to Expect Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-3xl p-6 bg-card border border-border/80 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Smile className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Come As You Are</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Whether in traditional attire or casual clothes, you will find a warm, accepting family ready to welcome you.
            </p>
          </Card>

          <Card className="rounded-3xl p-6 bg-card border border-border/80 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Worship &amp; Preaching</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sunday service begins at 9:00 AM with vibrant praise, heartfelt prayer, and life-changing biblical exposition.
            </p>
          </Card>

          <Card className="rounded-3xl p-6 bg-card border border-border/80 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Children Are Welcome</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We have dedicated, loving children&apos;s teachers providing safe, Christ-centered lessons during the service.
            </p>
          </Card>
        </div>

        {/* Registration Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl border border-border/80 p-6 sm:p-10 shadow-sm bg-card">
            <CardHeader className="p-0 pb-6 space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <UserPlus className="h-4 w-4" />
                <span>Visitor Connection Card</span>
              </div>
              <CardTitle className="text-2xl font-bold">Tell Us About Yourself</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your details help us prepare a warm reception and connect you with pastoral care if you desire.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold text-foreground">Welcome Home!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you for connecting with us. Our hospitality team looks forward to meeting you in person at our Remera Sanctuary!
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Link href="/">
                      <Button className="rounded-xl text-xs">Return to Home</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="rounded-xl text-xs"
                    >
                      Register Another Person
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3.5 rounded-xl text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="visitor-name" className="text-xs font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="visitor-name"
                      placeholder="e.g. Grace Uwase"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="visitor-contact" className="text-xs font-semibold">
                      Contact Info (Phone Number or Email)
                    </Label>
                    <Input
                      id="visitor-contact"
                      placeholder="+250 788 000 000 or grace@example.com"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="how-found" className="text-xs font-semibold">
                      How Did You Hear About Us?
                    </Label>
                    <Select
                      id="how-found"
                      value={formData.howFound}
                      onChange={(e) => setFormData({ ...formData, howFound: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    >
                      <option value="">Select how you found us</option>
                      <option value="Friend or Family Member">Invited by Friend / Family</option>
                      <option value="YouTube Broadcast">Watched on YouTube</option>
                      <option value="Social Media">Instagram / Facebook</option>
                      <option value="Online Search">Google / Web Search</option>
                      <option value="Passersby / Neighborhood">Live nearby in Remera</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={formData.wantsFollowUp}
                        onChange={(e) => setFormData({ ...formData, wantsFollowUp: e.target.checked })}
                        className="rounded border-border"
                      />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Pastoral Follow-Up:</strong> I would like a pastor or hospitality team member to reach out and say hello.
                      </span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="visitor-notes" className="text-xs font-semibold">
                      Questions or Notes for Our Team (Optional)
                    </Label>
                    <Textarea
                      id="visitor-notes"
                      rows={3}
                      placeholder="Any special prayer requests or questions about the service?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="rounded-xl resize-none text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm gap-2"
                  >
                    {submitting ? (
                      "Registering..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Submit Visitor Registration
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
