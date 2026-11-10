"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { CHURCH_DIVISIONS } from "@/lib/church-constants";

type MemberRef = { _id: string; fullName: string };
type Family = {
  _id?: string;
  name: string;
  division: string;
  address?: string;
  phone?: string;
  notes?: string;
  head?: MemberRef;
  members: MemberRef[];
};

const empty: Family = { name: "", division: "General", members: [] };

export default function AdminFamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [allMembers, setAllMembers] = useState<MemberRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Family | null>(null);
  const [form, setForm] = useState<Family>(empty);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const load = async () => {
    const [fRes, mRes] = await Promise.all([fetch("/api/families"), fetch("/api/members")]);
    const fData = await fRes.json();
    const mData = await mRes.json();
    setFamilies(fData.families || []);
    setAllMembers((mData.members || []).map((m: MemberRef) => ({ _id: m._id, fullName: m.fullName })));
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setSelectedMemberIds([]);
    setShowForm(true);
  };

  const openEdit = (family: Family) => {
    setEditing(family);
    setForm({
      name: family.name,
      division: family.division || "General",
      address: family.address,
      phone: family.phone,
      notes: family.notes,
      members: family.members || [],
    });
    setSelectedMemberIds((family.members || []).map((m) => m._id));
    setShowForm(true);
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, members: selectedMemberIds, head: selectedMemberIds[0] || undefined };
    const url = editing?._id ? `/api/families/${editing._id}` : "/api/families";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await load();
      setShowForm(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this family? Members will be unlinked.")) return;
    const res = await fetch(`/api/families/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Families & Households</h2>
          <p className="text-muted-foreground text-sm">Group parents, youth, and children for pastoral care and communication.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Family</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>{editing ? "Edit Family" : "New Family"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Family name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Niyonsaba Family" /></div>
                <div>
                  <Label>Primary division</Label>
                  <Select value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })}>
                    {CHURCH_DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Address</Label><Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              </div>
              <div>
                <Label>Household members</Label>
                <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                  {allMembers.map((m) => (
                    <label key={m._id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedMemberIds.includes(m._id)} onChange={() => toggleMember(m._id)} />
                      {m.fullName}
                    </label>
                  ))}
                </div>
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
              <Button type="submit">{editing ? "Save changes" : "Create family"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <p className="text-center py-12">Loading…</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {families.map((f) => (
            <Card key={f._id}>
              <CardHeader>
                <CardTitle>{f.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{f.division} · {(f.members || []).length} members</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm mb-4 space-y-1">
                  {(f.members || []).map((m) => <li key={m._id}>{m.fullName}</li>)}
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(f)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(f._id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
