"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MILESTONE_TYPES, PASTORAL_VISIT_TYPES } from "@/lib/church-constants";

type Member = { _id: string; fullName: string };

export default function AdminMilestonesPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [mForm, setMForm] = useState({ member: "", type: "Baptism", date: "", notes: "" });
  const [vForm, setVForm] = useState({ member: "", visitType: "Home Visit", date: "", leader: "", notes: "" });

  const load = () => {
    fetch("/api/members").then((r) => r.json()).then((d) => setMembers(d.members || []));
    fetch("/api/milestones").then((r) => r.json()).then((d) => setMilestones(d.milestones || []));
    fetch("/api/pastoral-visits").then((r) => r.json()).then((d) => setVisits(d.visits || []));
  };

  useEffect(() => { load(); }, []);

  const saveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/milestones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mForm) });
    if (res.ok) { setMForm({ member: "", type: "Baptism", date: "", notes: "" }); load(); }
  };

  const saveVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pastoral-visits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vForm) });
    if (res.ok) { setVForm({ member: "", visitType: "Home Visit", date: "", leader: "", notes: "" }); load(); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Milestones & Pastoral Care</h2>
        <p className="text-muted-foreground text-sm">Baptisms, dedications, and confidential follow-up (admin only).</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Add milestone</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveMilestone} className="space-y-3">
              <div>
                <Label>Member</Label>
                <Select value={mForm.member} onChange={(e) => setMForm({ ...mForm, member: e.target.value })} required>
                  <option value="">Select…</option>
                  {members.map((m) => <option key={m._id} value={m._id}>{m.fullName}</option>)}
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={mForm.type} onChange={(e) => setMForm({ ...mForm, type: e.target.value })}>
                  {MILESTONE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={mForm.date} onChange={(e) => setMForm({ ...mForm, date: e.target.value })} required /></div>
              <div><Label>Notes</Label><Textarea value={mForm.notes} onChange={(e) => setMForm({ ...mForm, notes: e.target.value })} rows={2} /></div>
              <Button type="submit">Save milestone</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pastoral visit</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveVisit} className="space-y-3">
              <div>
                <Label>Member</Label>
                <Select value={vForm.member} onChange={(e) => setVForm({ ...vForm, member: e.target.value })} required>
                  <option value="">Select…</option>
                  {members.map((m) => <option key={m._id} value={m._id}>{m.fullName}</option>)}
                </Select>
              </div>
              <div>
                <Label>Visit type</Label>
                <Select value={vForm.visitType} onChange={(e) => setVForm({ ...vForm, visitType: e.target.value })}>
                  {PASTORAL_VISIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={vForm.date} onChange={(e) => setVForm({ ...vForm, date: e.target.value })} required /></div>
              <div><Label>Leader / pastor</Label><Input value={vForm.leader} onChange={(e) => setVForm({ ...vForm, leader: e.target.value })} required /></div>
              <div><Label>Notes</Label><Textarea value={vForm.notes} onChange={(e) => setVForm({ ...vForm, notes: e.target.value })} rows={2} /></div>
              <Button type="submit">Save visit</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent milestones</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {milestones.slice(0, 15).map((m) => (
              <p key={m._id}>{m.member?.fullName} — {m.type} ({new Date(m.date).toLocaleDateString()})</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent pastoral visits</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {visits.slice(0, 15).map((v) => (
              <p key={v._id}>{v.member?.fullName} — {v.visitType} with {v.leader}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
