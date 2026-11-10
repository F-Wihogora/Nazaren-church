"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Clock,
  Send,
  Sparkles,
  Heart,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to send message. Please try again.");
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
              <span>We&apos;re Here For You</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Contact &amp; Location
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a question, need pastoral support, or planning your first visit to Remera Church of the Nazarene? Reach out to our ministry team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Contact Cards & Map */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm bg-card space-y-6">
              <CardTitle className="text-xl font-bold">Church Office &amp; Sanctuary</CardTitle>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-foreground">Sanctuary Address</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Remera Church of the Nazarene<br />
                      Boulevard de l&apos;Aeroport Road, Amahoro Village<br />
                      Rukiri II Cell, Remera Sector<br />
                      KN5 Rd, KG109 St, Kigali, Rwanda
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-foreground">Weekly Service Times</p>
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Sunday Service:</span> 9:00 AM – 12:30 PM<br />
                      <span className="font-medium text-foreground">Morning Prayer (Nibature):</span> Monday–Friday, 5:00 AM – 7:00 AM<br />
                      <span className="font-medium text-foreground">Tuesday Prayer:</span> 10:30 AM – 4:00 PM<br />
                      <span className="font-medium text-foreground">Friday Service:</span> 5:00 PM – 8:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Embedded Google Map */}
            <Card className="rounded-3xl border border-border/80 overflow-hidden shadow-sm bg-card p-0">
              <div className="w-full h-72">
                <iframe
                  title="Remera Church of the Nazarene Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.753991235677!2d30.11305807484965!3d-1.9579111980258572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7a82ee3bafd%3A0x8f47779fba399a27!2sRemera%20Church%20of%20the%20Nazarene!5e0!3m2!1sen!2srw!4v1701459680000!5m2!1sen!2srw"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Send Us a Message Form */}
          <Card className="rounded-3xl border border-border/80 p-6 sm:p-10 shadow-sm bg-card">
            <CardHeader className="p-0 pb-6 space-y-1">
              <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Our church office responds promptly to all messages, pastoral questions, and visit inquiries.
              </p>
            </CardHeader>

            <CardContent className="p-0">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A member of our pastoral care team will get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-xl text-xs"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3.5 rounded-xl text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs font-semibold">
                      Your Full Name
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="e.g. Jean Claude"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-xs font-semibold">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+250 788 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className="text-xs font-semibold">
                      Your Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      placeholder="How can our church family pray for you or assist you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="rounded-xl resize-none text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support & Giving Section */}
        <div id="giving" className="scroll-mt-12">
          <Card className="rounded-3xl border border-border/80 p-8 sm:p-10 shadow-sm bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Tithes &amp; Offerings</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Support God&apos;s Work in Kigali</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your faithful generosity empowers our weekly ministry, youth mentorship, food relief for vulnerable families, and community outreach.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border shadow-sm text-xs space-y-1.5 shrink-0">
                <p className="font-bold text-foreground">Giving Channels:</p>
                <p className="text-muted-foreground">• Giving instructions are available from the church office.</p>
                <p className="text-muted-foreground">• This website does not process online payments.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
