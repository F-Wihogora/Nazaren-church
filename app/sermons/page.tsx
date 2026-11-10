"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Play, Calendar, User, Search, Radio, ExternalLink, Sparkles, BookOpen, Clock } from "lucide-react";

interface Sermon {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
}

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|v\/|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [preacherFilter, setPreacherFilter] = useState("");

  const fetchSermons = useCallback(async () => {
    try {
      const res = await fetch("/api/sermons");
      const data = await res.json();
      setSermons(data.sermons || []);
    } catch (error) {
      console.error("Error fetching sermons:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const preachers = useMemo(() => {
    const list = sermons.map((s) => s.preacher).filter(Boolean);
    return Array.from(new Set(list));
  }, [sermons]);

  const filteredSermons = useMemo(() => {
    return sermons.filter((sermon) => {
      const matchesSearch =
        !searchTerm ||
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.notes && sermon.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPreacher = !preacherFilter || sermon.preacher === preacherFilter;

      return matchesSearch && matchesPreacher;
    });
  }, [sermons, searchTerm, preacherFilter]);

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
              <span>Remera Nazarene Media Ministry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Sermons &amp; Messages
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Grow in God&apos;s Word with weekly sermons, revival messages, and live broadcasts from our pastoral team in Kigali.
            </p>

            {/* Quick Live Schedule Info */}
            <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border shadow-sm">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" /> Sunday Service: 9:00 AM – 12:30 PM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border shadow-sm">
                <Clock className="w-3 h-3 text-primary" /> Morning Prayer (Nibature), Mon–Fri: 5:00–7:00 AM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border shadow-sm">
                <Clock className="w-3 h-3 text-primary" /> Tuesday Prayer: 10:30 AM – 4:00 PM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border shadow-sm">
                <Clock className="w-3 h-3 text-primary" /> Friday Service: 5:00–8:30 PM
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Search & Filter Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-card border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by sermon title, preacher, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-background text-sm"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              value={preacherFilter}
              onChange={(e) => setPreacherFilter(e.target.value)}
              className="h-11 rounded-xl bg-background text-sm"
            >
              <option value="">All Preachers ({sermons.length})</option>
              {preachers.map((preacher) => (
                <option key={preacher} value={preacher}>
                  {preacher}
                </option>
              ))}
            </Select>
          </div>

          {(searchTerm || preacherFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setPreacherFilter("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Sermon List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading sermons and broadcasts...</p>
          </div>
        ) : filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon, index) => {
              const ytId = getYouTubeId(sermon.videoUrl);
              const thumbnail = ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : "/images/church_congregation.webp";

              return (
                <motion.div
                  key={sermon._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex"
                >
                  <Card className="group overflow-hidden rounded-2xl border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between w-full bg-card">
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={sermon.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/church_congregation.webp";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                      {/* Video / Live Badge */}
                      {ytId && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Radio className="w-3 h-3 animate-pulse" /> Video Stream
                        </span>
                      )}

                      {/* Play overlay button */}
                      <Link
                        href={`/sermons/${sermon._id}`}
                        className="absolute inset-0 flex items-center justify-center group/btn"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground group-hover/btn:bg-primary group-hover/btn:scale-110 flex items-center justify-center shadow-lg transition-all">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </Link>

                      {/* Date Badge */}
                      <span className="absolute bottom-3 left-3 text-xs text-white/95 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(sermon.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Link href={`/sermons/${sermon._id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-semibold text-base leading-snug line-clamp-2">
                            {sermon.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-medium truncate">{sermon.preacher}</span>
                        </div>
                        {sermon.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                            {sermon.notes}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <Link href={`/sermons/${sermon._id}`} className="flex-1">
                          <Button className="w-full h-10 rounded-xl text-xs font-semibold gap-1.5">
                            <Play className="w-3.5 h-3.5 fill-current" /> Watch Sermon
                          </Button>
                        </Link>

                        {sermon.videoUrl && (
                          <a
                            href={sermon.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in YouTube"
                          >
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-base">No sermons found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search terms or preacher filter to find the message you&apos;re looking for.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setPreacherFilter("");
              }}
              className="mt-2"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
