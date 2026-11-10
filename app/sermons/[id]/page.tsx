"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  ArrowLeft,
  Download,
  Share2,
  ExternalLink,
  Radio,
  BookOpen,
  Volume2,
  Check,
} from "lucide-react";
import Link from "next/link";

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

export default function SermonDetailPage() {
  const params = useParams();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [otherSermons, setOtherSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchSermon = useCallback(async () => {
    if (!params.id) return;
    try {
      const res = await fetch(`/api/sermons/${params.id}`);
      const data = await res.json();
      setSermon(data.sermon);

      // Fetch other sermons for recommendations
      const allRes = await fetch("/api/sermons");
      const allData = await allRes.json();
      if (allData.sermons) {
        setOtherSermons(
          allData.sermons.filter((s: Sermon) => s._id !== params.id).slice(0, 3)
        );
      }
    } catch (error) {
      console.error("Error fetching sermon:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchSermon();
  }, [fetchSermon]);

  const handleDownloadNotes = () => {
    if (!sermon || !sermon.notes) return;
    const content = `TITLE: ${sermon.title}\nPREACHER: ${sermon.preacher}\nDATE: ${new Date(sermon.date).toLocaleDateString()}\n\nSERMON NOTES:\n----------------------------------------\n${sermon.notes}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sermon.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
        <p className="text-sm text-muted-foreground">Loading sermon and media...</p>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sermon Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The sermon or service broadcast you are looking for may have been moved or removed.
        </p>
        <Link href="/sermons">
          <Button className="rounded-xl">Back to All Sermons</Button>
        </Link>
      </div>
    );
  }

  const ytId = getYouTubeId(sermon.videoUrl);

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/sermons">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              All Sermons
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-xl text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Link Copied!" : "Share"}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Main Media Player */}
          {ytId ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ) : sermon.videoUrl ? (
            <div className="aspect-video bg-muted rounded-3xl flex flex-col items-center justify-center p-6 text-center border">
              <Radio className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-base mb-2">Watch Live Stream</h3>
              <p className="text-xs text-muted-foreground mb-4">Click below to watch this service on YouTube</p>
              <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-xl gap-2">
                  Open Stream <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ) : null}

          {/* Audio Player if Available */}
          {sermon.audioUrl && (
            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Volume2 className="h-4 w-4" /> Listen to Audio
              </div>
              <audio controls className="w-full">
                <source src={sermon.audioUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Header & Metadata Card */}
          <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {sermon.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span>{sermon.preacher}</span>
                </div>
                <span className="hidden sm:inline text-muted-foreground/40">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {new Date(sermon.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
              {sermon.videoUrl && (
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="outline" className="h-10 rounded-xl text-xs font-semibold gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> Watch on YouTube
                  </Button>
                </a>
              )}

              {sermon.notes && (
                <Button
                  variant="outline"
                  onClick={handleDownloadNotes}
                  className="h-10 rounded-xl text-xs font-semibold gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download Notes (.txt)
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={handleShare}
                className="h-10 rounded-xl text-xs font-semibold gap-1.5 ml-auto"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Link Copied" : "Share"}
              </Button>
            </div>

            {/* Sermon Notes / Transcript Content */}
            {sermon.notes && (
              <div className="pt-6 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Sermon Notes &amp; Highlights
                  </h3>
                </div>
                <div className="rounded-2xl bg-muted/30 border p-5 sm:p-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {sermon.notes}
                </div>
              </div>
            )}
          </div>

          {/* More Sermons Recommendations */}
          {otherSermons.length > 0 && (
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">More Messages &amp; Broadcasts</h2>
                <Link href="/sermons" className="text-xs font-semibold text-primary hover:underline">
                  View all &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {otherSermons.map((other) => {
                  const oYt = getYouTubeId(other.videoUrl);
                  const thumb = oYt
                    ? `https://img.youtube.com/vi/${oYt}/hqdefault.jpg`
                    : "/images/church_congregation.webp";

                  return (
                    <Link key={other._id} href={`/sermons/${other._id}`} className="group">
                      <Card className="overflow-hidden rounded-2xl border hover:border-primary/50 transition-all">
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={thumb}
                            alt={other.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <CardContent className="p-4 space-y-1.5">
                          <p className="text-xs text-primary font-medium truncate">{other.preacher}</p>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {other.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(other.date).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
