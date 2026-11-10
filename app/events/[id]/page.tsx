"use client";

import { FormEvent, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Users,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", phone: "", guests: "1" });
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpDone, setRsvpDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!params.id) return;
    try {
      const res = await fetch(`/api/events/${params.id}`);
      const data = await res.json();
      setEvent(data.event);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  async function submitRsvp(e: FormEvent) {
    e.preventDefault();
    if (!params.id) return;
    setRsvpBusy(true);
    setRsvpError("");
    try {
      const res = await fetch(`/api/events/${params.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rsvpForm, guests: parseInt(rsvpForm.guests, 10) || 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to register.");
      setRsvpDone(true);
    } catch (err) {
      setRsvpError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setRsvpBusy(false);
    }
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This event may have already concluded or has been removed from the schedule.
        </p>
        <Link href="/events">
          <Button className="rounded-xl">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between">
          <Link href="/events">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              All Events
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-xl text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Link Copied!" : "Share Event"}
          </Button>
        </div>

        {/* Main Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <Card className="rounded-3xl border border-border/80 p-6 sm:p-10 shadow-sm bg-card space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Remera Nazarene Gathering</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    {eventDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t space-y-4">
              <h3 className="font-bold text-base text-foreground">About This Gathering</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </Card>

          {/* RSVP Card */}
          <Card className="rounded-3xl border border-border/80 p-6 sm:p-10 shadow-sm bg-card">
            <CardHeader className="p-0 pb-6 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">Register &amp; RSVP</CardTitle>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Let our hospitality and ushering team know you plan to attend so we can prepare a warm welcome.
              </p>
            </CardHeader>

            <CardContent className="p-0">
              {rsvpDone ? (
                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-center">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                  <h4 className="font-bold text-base text-foreground">You&apos;re Confirmed!</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Thank you for letting us know! We look forward to worshipping and fellowshiping with you.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitRsvp} className="space-y-4 max-w-lg">
                  {rsvpError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-xs">
                      {rsvpError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rsvp-name" className="text-xs font-semibold">
                        Full Name
                      </Label>
                      <Input
                        id="rsvp-name"
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                        required
                        minLength={2}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rsvp-email" className="text-xs font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="rsvp-email"
                        type="email"
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                        required
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rsvp-phone" className="text-xs font-semibold">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="rsvp-phone"
                        type="tel"
                        value={rsvpForm.phone}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rsvp-guests" className="text-xs font-semibold">
                        Number Attending (Guests)
                      </Label>
                      <Input
                        id="rsvp-guests"
                        type="number"
                        min={1}
                        max={20}
                        value={rsvpForm.guests}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                        required
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={rsvpBusy}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl text-xs font-semibold"
                  >
                    {rsvpBusy ? "Confirming..." : "Confirm My RSVP"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
