"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/reports").then((r) => r.json()).then((d) => setReports(d.reports));
  }, []);

  if (!reports) return <div className="py-12 text-center">Loading reports…</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports & Statistics</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">New members (30 days)</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reports.newMembersLast30Days}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Baptized (profile flag)</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reports.baptizedMembers}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Baptism milestones</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reports.baptismMilestones}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Families</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reports.families}</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Members by division</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(reports.membersByDivision || []).map((row: { _id: string; count: number }) => (
              <div key={row._id || "unknown"} className="flex justify-between"><span>{row._id || "Unassigned"}</span><span className="font-medium">{row.count}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Members by role</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm max-h-80 overflow-y-auto">
            {(reports.membersByRole || []).map((row: { _id: string; count: number }) => (
              <div key={row._id} className="flex justify-between"><span>{row._id}</span><span className="font-medium">{row.count}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Giving by purpose</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(reports.givingByPurpose || []).map((row: { _id: string; total: number; count: number }) => (
            <div key={row._id} className="flex justify-between">
              <span>{row._id}</span>
              <span>RWF {row.total?.toLocaleString()} ({row.count} records)</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
