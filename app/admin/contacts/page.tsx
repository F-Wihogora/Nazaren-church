"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Trash2 } from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = () => {
    setLoading(true);
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) fetchContacts();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Contact Messages</h2>
      <p className="text-muted-foreground mb-6">Owner: Byumvuhore Frederic; backup: Wihogora Florissa. Check every working day and aim to reply within 24–48 hours. SMS alerts are not configured yet.</p>
      {loading ? (
        <div className="text-center py-12">Loading messages…</div>
      ) : contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">No messages yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <Card key={c._id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    {c.email}
                  </p>
                </div>
                <Button variant="ghost" size="icon" aria-label="Delete message" onClick={() => handleDelete(c._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                {c.phone && <p className="text-sm text-muted-foreground mb-2">Phone: {c.phone}</p>}
                <p className="text-sm whitespace-pre-wrap">{c.message}</p>
                <p className="text-xs text-muted-foreground mt-4">{new Date(c.createdAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
