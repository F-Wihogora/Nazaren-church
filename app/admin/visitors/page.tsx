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
    fetch("/api/visitors")
      .then((r) => r.json())
      .then((d) => setVisitors(d.visitors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visitor Registrations</h2>
      {loading ? (
        <div className="text-center py-12">Loading visitors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((v) => (
            <Card key={v._id}>
              <CardHeader><CardTitle className="text-lg">{v.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Contact: {v.contact}</p>
                <p className="text-sm text-muted-foreground mb-2">Found us via: {v.howFound}</p>
                <p className="text-sm mb-2">Follow-up: {v.wantsFollowUp ? "Yes" : "No"}</p>
                {v.notes && <p className="text-xs text-muted-foreground mb-2">{v.notes}</p>}
                <p className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
