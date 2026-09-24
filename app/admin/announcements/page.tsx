"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Announcement {
  _id?: string;
  type: "weekly" | "verse" | "notice";
  title: string;
  content: string;
  bibleVerse?: string;
  isActive: boolean;
}

const empty: Announcement = { type: "weekly", title: "", content: "", bibleVerse: "", isActive: true };

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Announcement>(empty);

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const d = await res.json();
      setItems(d.announcements || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/announcements/${editing._id}` : "/api/announcements";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { fetchAnnouncements(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) fetchAnnouncements();
  };

  const handleEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ type: a.type, title: a.title, content: a.content, bibleVerse: a.bibleVerse || "", isActive: a.isActive });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Announcements</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Announcement</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Announcement" : "Add New Announcement"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "weekly" | "verse" | "notice" })}>
                  <option value="weekly">Weekly Announcement</option>
                  <option value="verse">Bible Verse</option>
                  <option value="notice">Special Notice</option>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} required /></div>
              {form.type === "verse" && <div><Label>Bible Verse</Label><Input value={form.bibleVerse} onChange={(e) => setForm({ ...form, bibleVerse: e.target.value })} /></div>}
              <div>
                <Label>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="mr-2" />
                  Active (shown on homepage)
                </Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading announcements...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((a) => (
            <Card key={a._id}>
              <CardHeader><CardTitle className="text-lg">{a.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2 capitalize">{a.type} • {a.isActive ? "Active" : "Inactive"}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{a.content}</p>
                {a.bibleVerse && <p className="text-xs italic text-primary mb-4">&quot;{a.bibleVerse}&quot;</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(a)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(a._id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
