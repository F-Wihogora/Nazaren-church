"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_TYPES } from "@/lib/church-constants";

type Member = { _id: string; fullName: string; division?: string };

export default function AdminAttendancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [present, setPresent] = useState<string[]>([]);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], serviceType: "Sunday Service", notes: "" });
  const [filter, setFilter] = useState("");

  const load = () => {
    fetch("/api/members?active=true").then((r) => r.json()).then((d) => setMembers(d.members || []));
    fetch("/api/attendance?limit=20").then((r) => r.json()).then((d) => setHistory(d.attendance || []));
  };

  useEffect(() => { load(); }, []);

  const filtered = members.filter((m) => m.fullName.toLowerCase().includes(filter.toLowerCase()));

  const toggle = (id: string) => setPresent((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, presentMembers: present }),
    });
    if (res.ok) {
      setPresent([]);
      load();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Attendance</h2>
        <p className="text-muted-foreground text-sm">Record who attended services and meetings.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Record attendance</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
              <div>
                <Label>Service / meeting</Label>
                <Select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                  {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div><Label>Search members</Label><Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter list…" /></div>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-md p-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map((m) => (
                <label key={m._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={present.includes(m._id)} onChange={() => toggle(m._id)} />
                  {m.fullName} {m.division && <span className="text-muted-foreground">({m.division})</span>}
                </label>
              ))}
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
            <Button type="submit">Save ({present.length} present)</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent records</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {history.map((h) => (
            <div key={h._id} className="text-sm border-b pb-2">
              <span className="font-medium">{new Date(h.date).toLocaleDateString()}</span> — {h.serviceType} · {(h.presentMembers || []).length} present
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
