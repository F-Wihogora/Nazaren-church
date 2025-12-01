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

      const sermonsData = await sermonsRes.json();
      const eventsData = await eventsRes.json();
      const announcementsData = await announcementsRes.json();

      setSermons(sermonsData.sermons || []);
      setEvents(eventsData.events || []);
      setAnnouncements(announcementsData.announcements || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nazarene Church
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A place of worship, fellowship, and spiritual growth
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  Visit Us
                </Button>
              </Link>
              <Link href="#">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Livestream
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Heart className="mr-2 h-5 w-5" />
                  Give
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Sunday: 9:00 AM & 11:00 AM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Wednesday: 7:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcements Banner */}
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
                      &quot;{announcement.bibleVerse}&quot;
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Sermon */}
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
                        {sermon.preacher} • {new Date(sermon.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/sermons/${sermon._id}`}>
                        <Button className="w-full">
                          <Play className="mr-2 h-4 w-4" />
                          Watch/Listen
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

      {/* Upcoming Events */}
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
                          <span>{new Date(event.date).toLocaleDateString()}</span>
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
            <div className="text-center py-12 text-muted-foreground">No upcoming events.</div>
          )}
        </div>
      </section>

      {/* About Section */}
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
                Nazarene Church is a vibrant community of believers dedicated to serving God and
                spreading His love. We welcome everyone to join us in worship, fellowship, and
                spiritual growth.
              </p>
              <Link href="/about">
                <Button size="lg">Learn More About Us</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
                    <span>123 Church Street, City, State 12345</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p>Sunday: 9:00 AM & 11:00 AM</p>
                      <p>Wednesday: 7:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Map embed would go here</p>
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

