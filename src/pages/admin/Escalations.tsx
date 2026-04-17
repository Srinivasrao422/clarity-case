import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, ArrowUpRight, Zap } from "lucide-react";
import { toast } from "sonner";

const escalated = [
  { id: "SPC-2024-0892", title: "Vehicle theft near MG Road", citizen: "Aarav Sharma", station: "MG Road", level: "L2 — ACP", overdue: "4 days", priority: "High" },
  { id: "SPC-2024-0844", title: "Cyber fraud — UPI scam", citizen: "Nita Shah", station: "Cyber Cell", level: "L1 — SI", overdue: "2 days", priority: "High" },
  { id: "SPC-2024-0801", title: "Missing person report", citizen: "Mahesh Kumar", station: "HSR Layout", level: "L3 — DCP", overdue: "8 days", priority: "Critical" },
  { id: "SPC-2024-0780", title: "Repeated harassment", citizen: "Priya Mehta", station: "Indira Nagar", level: "L2 — ACP", overdue: "5 days", priority: "High" },
];

const priorityStyles: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-destructive/10 text-destructive border border-destructive/20",
};

const Escalations = () => {
  const override = (id: string) => toast.success(`Manual override applied to ${id}`);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Escalation Control</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cases that have crossed SLA thresholds. Review, override, or fast-track manually.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Active escalations", value: 28, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Avg overdue", value: "3.4 d", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Auto-escalated today", value: 6, icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 hover-lift animate-scale-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-display font-semibold">Cases past SLA</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Highlighted cases require immediate attention from senior officers.
          </p>
        </div>

        <div className="divide-y divide-border">
          {escalated.map((c, i) => (
            <div
              key={c.id}
              className="p-5 hover:bg-accent/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-primary">{c.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityStyles[c.priority]}`}>
                      {c.priority}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Overdue {c.overdue}
                    </span>
                  </div>
                  <h4 className="font-medium mt-1.5">{c.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Citizen: {c.citizen} · Station: {c.station} · Escalated to: <span className="text-foreground font-medium">{c.level}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View case
                  </Button>
                  <Button variant="hero" size="sm" onClick={() => override(c.id)}>
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Override
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Escalations;
