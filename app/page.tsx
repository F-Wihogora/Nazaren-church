"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Play,
  Heart,
  ArrowRight,
  Users,
  Sparkles,
  BookOpen,
  Compass,
  Radio,
  ExternalLink,
  ChevronRight,
  Mail,
  Church,
} from "lucide-react";
import { publicAssetPath } from "@/lib/media-path";
import ChurchImage from "@/components/ChurchImage";

interface SermonData {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

interface AnnouncementData {
  _id: string;
  type: string;
  title: string;
  content: string;
  bibleVerse?: string;
}

interface MinistryData {
  _id: string;
  name: string;
  leader: string;
  description: string;
  meetingSchedule?: string;
  division?: string;
  image?: string;
}

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|v\/|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

const heroSlides = [
  "/images/imgl1213.webp",
  "/images/imgl1002.webp",
  "/images/choir.webp",
];

export default function HomePage() {
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [ministries, setMinistries] = useState<MinistryData[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sermonsRes, eventsRes, announcementsRes, ministriesRes] = await Promise.all([
          fetch("/api/sermons?limit=6"),
          fetch("/api/events?limit=3"),
          fetch("/api/announcements?active=true"),
          fetch("/api/ministries"),
        ]);
        setSermons((await sermonsRes.json()).sermons || []);
        setEvents((await eventsRes.json()).events || []);
        setAnnouncements((await announcementsRes.json()).announcements || []);
        setMinistries((await ministriesRes.json()).ministries || []);
      } catch (error) {
        console.error("Error fetching homepage dynamic data:", error);
      }
    };
    fetchData();
  }, []);

  // Pastors list with real portraits
  const pastoralTeam = [
    { name: "Pastor Jacques Niyonsaba", role: "Senior Pastor", image: "/images/jacques.png" },
    { name: "Pastor Mbonigaba Diedonne", role: "Associate Pastor", image: "/images/mbonigaba.png" },
    { name: "Pastor Agnes Nyirabigabiro", role: "Associate Pastor", image: "/images/agnes.png" },
    { name: "Pastor Marcelline Muhimakazi", role: "Associate Pastor", image: "/images/marcelline.png" },
  ];

  return (
    <div className="flex flex-col">
      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-[1500ms]"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 22, 48, .60), rgba(10, 22, 48, .70)), url(${publicAssetPath(heroSlides[bgIndex])})`,
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remera Church of the Nazarene</span>
            </div>

            {/* Main title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md leading-[1.12]">
              A Place of Worship, Fellowship &amp; Grace
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
              Welcome to our church family in Kigali, Rwanda. Join us as we grow together in Christ, serve our community, and walk in holiness.
            </p>

            {/* Natural, well-proportioned buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/contact">
                <Button className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl font-semibold text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-black/25">
                  <MapPin className="mr-2 h-4 w-4" /> Plan a Visit
                </Button>
              </Link>
              <a href="#livestream">
                <Button variant="outline" className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl font-semibold text-sm sm:text-base border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
                  <Play className="mr-2 h-4 w-4 text-blue-200 fill-current" /> Watch Services
                </Button>
              </a>
              <Link href="/account">
                <Button className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl font-semibold text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  <Users className="mr-2 h-4 w-4" /> Member Portal
                </Button>
              </Link>
              <Link href="/contact#giving">
                <Button variant="ghost" className="h-11 sm:h-12 px-5 rounded-xl font-medium text-sm sm:text-base text-white/90 hover:text-white hover:bg-white/10">
                  <Heart className="mr-2 h-4 w-4 text-rose-400" /> Support &amp; Giving
                </Button>
              </Link>
            </div>

            {/* Service Times Frosted Glass Pill Bar */}
            <div className="pt-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-black/45 backdrop-blur-md border border-white/15 px-6 py-3 rounded-2xl text-xs sm:text-sm text-white/90 shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="font-semibold text-white">Sunday Service:</span>
                  <span>9:00 AM – 12:30 PM</span>
                </div>
                <span className="hidden sm:inline text-white/30">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="font-semibold text-white">Morning Prayer (Nibature):</span>
                  <span>Mon–Fri, 5:00 AM – 7:00 AM</span>
                </div>
                <span className="hidden sm:inline text-white/30">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="font-semibold text-white">Tuesday Prayer:</span>
                  <span>10:30 AM – 4:00 PM</span>
                </div>
                <span className="hidden sm:inline text-white/30">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="font-semibold text-white">Friday Service:</span>
                  <span>5:00 PM – 8:30 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. FIRST TIME VISITOR WELCOME STRIP */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card border border-border/80 p-6 sm:p-8 rounded-3xl shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">First Time at Remera Nazarene?</span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">We&apos;d love to welcome you in person.</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Our church family welcomes everyone with open arms. Let our hospitality team know you are coming so we can greet you and your family.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/visitor-registration">
                <Button className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold">
                  Register as a Visitor <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="h-10 px-5 rounded-xl text-xs sm:text-sm">
                  What to Expect
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. ACTIVE ANNOUNCEMENTS */}
      {/* ==================================================== */}
      {announcements.length > 0 && (
        <section className="bg-primary/5 py-6 border-b">
          <div className="container mx-auto px-4 max-w-6xl space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {ann.type}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">{ann.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{ann.content}</p>
                  {ann.bibleVerse && (
                    <p className="text-xs italic text-primary font-medium">{ann.bibleVerse}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* 4. SERMONS & LIVE BROADCASTS (DYNAMIC FROM MONGODB) */}
      {/* ==================================================== */}
      <section id="livestream" className="py-20 bg-background scroll-mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Preaching &amp; Worship
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Latest Sermons &amp; Live Broadcasts</h2>
              <p className="text-sm text-muted-foreground">
                Join our worship services live or rewatch recent teachings from our pastoral team.
              </p>
            </div>
            <Link href="/sermons">
              <Button variant="ghost" className="text-xs font-semibold text-primary hover:underline">
                View All Sermons <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Dynamic Sermons Grid */}
          {sermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {sermons.slice(0, 2).map((sermon) => {
                const ytId = getYouTubeId(sermon.videoUrl);
                const thumbnail = ytId
                  ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                  : "/images/church_congregation.webp";

                return (
                  <div
                    key={sermon._id}
                    className="group rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* 16:9 Video Thumbnail with Play Overlay */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={sermon.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/church_congregation.jpg";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                      {/* Tag badge */}
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Radio className="w-3 h-3 animate-pulse" /> Video Stream
                      </span>

                      {/* Play Button Icon */}
                      <Link
                        href={`/sermons/${sermon._id}`}
                        className="absolute inset-0 flex items-center justify-center group/btn"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-0.5 fill-white" />
                        </div>
                      </Link>

                      {/* Date overlay */}
                      <span className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
                        {new Date(sermon.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                        {sermon.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{sermon.preacher}</span>
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                        <Link href={`/sermons/${sermon._id}`} className="flex-1">
                          <Button className="w-full h-10 rounded-xl text-xs font-semibold gap-2">
                            <Play className="w-3.5 h-3.5 fill-current" /> Watch Sermon
                          </Button>
                        </Link>
                        {sermon.videoUrl && (
                          <a
                            href={sermon.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" className="h-10 px-3 rounded-xl text-xs">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-card rounded-2xl border text-muted-foreground text-sm">
              Sermons and live streams will appear here once scheduled.
            </div>
          )}

          {/* Secondary Sermons Row (if more than 2) */}
          {sermons.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {sermons.slice(2, 6).map((s) => (
                <div key={s._id} className="rounded-2xl border border-border/70 bg-card p-4 hover:shadow-md transition-all space-y-2">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                  <h4 className="font-semibold text-sm line-clamp-1">{s.title}</h4>
                  <p className="text-xs text-muted-foreground">{s.preacher}</p>
                  <Link href={`/sermons/${s._id}`}>
                    <Button size="sm" variant="ghost" className="w-full text-xs h-8 text-primary mt-1">
                      Watch Message &rarr;
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. MEET OUR PASTORS */}
      {/* ==================================================== */}
      <section className="py-20 bg-secondary/30 border-y">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 space-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Spiritual Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Meet Our Pastors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Dedicated servant leaders committed to preaching the Word, nurturing souls, and shepherding our congregation in Kigali.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastoralTeam.map((pastor, idx) => (
              <motion.div
                key={pastor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/80 group rounded-3xl bg-card">
                  <div className="relative w-full aspect-square overflow-hidden bg-muted">
                    <img
                      src={publicAssetPath(pastor.image)}
                      alt={pastor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md shadow-sm">
                      {pastor.role}
                    </span>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-bold line-clamp-1">{pastor.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">Remera Church of the Nazarene</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. UPCOMING EVENTS (DYNAMIC FROM MONGODB) */}
      {/* ==================================================== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Calendar &amp; Community
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Upcoming Events</h2>
              <p className="text-sm text-muted-foreground">
                Join us for worship gatherings, youth fellowships, and special services.
              </p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-xs font-semibold text-primary hover:underline">
                View All Events <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
                const day = eventDate.getDate();

                return (
                  <Card
                    key={event._id}
                    className="rounded-3xl border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden bg-card"
                  >
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start gap-4">
                        {/* Clean Date Badge */}
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold shrink-0 border border-primary/20">
                          <span className="text-[10px] tracking-wider uppercase">{month}</span>
                          <span className="text-lg leading-tight">{day}</span>
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base font-bold line-clamp-2 leading-snug">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{event.time || "Service Time"}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                      <Link href={`/events/${event._id}`} className="block pt-2">
                        <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-semibold">
                          View Details &amp; RSVP <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-card rounded-2xl border text-muted-foreground text-sm">
              Check back soon for upcoming church events.
            </div>
          )}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. MINISTRIES OVERVIEW (DYNAMIC FROM MONGODB) */}
      {/* ==================================================== */}
      <section className="py-20 bg-secondary/20 border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Serve &amp; Grow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Church Ministries</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Find your community and get involved across our discipleship, youth, missions, and music departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((m) => (
              <Card
                key={m._id}
                className="rounded-3xl border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all p-6 space-y-3 bg-card flex flex-col justify-between"
              >
                {m.image && (
                  <ChurchImage
                    src={m.image}
                    alt={`${m.name} ministry`}
                    className="w-full h-44 object-cover rounded-2xl mb-4"
                  />
                )}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    <Church className="w-3 h-3" />
                    <span>{m.division || "Ministry"}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-3 border-t space-y-1.5 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Leader: <span className="font-normal text-muted-foreground">{m.leader}</span>
                  </p>
                  {m.meetingSchedule && (
                    <p className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-primary shrink-0" />
                      <span>{m.meetingSchedule}</span>
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-10">
            <Link href="/about#ministries">
              <Button variant="outline" className="h-11 px-6 rounded-xl text-xs font-semibold">
                Explore All Ministries &amp; Get Connected <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. VISIT US & CONTACT MAP */}
      {/* ==================================================== */}
      <section className="py-20 bg-background border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Location &amp; Fellowship
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Visit Us in Remera, Kigali</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are conveniently located in Remera along the Airport corridor. Our doors are open to everyone seeking to worship Jesus Christ.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      Boulevard de l&apos;Aeroport Road, Amahoro Village<br />
                      Rukiri II Cell, Remera Sector, Gasabo, Kigali
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-foreground">Contact the Church Office</p>
                    <p className="text-muted-foreground">Use the contact form for messages.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/contact">
                  <Button className="h-11 px-6 rounded-xl text-xs font-semibold">
                    Contact Church Office
                  </Button>
                </Link>
                <Link href="/prayer-request">
                  <Button variant="outline" className="h-11 px-6 rounded-xl text-xs font-semibold">
                    Request Prayer
                  </Button>
                </Link>
              </div>
            </div>

            {/* Google Maps Container */}
            <div className="h-[380px] rounded-3xl overflow-hidden border border-border shadow-lg bg-muted">
              <iframe
                title="Remera Church of the Nazarene Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.753991235677!2d30.11305807484965!3d-1.9579111980258572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7a82ee3bafd%3A0x8f47779fba399a27!2sRemera%20Church%20of%20the%20Nazarene!5e0!3m2!1sen!2srw!4v1701459680000!5m2!1sen!2srw"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
