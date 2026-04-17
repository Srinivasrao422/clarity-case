import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [params] = useSearchParams();
  const role = (params.get("role") === "admin" ? "admin" : "citizen") as "admin" | "citizen";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Signed in successfully" : "Account created");
    setTimeout(() => navigate(isAdmin ? "/admin/dashboard" : "/citizen/dashboard"), 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className={`absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl animate-blob pointer-events-none ${isAdmin ? "bg-primary/20" : "bg-secondary/20"}`} />

      <header className="relative z-10 container flex items-center justify-between h-16">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Link>
          </Button>
        </div>
      </header>

      <div className="relative z-10 container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Left side - branding */}
          <div className="hidden lg:block space-y-6 animate-fade-in-up">
            <div className={`relative rounded-3xl p-10 text-primary-foreground overflow-hidden ${isAdmin ? "gradient-primary" : "gradient-hero"}`}>
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="relative space-y-5">
                {isAdmin ? <Shield className="h-12 w-12" /> : <ShieldCheck className="h-12 w-12" />}
                <h2 className="font-display text-3xl font-bold leading-tight">
                  {isAdmin
                    ? "Powerful tools to triage, investigate, and resolve."
                    : "A safer, more transparent justice system starts with you."}
                </h2>
                <p className="text-primary-foreground/80">
                  {isAdmin
                    ? "Manage cases, monitor SLAs, and coordinate officers from one unified dashboard."
                    : "Your account is end-to-end encrypted and never shared with third parties."}
                </p>
                <div className="grid grid-cols-3 gap-3 pt-4">
                  {(isAdmin
                    ? [
                        { v: "1.2K+", l: "Officers" },
                        { v: "92%", l: "Resolved" },
                        { v: "48h", l: "Avg SLA" },
                      ]
                    : [
                        { v: "120K+", l: "Citizens" },
                        { v: "92%", l: "Resolved" },
                        { v: "48h", l: "Response" },
                      ]
                  ).map((s) => (
                    <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur p-3 text-center">
                      <div className="font-bold text-lg">{s.v}</div>
                      <div className="text-xs opacity-80">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Switch portal */}
            <Link
              to={`/auth?role=${isAdmin ? "citizen" : "admin"}`}
              className="block text-sm text-muted-foreground hover:text-primary"
            >
              ← Switch to {isAdmin ? "Citizen" : "Admin"} portal
            </Link>
          </div>

          {/* Right side - form */}
          <div className="w-full max-w-md mx-auto animate-scale-in">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${isAdmin ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/10 text-secondary border border-secondary/20"}`}>
                  {isAdmin ? "Admin Portal" : "Citizen Portal"}
                </span>
              </div>

              <div className="grid grid-cols-2 p-1 bg-muted rounded-xl my-5">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    disabled={isAdmin && m === "register"}
                    className={`py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      mode === m
                        ? "bg-card shadow-soft text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold">
                  {mode === "login" ? "Welcome back" : "Join SPCAES"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAdmin
                    ? "Restricted to verified personnel"
                    : mode === "login"
                    ? "Access your complaints dashboard"
                    : "Start filing complaints in minutes"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && !isAdmin && (
                  <>
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" placeholder="Aarav Sharma" className="pl-10" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" placeholder="+91 98765 43210" className="pl-10" required />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">{isAdmin ? "Officer ID / Email" : "Email"}</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type={isAdmin ? "text" : "email"}
                      placeholder={isAdmin ? "OFC-12345" : "you@example.com"}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant={isAdmin ? "hero" : "teal"} size="lg" className="w-full">
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>

                {!isAdmin && (
                  <>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline">Google</Button>
                      <Button type="button" variant="outline">DigiLocker</Button>
                    </div>
                  </>
                )}
              </form>

              <div className="lg:hidden mt-5 text-center">
                <Link
                  to={`/auth?role=${isAdmin ? "citizen" : "admin"}`}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Switch to {isAdmin ? "Citizen" : "Admin"} portal
                </Link>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-6">
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms</a> &{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
