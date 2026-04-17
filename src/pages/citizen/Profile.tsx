import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const stats = [
  { label: "Total", value: 12, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending", value: 3, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  { label: "Escalated", value: 1, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Resolved", value: 8, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
];

const history = [
  { id: "SPC-2024-0892", title: "Vehicle theft near MG Road", status: "In Progress", color: "warning" },
  { id: "SPC-2024-0876", title: "Noise complaint - late night", status: "Resolved", color: "success" },
  { id: "SPC-2024-0844", title: "Cyber fraud — UPI scam", status: "Escalated", color: "destructive" },
  { id: "SPC-2024-0801", title: "Missing person report", status: "In Progress", color: "warning" },
];

const colors: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const Profile = () => {
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated");
  };

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and view your complaint history.
        </p>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden animate-scale-in">
        <div className="gradient-hero h-28 relative">
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl gradient-teal flex items-center justify-center font-bold text-3xl text-secondary-foreground border-4 border-card shadow-elegant">
                AS
              </div>
              <button className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">Aarav Sharma</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Shield className="h-3.5 w-3.5 text-success" /> Verified Citizen ·
                Member since Jan 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 hover-lift animate-fade-in-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mt-6">
        {/* Edit form */}
        <form
          onSubmit={save}
          className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 space-y-4 animate-fade-in-up"
        >
          <div>
            <h3 className="font-display font-semibold text-lg">Personal information</h3>
            <p className="text-xs text-muted-foreground">Update your contact details below.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" defaultValue="Aarav Sharma" className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" defaultValue="+91 98765 43210" className="pl-10" />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" defaultValue="aarav@example.com" className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="address" defaultValue="Indira Nagar, Bengaluru" className="pl-10" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="hero">
              Save changes
            </Button>
          </div>
        </form>

        {/* History */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 animate-fade-in-up [animation-delay:120ms]">
          <h3 className="font-display font-semibold text-lg mb-4">Complaint history</h3>
          <div className="space-y-3">
            {history.map((h) => (
              <Link
                key={h.id}
                to="/citizen/track"
                className="block p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-accent/30 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-primary">{h.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[h.color]}`}>
                    {h.status}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{h.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
