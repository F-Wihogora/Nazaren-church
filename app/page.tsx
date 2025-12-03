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
import { Calendar, MapPin, Clock, Play, Heart, ArrowRight } from "lucide-react";

import connectDB from "@/lib/mongodb";
import Sermon from "@/models/Sermon";
import Event from "@/models/Event";
import Announcement from "@/models/Announcement";

// ------------------ Interfaces ------------------
interface SermonData {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
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

export default function HomePage() {
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // 🔥 Sliding Background Images Here
  // -----------------------------------
  const bgImages = [
   "/images/pipoo.png", "/images/women.png", "/images/choir.jpg","/images/image1.png","/images/image2.png","/images/image3.png","/images/image4.png"];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sermonsRes, eventsRes, announcementsRes] = await Promise.all([
        fetch("/api/sermons?limit=3"),
        fetch("/api/events?limit=3"),
        fetch("/api/announcements?active=true"),
      ]);

      setSermons((await sermonsRes.json()).sermons || []);
      setEvents((await eventsRes.json()).events || []);
      setAnnouncements((await announcementsRes.json()).announcements || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">

      {/* ========================================================= */}
      {/* 🔥 HERO SECTION WITH SLIDING BACKGROUND IMAGES */}
      {/* ========================================================= */}

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-[1500ms]"
          style={{
            backgroundImage: `url(${bgImages[bgIndex]})`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* HERO TEXT CONTENT */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              REMERA CHURCH OF THE NAZARENE
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              A place of worship, fellowship, and spiritual growth
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  Visit Us
                </Button>
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

            {/* Service Times */}
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

      {/* ========================================================= */}
      {/* THE REST OF YOUR PAGE (Announcements, Events, Sermons, etc.) */}
      {/* NOTHING WAS REMOVED OR CHANGED BELOW */}
      {/* ========================================================= */}

      {/* --- Announcements Section --- */}
      {announcements.length > 0 && (
        <section className="bg-primary/10 py-8">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                  <p className="text-muted-foreground mb-2">{announcement.content}</p>
                  {announcement.bibleVerse && (
                    <p className="text-sm italic text-primary font-medium">
                      "{announcement.bibleVerse}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- Sermons Section --- */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Sermons</h2>
            <Link href="/sermons">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading sermons...</div>
          ) : sermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sermons.map((sermon, index) => (
                <motion.div
                  key={sermon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{sermon.title}</CardTitle>
                      <CardDescription>
                        {sermon.preacher} •{" "}
                        {new Date(sermon.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/sermons/${sermon._id}`}>
                        <Button className="w-full">
                          <Play className="mr-2 h-4 w-4" /> Watch/Listen
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No sermons available yet.
            </div>
          )}
        </div>
      </section>

      {/* --- Events Section --- */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>

                        {event.time && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <Link href={`/events/${event._id}`}>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming events.
            </div>
          )}
        </div>
      </section>

      {/* --- About Section --- */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">About Us</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nazarene Church is a vibrant community of believers dedicated to
                serving God and spreading His love. We welcome everyone to join
                us in worship, fellowship, and spiritual growth.
              </p>
              <Link href="/about">
                <Button size="lg">Learn More About Us</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-lg text-muted-foreground">
                We&apos;d love to hear from you. Visit us or reach out!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>
                      Remera Church of the Nazarene <br />
                      Boulevard de l'Aeroport Road <br />
                      Amahoro Village, Rukiri II Cell - Remera Sector <br />
                      KN5 Rd, KG109 St, Kigali, Rwanda
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p>Sunday: 8:00 AM - 12:00 AM</p>
                      <p>Tuesday: 10:00 AM - 4:30 PM</p>
                      <p>Friday: 5:00 PM - 7:00 PM</p>
                      <p>Monday-Friday: 5:00 AM - 7:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.753991235677!2d30.11305807484965!3d-1.9579111980258572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7a82ee3bafd%3A0x8f47779fba399a27!2sRemera%20Church%20of%20the%20Nazarene!5e0!3m2!1sen!2srw!4v1701459680000!5m2!1sen!2srw"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Link href="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
