"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface PrayerRequest {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  request: string;
  isPublic: boolean;
  status: "pending" | "in_progress" | "completed" | "answered" | "archived";
  createdAt: string;
}

export default function AdminPrayerRequestsPage() {
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [accessMessage, setAccessMessage] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const url = statusFilter ? `/api/prayer-requests?status=${statusFilter}` : "/api/prayer-requests";
      const res = await fetch(url);
      if (res.status === 403) {
        setItems([]);
        setAccessMessage("Prayer request access is limited to the designated pastoral team. Ask the site administrator to configure your staff account.");
        return;
      }
      if (!res.ok) throw new Error("Unable to load prayer requests.");
      const d = await res.json();
      setAccessMessage("");
      setItems(d.prayerRequests || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleStatusUpdate = async (id: string, status: string) => {
    const res = await fetch(`/api/prayer-requests/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    const res = await fetch(`/api/prayer-requests/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Prayer Requests</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pastoral team: Pastor Jacques, Pastor Agnes, Pastor Dieudonne, and Pastor Marcelin. Check regularly and aim to respond within 24–48 hours where possible. SMS alerts are not configured yet.</p>
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </Select>
      </div>
      {accessMessage && <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">{accessMessage}</div>}

      {loading ? <div className="text-center py-12">Loading prayer requests...</div> : (
        <div className="space-y-4">
          {items.map((r) => (
            <Card key={r._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{r.name || "Anonymous"}</CardTitle>
                    {(r.email || r.phone) && (
                      <p className="text-sm text-muted-foreground">{[r.email, r.phone].filter(Boolean).join(" · ")}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={r.status} onChange={(e) => handleStatusUpdate(r._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </Select>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent><p className="text-muted-foreground">{r.request}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
