"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Sermon {
  _id?: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
}

const empty: Sermon = { title: "", preacher: "", date: "", videoUrl: "", audioUrl: "", notes: "" };

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [form, setForm] = useState<Sermon>(empty);

  useEffect(() => { fetchSermons(); }, []);

  const fetchSermons = async () => {
    try {
      const res = await fetch("/api/sermons");
      const data = await res.json();
      setSermons(data.sermons || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/sermons/${editing._id}` : "/api/sermons";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { fetchSermons(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sermon?")) return;
    const res = await fetch(`/api/sermons/${id}`, { method: "DELETE" });
    if (res.ok) fetchSermons();
  };

  const handleEdit = (s: Sermon) => {
    setEditing(s);
    setForm({ title: s.title, preacher: s.preacher, date: s.date.split("T")[0], videoUrl: s.videoUrl || "", audioUrl: s.audioUrl || "", notes: s.notes || "" });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Sermons</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Sermon</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Sermon" : "Add New Sermon"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><Label>Preacher</Label><Input value={form.preacher} onChange={(e) => setForm({ ...form, preacher: e.target.value })} required /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
              <div><Label>Video URL (Optional)</Label><Input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} /></div>
              <div><Label>Audio URL (Optional)</Label><Input type="url" value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} /></div>
              <div><Label>Notes (Optional)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} /></div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading sermons...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sermons.map((s) => (
            <motion.div key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader><CardTitle className="text-lg">{s.title}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{s.preacher} • {new Date(s.date).toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(s)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(s._id!)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
