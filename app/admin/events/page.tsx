"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X, Users } from "lucide-react";

interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  imageUrl?: string;
}

const empty: Event = { title: "", description: "", date: "", time: "", location: "", imageUrl: "" };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<Event>(empty);
  const [rsvpEventId, setRsvpEventId] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<{ name: string; email: string; phone?: string; guests: number; createdAt: string }[]>([]);
  const [rsvpGuests, setRsvpGuests] = useState(0);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRsvps = async (eventId: string) => {
    setRsvpEventId(eventId);
    setRsvpLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`);
      const d = await res.json();
      setRsvps(d.rsvps || []);
      setRsvpGuests(d.totalGuests || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setRsvpLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const d = await res.json();
      setEvents(d.events || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/events/${editing._id}` : "/api/events";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { fetchEvents(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) fetchEvents();
  };

  const handleEdit = (ev: Event) => {
    setEditing(ev);
    setForm({ title: ev.title, description: ev.description, date: ev.date.split("T")[0], time: ev.time || "", location: ev.location || "", imageUrl: ev.imageUrl || "" });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button onClick={() => setShowForm(true)} className="shrink-0"><Plus className="mr-2 h-4 w-4" />Add Event</Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Event" : "Add New Event"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
                <div><Label>Time (Optional)</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
              </div>
              <div><Label>Location (Optional)</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Image URL (Optional)</Label><Input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {rsvpEventId && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Event RSVPs ({rsvpGuests} guests)</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setRsvpEventId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            {rsvpLoading ? (
              <p className="text-sm text-muted-foreground">Loading RSVPs…</p>
            ) : rsvps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No RSVPs yet.</p>
            ) : (
              <ul className="space-y-3">
                {rsvps.map((r) => (
                  <li key={r.email} className="text-sm border-b pb-2">
                    <span className="font-medium">{r.name}</span> — {r.email}
                    {r.phone && <span className="text-muted-foreground"> · {r.phone}</span>}
                    <span className="text-muted-foreground"> · {r.guests} attending</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading events...</div> : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No events found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => (
            <Card key={ev._id}>
              <CardHeader><CardTitle className="text-lg">{ev.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ev.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{new Date(ev.date).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openRsvps(ev._id!)}><Users className="h-4 w-4 mr-1" />RSVPs</Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ev)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(ev._id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
