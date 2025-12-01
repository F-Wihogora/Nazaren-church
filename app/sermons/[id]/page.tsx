"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";
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

export default function SermonDetailPage() {
  const params = useParams();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSermon();
    }
  }, [params.id]);

  const fetchSermon = async () => {
    try {
      const res = await fetch(`/api/sermons/${params.id}`);
      const data = await res.json();
      setSermon(data.sermon);
    } catch (error) {
      console.error("Error fetching sermon:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">Loading sermon...</div>
    );
  }

  if (!sermon) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Sermon not found.</p>
        <Link href="/sermons">
          <Button className="mt-4">Back to Sermons</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/sermons">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sermons
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl mb-4">{sermon.title}</CardTitle>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{sermon.preacher}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(sermon.date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {sermon.videoUrl && (
              <div>
                <h3 className="font-semibold mb-2">Video</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button>Watch on YouTube</Button>
                  </a>
                </div>
              </div>
            )}

            {sermon.audioUrl && (
              <div>
                <h3 className="font-semibold mb-2">Audio</h3>
                <audio controls className="w-full">
                  <source src={sermon.audioUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {sermon.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{sermon.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

