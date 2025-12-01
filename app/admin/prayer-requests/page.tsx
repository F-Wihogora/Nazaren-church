"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface PrayerRequest {
  _id: string;
  name?: string;
  request: string;
  isPublic: boolean;
  status: "pending" | "answered" | "archived";
  createdAt: string;
}

export default function AdminPrayerRequestsPage() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPrayerRequests();
  }, [statusFilter]);

  const fetchPrayerRequests = async () => {
    try {
      const url = statusFilter
        ? `/api/prayer-requests?status=${statusFilter}`
        : "/api/prayer-requests";
      const res = await fetch(url);
      const data = await res.json();
      setPrayerRequests(data.prayerRequests || []);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/prayer-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchPrayerRequests();
      }
    } catch (error) {
      console.error("Error updating prayer request:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer request?")) return;

    try {
      const res = await fetch(`/api/prayer-requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPrayerRequests();
      }
    } catch (error) {
      console.error("Error deleting prayer request:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Prayer Requests</h2>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="answered">Answered</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading prayer requests...</div>
      ) : (
        <div className="space-y-4">
          {prayerRequests.map((request) => (
            <Card key={request._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {request.name || "Anonymous"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="answered">Answered</option>
                      <option value="archived">Archived</option>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(request._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{request.request}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

