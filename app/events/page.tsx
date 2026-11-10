"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q))
    );
  }, [events, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
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
              <span>Church Life &amp; Fellowship</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Events &amp; Gatherings
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join us for weekly worship celebrations, prayer encounters, youth activities, and community outreach in Kigali.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Search Bar */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-card border text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading church events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
              const day = eventDate.getDate();
              const weekday = eventDate.toLocaleString("default", { weekday: "long" });

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex"
                >
                  <Card className="rounded-3xl border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden bg-card w-full">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start gap-4">
                        {/* Calendar Badge */}
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold shrink-0 border border-primary/20">
                          <span className="text-[10px] tracking-wider uppercase">{month}</span>
                          <span className="text-lg leading-tight">{day}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                            {weekday}
                          </span>
                          <CardTitle className="text-base font-bold line-clamp-2 leading-snug">
                            {event.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-4">
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed pt-1">
                        {event.description}
                      </p>

                      <div className="pt-2">
                        <Link href={`/events/${event._id}`}>
                          <Button className="w-full h-10 rounded-xl text-xs font-semibold gap-1.5">
                            View Event &amp; RSVP <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border rounded-3xl bg-card space-y-3 max-w-md mx-auto">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-base">No events found</h3>
            <p className="text-xs text-muted-foreground">
              We update our calendar regularly. Check back soon for new services and gatherings.
            </p>
            {search && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearch("")}
                className="mt-2 text-xs"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
