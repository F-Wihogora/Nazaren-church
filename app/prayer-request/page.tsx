"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send } from "lucide-react";

export default function PrayerRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    request: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublic: true,
          status: "pending",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", request: "" });
      }
    } catch (error) {
      console.error("Error submitting prayer request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Submit a Prayer Request</h1>
        <p className="text-lg text-muted-foreground">
          We would love to pray for you. Share your prayer request with us.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Prayer Request Form</CardTitle>
          <CardDescription>
            Your name is optional. All requests are kept confidential and shared only with our
            prayer team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <p className="text-lg font-semibold text-primary mb-2">
                Thank you for your prayer request!
              </p>
              <p className="text-muted-foreground">
                We will be praying for you. God bless you!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name (optional)"
                />
              </div>
              <div>
                <Label htmlFor="request">Prayer Request</Label>
                <Textarea
                  id="request"
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  rows={6}
                  placeholder="Share your prayer request here..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Prayer Request
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

