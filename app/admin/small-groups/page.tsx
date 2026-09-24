"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface SmallGroup {
  _id?: string;
  name: string;
  leader: string;
  members: string[];
  location: string;
  meetingTime: string;
  description: string;
}

const empty: SmallGroup = { name: "", leader: "", members: [], location: "", meetingTime: "", description: "" };

export default function AdminSmallGroupsPage() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SmallGroup | null>(null);
  const [form, setForm] = useState<SmallGroup>(empty);

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/small-groups");
      const d = await res.json();
      setGroups(d.smallGroups || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/small-groups/${editing._id}` : "/api/small-groups";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { fetchGroups(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this small group?")) return;
    const res = await fetch(`/api/small-groups/${id}`, { method: "DELETE" });
    if (res.ok) fetchGroups();
  };

  const handleEdit = (g: SmallGroup) => {
    setEditing(g);
    setForm({ name: g.name, leader: g.leader, members: g.members || [], location: g.location, meetingTime: g.meetingTime, description: g.description });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Small Groups</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Small Group</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Small Group" : "Add New Small Group"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Group Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Leader</Label><Input value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} required /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
              <div><Label>Meeting Time</Label><Input value={form.meetingTime} onChange={(e) => setForm({ ...form, meetingTime: e.target.value })} placeholder="e.g., Every Friday at 7:00 PM" required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required /></div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading small groups...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <Card key={g._id}>
              <CardHeader><CardTitle className="text-lg">{g.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Leader: {g.leader}</p>
                <p className="text-sm text-muted-foreground mb-2">Location: {g.location}</p>
                <p className="text-sm text-muted-foreground mb-2">Meeting: {g.meetingTime}</p>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{g.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(g)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(g._id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
