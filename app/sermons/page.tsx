"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Play, Calendar, User } from "lucide-react";

interface Sermon {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [preacherFilter, setPreacherFilter] = useState("");
  const [preachers, setPreachers] = useState<string[]>([]);

  useEffect(() => {
    fetchSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [sermons, searchTerm, preacherFilter]);

  const fetchSermons = async () => {
    try {
      const res = await fetch("/api/sermons");
      const data = await res.json();
      setSermons(data.sermons || []);
      setFilteredSermons(data.sermons || []);

      // Extract unique preachers
      const uniquePreachers = Array.from(
        new Set((data.sermons || []).map((s: Sermon) => s.preacher))
      ) as string[];
      setPreachers(uniquePreachers);
    } catch (error) {
      console.error("Error fetching sermons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSermons = () => {
    let filtered = [...sermons];

    if (searchTerm) {
      filtered = filtered.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (preacherFilter) {
      filtered = filtered.filter((sermon) => sermon.preacher === preacherFilter);
    }

    setFilteredSermons(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Sermons</h1>
        <p className="text-muted-foreground">
          Watch and listen to our weekly sermons and messages
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search sermons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={preacherFilter} onChange={(e) => setPreacherFilter(e.target.value)}>
          <option value="">All Preachers</option>
          {preachers.map((preacher) => (
            <option key={preacher} value={preacher}>
              {preacher}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading sermons...</div>
      ) : filteredSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon, index) => (
            <motion.div
              key={sermon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{sermon.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/sermons/${sermon._id}`}>
                    <Button className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      {sermon.videoUrl ? "Watch" : sermon.audioUrl ? "Listen" : "View Details"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No sermons found.</div>
      )}
    </div>
  );
}

