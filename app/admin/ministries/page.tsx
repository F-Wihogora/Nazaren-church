"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Ministry {
  _id?: string;
  name: string;
  leader: string;
  description: string;
  members: string[];
  meetingSchedule?: string;
}

const empty: Ministry = { name: "", leader: "", description: "", members: [], meetingSchedule: "" };

export default function AdminMinistriesPage() {
  const [items, setItems] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [form, setForm] = useState<Ministry>(empty);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/ministries");
      const d = await res.json();
      setItems(d.ministries || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/ministries/${editing._id}` : "/api/ministries";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { fetchItems(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ministry?")) return;
    const res = await fetch(`/api/ministries/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  const handleEdit = (m: Ministry) => {
    setEditing(m);
    setForm({ name: m.name, leader: m.leader, description: m.description, members: m.members || [], meetingSchedule: m.meetingSchedule || "" });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Ministries</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Ministry</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Ministry" : "Add New Ministry"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Ministry Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Leader</Label><Input value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required /></div>
              <div><Label>Meeting Schedule</Label><Input value={form.meetingSchedule} onChange={(e) => setForm({ ...form, meetingSchedule: e.target.value })} placeholder="e.g., Every Sunday at 2:00 PM" /></div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading ministries...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <Card key={m._id}>
              <CardHeader><CardTitle className="text-lg">{m.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Leader: {m.leader}</p>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{m.description}</p>
                {m.meetingSchedule && <p className="text-xs text-muted-foreground mb-4">{m.meetingSchedule}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(m)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(m._id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
