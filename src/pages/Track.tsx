import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Phone,
  Inbox,
  Eye,
  Edit3,
  Download,
  Printer,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { SLABadge } from "@/components/SLABadge";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { AuditLog, type AuditEntry } from "@/components/AuditLog";

const auditEntries: AuditEntry[] = [
  { type: "created", actor: "Aarav Sharma", role: "Citizen", time: "Mar 12, 10:32 AM", note: "Complaint filed via web portal." },
  { type: "assigned", actor: "System", role: "Auto", time: "Mar 12, 10:33 AM", note: "Routed to Crime Branch — SI R. Verma." },
  { type: "viewed", actor: "SI R. Verma", role: "Officer", time: "Mar 12, 11:48 AM" },
  { type: "updated", actor: "SI R. Verma", role: "Officer", time: "Mar 14, 09:00 AM", note: "Status: Under Investigation." },
  { type: "escalated", actor: "System", role: "Auto", time: "Mar 18, 11:00 AM", note: "Escalated to ACP — SLA breached." },
];

const timeline = [
  {
    status: "Created",
    date: "Mar 12, 2024 · 10:32 AM",
    desc: "Complaint received and logged in system.",
    icon: FileText,
    done: true,
    color: "primary",
  },
  {
    status: "Viewed by Officer",
    date: "Mar 12, 2024 · 11:48 AM",
    desc: "SI R. Verma at MG Road Station opened the case file.",
    icon: Eye,
    done: true,
    color: "primary",
  },
  {
    status: "Updated — Under Investigation",
    date: "Mar 14, 2024 · 09:00 AM",
    desc: "Investigation initiated. Witness statements being recorded.",
    icon: Edit3,
    done: true,
    color: "warning",
  },
  {
    status: "Auto-Escalated",
    date: "Mar 18, 2024 · 11:00 AM",
    desc: "No update for 4 days — escalated to ACP for review.",
    icon: AlertTriangle,
    done: true,
    color: "destructive",
  },
  {
    status: "Resolution",
    date: "Pending",
    desc: "Awaiting final report.",
    icon: CheckCircle2,
    done: false,
    color: "success",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  primary: { bg: "bg-primary", text: "text-primary", border: "border-primary", ring: "ring-primary/20" },
  warning: { bg: "bg-warning", text: "text-warning", border: "border-warning", ring: "ring-warning/20" },
  destructive: { bg: "bg-destructive", text: "text-destructive", border: "border-destructive", ring: "ring-destructive/20" },
  success: { bg: "bg-success", text: "text-success", border: "border-success", ring: "ring-success/20" },
};

const Track = () => {
  const [id, setId] = useState("");
  const [searched, setSearched] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) setSearched(true);
  };

  const completed = timeline.filter((t) => t.done).length;
  const progress = (completed / timeline.length) * 100;

  return (
    <div className="container py-10 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Track Your Complaint</h1>
          <p className="text-muted-foreground mt-2">Enter your complaint ID to view the latest status.</p>
        </div>

        {/* Search */}
        <form onSubmit={search} className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-soft mb-8 animate-scale-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. SPC-2024-0892"
                className="pl-11 h-12"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="sm:w-auto">
              Track Status
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
            Try:{" "}
            {["SPC-2024-0892", "SPC-2024-0876"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => { setId(d); setSearched(true); }}
                className="px-2 py-1 rounded-md bg-accent text-accent-foreground hover:bg-accent/70"
              >
                {d}
              </button>
            ))}
          </div>
        </form>

        {!searched ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">No complaint loaded</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Enter your complaint ID above to view its real-time status, history, and assigned officer.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="gradient-primary p-6 text-primary-foreground">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider opacity-80">Complaint ID</div>
                    <div className="font-display text-2xl font-bold">SPC-2024-0892</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Auto-Escalated
                    </span>
                    <SLABadge hoursLeft={-12} className="bg-white/90" />
                  </div>
                </div>
                <h2 className="font-display text-xl font-semibold mt-4">Vehicle theft near MG Road</h2>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => toast.success("Complaint downloaded as PDF")}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> Download PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5 mr-1" /> Print
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs opacity-90 mb-2">
                    <span>{completed} of {timeline.length} milestones</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {[
                  { icon: Calendar, label: "Created", value: "Mar 12, 2024 · 10:32 AM" },
                  { icon: Clock, label: "Last updated", value: "Mar 18, 2024 · 11:00 AM" },
                  { icon: Building2, label: "Department", value: "Crime Branch" },
                  { icon: MapPin, label: "Station", value: "MG Road" },
                  { icon: User, label: "Officer", value: "SI R. Verma" },
                  { icon: Phone, label: "Contact", value: "+91 80-XXXX-XX" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                      <m.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                      <div className="text-sm font-medium">{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer remarks */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">Officer Remarks</h3>
                  <p className="text-xs text-muted-foreground">Comments and updates from the assigned officer</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  2 remarks
                </span>
              </div>
              <ol className="space-y-3">
                {[
                  {
                    officer: "SI R. Verma",
                    role: "Investigating Officer",
                    time: "Mar 14, 2024 · 09:00 AM",
                    note:
                      "Visited the incident location, recorded statements from 2 witnesses. CCTV footage from nearby ATM has been requisitioned.",
                  },
                  {
                    officer: "ACP S. Iyer",
                    role: "Senior Officer",
                    time: "Mar 18, 2024 · 11:15 AM",
                    note:
                      "Reviewed file post auto-escalation. Directed SI Verma to coordinate with Cyber Cell for vehicle tracking. Update expected within 48 hours.",
                  },
                ].map((r, i) => (
                  <li key={i} className="rounded-xl border border-border p-4 bg-accent/20">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {r.officer.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{r.officer}</div>
                          <div className="text-[11px] text-muted-foreground">{r.role}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{r.note}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-lg mb-6">Status Timeline</h3>
              <ol className="relative border-l-2 border-dashed border-border ml-4 space-y-7">
                {timeline.map((t, i) => {
                  const c = colorMap[t.color];
                  return (
                    <li key={i} className="relative pl-8 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <div
                        className={`absolute -left-[22px] flex items-center justify-center h-10 w-10 rounded-full ring-4 ${c.ring} ${
                          t.done ? c.bg : "bg-muted"
                        }`}
                      >
                        <t.icon className={`h-4 w-4 ${t.done ? "text-white" : "text-muted-foreground"}`} />
                        {t.done && i === timeline.findIndex((x) => x.color === "destructive") && (
                          <span className={`absolute inset-0 rounded-full ${c.bg} opacity-40 animate-pulse-ring`} />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{t.status}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${c.border} ${c.text} bg-transparent`}>
                          {t.done ? "Completed" : "Pending"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{t.date}</div>
                      <p className="text-sm text-foreground/80 mt-2">{t.desc}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Audit log */}
            <AuditLog entries={auditEntries} />

            {/* Feedback section */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-semibold text-sm">Rate this resolution</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your feedback helps us improve service quality and accountability.
                </p>
              </div>
              <FeedbackDialog complaintId="SPC-2024-0892" />
            </div>
          </div>
        )}
    </div>
  );
};

export default Track;
