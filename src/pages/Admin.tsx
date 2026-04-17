import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  Settings,
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Complaints", icon: FileText },
  { label: "Officers", icon: Users },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Cases", value: "1,284", change: "+12.4%", up: true, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending", value: "162", change: "-3.2%", up: false, color: "text-warning", bg: "bg-warning/10" },
  { label: "Escalated", value: "28", change: "+2.1%", up: true, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Resolved (30d)", value: "1,094", change: "+18.6%", up: true, color: "text-success", bg: "bg-success/10" },
];

const complaints = [
  { id: "SPC-2024-0892", citizen: "Aarav Sharma", category: "Theft", station: "MG Road", priority: "High", status: "Escalated", date: "Mar 12" },
  { id: "SPC-2024-0891", citizen: "Priya Mehta", category: "Cybercrime", station: "Cyber Cell", priority: "High", status: "In Progress", date: "Mar 12" },
  { id: "SPC-2024-0890", citizen: "Rohan Iyer", category: "Public Nuisance", station: "Indira Nagar", priority: "Low", status: "Resolved", date: "Mar 11" },
  { id: "SPC-2024-0889", citizen: "Neha Kapoor", category: "Missing Person", station: "HSR Layout", priority: "High", status: "In Progress", date: "Mar 11" },
  { id: "SPC-2024-0888", citizen: "Vikram Rao", category: "Fraud", station: "Whitefield", priority: "Medium", status: "Submitted", date: "Mar 10" },
  { id: "SPC-2024-0887", citizen: "Anjali Singh", category: "Vehicle", station: "Koramangala", priority: "Medium", status: "Resolved", date: "Mar 10" },
  { id: "SPC-2024-0886", citizen: "Karthik Nair", category: "Domestic", station: "Jayanagar", priority: "High", status: "In Progress", date: "Mar 09" },
];

const statusStyles: Record<string, string> = {
  "Escalated": "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  "Resolved": "bg-success/10 text-success border-success/20",
  "Submitted": "bg-primary/10 text-primary border-primary/20",
};

const priorityStyles: Record<string, string> = {
  "High": "bg-destructive/10 text-destructive",
  "Medium": "bg-warning/10 text-warning",
  "Low": "bg-muted text-muted-foreground",
};

// Tiny inline chart
const ChartBars = () => {
  const data = [40, 65, 35, 78, 52, 88, 60, 92, 70, 84, 55, 95];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-32">
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

const Admin = () => {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = complaints.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter;
    const matchesQuery = !query ||
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.citizen.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const updateStatus = (id: string) => {
    toast.success(`${id} status updated`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <Logo variant="light" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent">
            <div className="h-9 w-9 rounded-full gradient-teal flex items-center justify-center font-semibold text-sm text-secondary-foreground">
              RK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Insp. R. Kumar</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">MG Road Station</div>
            </div>
            <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-30">
          <div className="px-5 py-3 flex items-center gap-4">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage and resolve citizen complaints</p>
            </div>
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints, citizens, IDs..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Exit</Link>
            </Button>
          </div>
        </header>

        <main className="p-5 space-y-6 flex-1">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-5 hover-lift animate-scale-in"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                  {s.label === "Pending" ? <Clock className={`h-5 w-5 ${s.color}`} /> :
                   s.label === "Escalated" ? <AlertTriangle className={`h-5 w-5 ${s.color}`} /> :
                   s.label === "Resolved (30d)" ? <CheckCircle2 className={`h-5 w-5 ${s.color}`} /> :
                   <FileText className={`h-5 w-5 ${s.color}`} />}
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

          {/* Charts row */}
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

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card animate-fade-in-up [animation-delay:200ms]">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">All Complaints</h3>
                <p className="text-xs text-muted-foreground">{filtered.length} of {complaints.length} shown</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", "Submitted", "In Progress", "Escalated", "Resolved"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <Button variant="outline" size="sm">
                  <Filter className="h-3 w-3 mr-1" /> More
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                    <th className="text-left font-medium py-3 px-5">ID</th>
                    <th className="text-left font-medium py-3 px-5">Citizen</th>
                    <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Category</th>
                    <th className="text-left font-medium py-3 px-5 hidden lg:table-cell">Station</th>
                    <th className="text-left font-medium py-3 px-5">Priority</th>
                    <th className="text-left font-medium py-3 px-5">Status</th>
                    <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Date</th>
                    <th className="text-right font-medium py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-3 px-5 font-medium text-primary">{c.id}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full gradient-teal flex items-center justify-center text-[10px] font-semibold text-secondary-foreground">
                            {c.citizen.split(" ").map((n) => n[0]).join("")}
                          </div>
                          {c.citizen}
                        </div>
                      </td>
                      <td className="py-3 px-5 hidden md:table-cell text-muted-foreground">{c.category}</td>
                      <td className="py-3 px-5 hidden lg:table-cell text-muted-foreground">{c.station}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityStyles[c.priority]}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 hidden md:table-cell text-muted-foreground text-xs">{c.date}</td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => updateStatus(c.id)}>
                            Update
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted-foreground">
                        No complaints match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
