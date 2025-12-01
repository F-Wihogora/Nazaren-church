"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { UserPlus, Send } from "lucide-react";

export default function VisitorRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    howFound: "",
    wantsFollowUp: false,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          contact: "",
          howFound: "",
          wantsFollowUp: false,
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error submitting visitor registration:", error);
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
        <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Visitor Registration</h1>
        <p className="text-lg text-muted-foreground">
          Welcome! We&apos;re so glad you&apos;re here. Please fill out this form to help us get to
          know you better.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
          <CardDescription>
            Your information helps us serve you better and stay connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <p className="text-lg font-semibold text-primary mb-2">
                Thank you for visiting!
              </p>
              <p className="text-muted-foreground">
                We&apos;re excited to have you here. We hope to see you again soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact (Email or Phone)</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="howFound">How did you find us?</Label>
                <Select
                  id="howFound"
                  value={formData.howFound}
                  onChange={(e) => setFormData({ ...formData, howFound: e.target.value })}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Friend/Family">Friend/Family</option>
                  <option value="Online Search">Online Search</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Drive By">Drive By</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.wantsFollowUp}
                    onChange={(e) =>
                      setFormData({ ...formData, wantsFollowUp: e.target.checked })
                    }
                    className="mr-2"
                  />
                  I would like someone to follow up with me
                </Label>
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any additional information you'd like to share..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Registration
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

