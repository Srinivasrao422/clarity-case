import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

const stats = [
  { label: "Total Cases", value: "1,284", change: "+12.4%", up: true, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending", value: "162", change: "-3.2%", up: false, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  { label: "Escalated", value: "28", change: "+2.1%", up: true, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Resolved (30d)", value: "1,094", change: "+18.6%", up: true, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
];

const recent = [
  { id: "SPC-2024-0892", citizen: "Aarav Sharma", category: "Theft", status: "Escalated", date: "Mar 12" },
  { id: "SPC-2024-0891", citizen: "Priya Mehta", category: "Cybercrime", status: "In Progress", date: "Mar 12" },
  { id: "SPC-2024-0890", citizen: "Rohan Iyer", category: "Public Nuisance", status: "Resolved", date: "Mar 11" },
  { id: "SPC-2024-0889", citizen: "Neha Kapoor", category: "Missing Person", status: "In Progress", date: "Mar 11" },
  { id: "SPC-2024-0888", citizen: "Vikram Rao", category: "Fraud", status: "Submitted", date: "Mar 10" },
];

const statusStyles: Record<string, string> = {
  Escalated: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Submitted: "bg-primary/10 text-primary border-primary/20",
};

const ChartBars = () => {
  const data = [40, 65, 35, 78, 52, 88, 60, 92, 70, 84, 55, 95];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((v, i) => (
        <div key={i} className="flex-1 group relative">
          <div
            className="w-full rounded-t-md gradient-primary opacity-80 group-hover:opacity-100 transition-all"
            style={{ height: `${(v / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Escalation alert banner */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
        <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">3 complaints breached SLA in the last 24h</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Auto-escalation triggered — review pending cases to avoid further breaches.
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
          <Link to="/admin/escalations">Review escalations</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 hover-lift animate-scale-in"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className={`text-xs flex items-center gap-0.5 ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Complaint Volume</h3>
              <p className="text-xs text-muted-foreground">Last 12 weeks</p>
            </div>
            <Button variant="outline" size="sm">
              This year <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <ChartBars />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in-up [animation-delay:100ms]">
          <h3 className="font-display font-semibold mb-4">Categories</h3>
          <div className="space-y-3">
            {[
              { label: "Theft", value: 38, color: "bg-primary" },
              { label: "Cyber", value: 27, color: "bg-secondary" },
              { label: "Fraud", value: 18, color: "bg-warning" },
              { label: "Other", value: 17, color: "bg-muted-foreground" },
            ].map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.label}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent table */}
      <div className="rounded-2xl border border-border bg-card animate-fade-in-up [animation-delay:200ms]">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Recent Complaints</h3>
            <p className="text-xs text-muted-foreground">Latest 5 submissions</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/complaints">View all</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="text-left font-medium py-3 px-5">ID</th>
                <th className="text-left font-medium py-3 px-5">Citizen</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Category</th>
                <th className="text-left font-medium py-3 px-5">Status</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Date</th>
                <th className="text-right font-medium py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((c) => (
                <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-primary">{c.id}</td>
                  <td className="py-3 px-5">{c.citizen}</td>
                  <td className="py-3 px-5 hidden md:table-cell text-muted-foreground">{c.category}</td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell text-muted-foreground text-xs">{c.date}</td>
                  <td className="py-3 px-5 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
