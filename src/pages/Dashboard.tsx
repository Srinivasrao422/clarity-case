import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Bot,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Timer,
  Percent,
  ShieldAlert,
} from "lucide-react";

const summary = [
  { label: "Total Complaints", value: 12, icon: FileText, color: "text-primary", bg: "bg-primary/10", trend: "+2 this month" },
  { label: "Pending", value: 3, icon: Clock, color: "text-warning", bg: "bg-warning/10", trend: "Avg 2 days" },
  { label: "Escalated", value: 1, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", trend: "Auto" },
  { label: "Resolved", value: 8, icon: CheckCircle2, color: "text-success", bg: "bg-success/10", trend: "92% rate" },
];

const recent = [
  { id: "SPC-2024-0892", title: "Vehicle theft near MG Road", category: "Theft", status: "In Progress", date: "2 days ago", color: "warning" },
  { id: "SPC-2024-0876", title: "Noise complaint - late night", category: "Public Nuisance", status: "Resolved", date: "5 days ago", color: "success" },
  { id: "SPC-2024-0844", title: "Cyber fraud — UPI scam", category: "Cybercrime", status: "Escalated", date: "1 week ago", color: "destructive" },
  { id: "SPC-2024-0801", title: "Missing person report", category: "Missing Person", status: "In Progress", date: "2 weeks ago", color: "warning" },
  { id: "SPC-2024-0790", title: "Property dispute documentation", category: "Civil", status: "Submitted", date: "3 weeks ago", color: "primary" },
];

const statusStyles: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const Dashboard = () => {
  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Aarav Sharma 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your complaints and recent activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/citizen/track"><Search className="mr-1 h-4 w-4" /> Track</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/citizen/raise"><Plus className="mr-1 h-4 w-4" /> New Complaint</Link>
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {summary.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 hover-lift animate-scale-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="font-display text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {s.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card animate-fade-in-up">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-lg">Recent Complaints</h2>
              <p className="text-xs text-muted-foreground">Your last 5 submissions</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/citizen/track">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recent.map((c, i) => (
              <Link
                key={c.id}
                to="/citizen/track"
                className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{c.id}</span> · <span>{c.category}</span> · <span>{c.date}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[c.color]}`}>
                  {c.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 animate-fade-in-up [animation-delay:200ms]">
          <Link
            to="/citizen/raise"
            className="block rounded-2xl gradient-primary p-6 text-primary-foreground hover-lift relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <Plus className="h-8 w-8 mb-3" />
            <h3 className="font-display font-semibold text-lg">New Complaint</h3>
            <p className="text-sm opacity-90 mt-1">File a new complaint with our guided form.</p>
          </Link>

          <Link
            to="/citizen/assistant"
            className="block rounded-2xl gradient-teal p-6 text-secondary-foreground hover-lift relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <Bot className="h-8 w-8 mb-3" />
            <h3 className="font-display font-semibold text-lg">AI Assistant</h3>
            <p className="text-sm opacity-90 mt-1">Need help drafting? Chat with our AI.</p>
          </Link>

          <Link
            to="/citizen/track"
            className="block rounded-2xl bg-card border border-border p-6 hover-lift"
          >
            <Search className="h-8 w-8 mb-3 text-primary" />
            <h3 className="font-display font-semibold text-lg">Track Complaint</h3>
            <p className="text-sm text-muted-foreground mt-1">Check status with your complaint ID.</p>
          </Link>
        </div>
      </div>

      {/* Crime insights widget */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" /> Crime Insights — Your Area
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Bengaluru · Last 30 days</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
            Safer than 62% areas
          </span>
        </div>
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { label: "Theft", value: 38, color: "bg-destructive" },
            { label: "Cyber Fraud", value: 27, color: "bg-warning" },
            { label: "Vehicle", value: 18, color: "bg-primary" },
            { label: "Other", value: 17, color: "bg-secondary" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border p-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted-foreground">{c.value}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
