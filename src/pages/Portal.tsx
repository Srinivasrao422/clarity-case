import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  User,
  Shield,
  CheckCircle2,
  Sparkles,
  Bot,
  Activity,
  LayoutDashboard,
  Users,
  BarChart3,
  Lock,
} from "lucide-react";

const userPerks = [
  { icon: Bot, label: "AI complaint assistant" },
  { icon: Activity, label: "Real-time tracking" },
  { icon: Lock, label: "Private & encrypted" },
];

const adminPerks = [
  { icon: LayoutDashboard, label: "Unified case dashboard" },
  { icon: Users, label: "Officer & station mgmt" },
  { icon: BarChart3, label: "Analytics & reporting" },
];

const Portal = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background flourishes */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-secondary/20 blur-3xl animate-blob [animation-delay:3s] pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 container flex items-center justify-between h-16">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" /> Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 container py-12 lg:py-20">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur text-xs font-medium animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Choose your portal
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] animate-fade-in-up">
            Where would you like <br className="hidden sm:block" />
            to <span className="text-gradient">go today?</span>
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in-up [animation-delay:120ms]">
            Two purpose-built experiences — one for citizens, one for officers.
            Pick the portal that matches your role.
          </p>
        </div>

        {/* Portal cards */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* User Portal */}
          <Link
            to="/auth?role=citizen"
            className="group relative rounded-3xl border border-border bg-card p-8 sm:p-10 overflow-hidden hover-lift animate-fade-in-up [animation-delay:200ms]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-secondary/20 blur-3xl group-hover:bg-secondary/30 transition-all duration-500" />

            <div className="relative space-y-6">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-2xl gradient-teal flex items-center justify-center shadow-teal group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <User className="h-7 w-7 text-secondary-foreground" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
                  For Citizens
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold">
                  User Portal
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  File complaints, chat with the AI assistant, and follow your
                  case from submission to resolution.
                </p>
              </div>

              <ul className="space-y-2.5">
                {userPerks.map((p) => (
                  <li key={p.label} className="flex items-center gap-3 text-sm">
                    <div className="h-7 w-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <p.icon className="h-3.5 w-3.5 text-secondary" />
                    </div>
                    <span className="text-foreground/80">{p.label}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div className="text-xs text-muted-foreground">
                  No prior account? Sign up in 60 seconds.
                </div>
                <div className="flex items-center gap-1.5 text-secondary font-semibold text-sm group-hover:gap-3 transition-all">
                  Enter <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link
            to="/auth?role=admin"
            className="group relative rounded-3xl border border-border bg-card p-8 sm:p-10 overflow-hidden hover-lift animate-fade-in-up [animation-delay:320ms]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-500" />

            <div className="relative space-y-6">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  For Officers
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold">
                  Admin Portal
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Triage complaints, assign officers, monitor SLAs and resolve
                  cases with powerful analytics.
                </p>
              </div>

              <ul className="space-y-2.5">
                {adminPerks.map((p) => (
                  <li key={p.label} className="flex items-center gap-3 text-sm">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <p.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80">{p.label}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Restricted to verified personnel
                </div>
                <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  Enter <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground animate-fade-in [animation-delay:500ms]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> Govt-grade security
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> 24/7 AI assistant
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> Auto escalation
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> End-to-end encrypted
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portal;
