"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Play, Heart, ArrowRight } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Sermon from "@/models/Sermon";
import Event from "@/models/Event";
import Announcement from "@/models/Announcement";

interface SermonData { /* ... */ }
interface EventData { /* ... */ }
interface AnnouncementData { /* ... */ }

export default function HomePage() {
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = ["/images/choir", "/images/women.png", "/images/choir.jpg"]; 

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => { /* ...fetch sermons/events/announcements as before... */ };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Sliding Images */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* dark overlay */}

        {/* Text */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              REMERA CHURCH OF THE NAZARENE
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              A place of worship, fellowship, and spiritual growth
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">Visit Us</Button>
              </Link>
              <Link href="/sermons">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Play className="mr-2 h-5 w-5" /> Livestream
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Heart className="mr-2 h-5 w-5" /> Give
                </Button>
              </Link>
            </div>

            {/* Times */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Sunday: 8:00 AM - 12:00 AM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Friday: 5:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Tuesday: 5:00 AM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Remaining sections (Announcements, Sermons, Events, About, Contact) */}
      {/* ...keep all your original code as-is... */}
    </div>
  );
}
