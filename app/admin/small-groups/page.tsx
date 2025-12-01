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

export default function AdminSmallGroupsPage() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SmallGroup | null>(null);
  const [formData, setFormData] = useState<SmallGroup>({
    name: "",
    leader: "",
    members: [],
    location: "",
    meetingTime: "",
    description: "",
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/small-groups");
      const data = await res.json();
      setGroups(data.smallGroups || []);
    } catch (error) {
      console.error("Error fetching small groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingGroup
        ? `/api/small-groups/${editingGroup._id}`
        : "/api/small-groups";
      const method = editingGroup ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchGroups();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving small group:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this small group?")) return;

    try {
      const res = await fetch(`/api/small-groups/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error("Error deleting small group:", error);
    }
  };

  const handleEdit = (group: SmallGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      leader: group.leader,
      members: group.members || [],
      location: group.location,
      meetingTime: group.meetingTime,
      description: group.description,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      leader: "",
      members: [],
      location: "",
      meetingTime: "",
      description: "",
    });
    setEditingGroup(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Small Groups</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Small Group
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingGroup ? "Edit Small Group" : "Add New Small Group"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="leader">Leader</Label>
                <Input
                  id="leader"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  value={formData.meetingTime}
                  onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                  placeholder="e.g., Every Friday at 7:00 PM"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingGroup ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">Loading small groups...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group._id}>
              <CardHeader>
                <CardTitle className="text-lg">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Leader: {group.leader}</p>
                <p className="text-sm text-muted-foreground mb-2">Location: {group.location}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Meeting: {group.meetingTime}
                </p>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(group)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(group._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

