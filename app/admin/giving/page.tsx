"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface GivingRecord {
  _id?: string;
  name: string;
  amount: number;
  purpose: "tithe" | "offering" | "donation" | "other";
  date: string;
  notes?: string;
}

const empty: GivingRecord = {
  name: "",
  amount: 0,
  purpose: "tithe",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function AdminGivingPage() {
  const [records, setRecords] = useState<GivingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GivingRecord | null>(null);
  const [form, setForm] = useState<GivingRecord>(empty);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/giving-records");
      const d = await res.json();
      setRecords(d.givingRecords || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/giving-records/${editing._id}` : "/api/giving-records";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount.toString()) }),
    });
    if (res.ok) { fetchRecords(); reset(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const res = await fetch(`/api/giving-records/${id}`, { method: "DELETE" });
    if (res.ok) fetchRecords();
  };

  const handleEdit = (r: GivingRecord) => {
    setEditing(r);
    setForm({ name: r.name, amount: r.amount, purpose: r.purpose, date: r.date.split("T")[0], notes: r.notes || "" });
    setShowForm(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShowForm(false); };

  const total = records.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Giving Records</h2>
          <p className="text-muted-foreground">Total: RWF {total.toLocaleString()}</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Record</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editing ? "Edit Record" : "Add Giving Record"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div>
                  <Label>Amount (RWF)</Label>
                  <Input type="number" step="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Purpose</Label>
                  <Select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value as "tithe" | "offering" | "donation" | "other" })}>
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="donation">Donation</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
              </div>
              <div><Label>Notes (Optional)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="text-center py-12">Loading records...</div> : (
        <div className="space-y-4">
          {records.map((r) => (
            <Card key={r._id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{r.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{new Date(r.date).toLocaleDateString()} • {r.purpose}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold">RWF {r.amount.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(r)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(r._id!)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {r.notes && <CardContent><p className="text-sm text-muted-foreground">{r.notes}</p></CardContent>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
