"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Visitor {
  _id: string;
  name: string;
  contact: string;
  howFound: string;
  wantsFollowUp: boolean;
  notes?: string;
  createdAt: string;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch("/api/visitors");
      const data = await res.json();
      setVisitors(data.visitors || []);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visitor Registrations</h2>

      {loading ? (
        <div className="text-center py-12">Loading visitors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((visitor) => (
            <Card key={visitor._id}>
              <CardHeader>
                <CardTitle className="text-lg">{visitor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Contact: {visitor.contact}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Found us via: {visitor.howFound}
                </p>
                <p className="text-sm mb-2">
                  Follow-up: {visitor.wantsFollowUp ? "Yes" : "No"}
                </p>
                {visitor.notes && (
                  <p className="text-xs text-muted-foreground mb-2">{visitor.notes}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(visitor.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

