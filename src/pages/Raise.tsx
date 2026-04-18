import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Tag,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  AlertTriangle,
  Car,
  ShieldAlert,
  Wifi,
  Users,
  Home,
  Briefcase,
  Sparkles,
  Scale,
  Zap,
  Download,
  Building2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getDepartment } from "@/lib/departments";

const steps = [
  { n: 1, label: "Details", icon: FileText },
  { n: 2, label: "Category", icon: Tag },
  { n: 3, label: "Evidence", icon: Upload },
  { n: 4, label: "Review", icon: CheckCircle2 },
];

const categories = [
  { id: "theft", label: "Theft / Robbery", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10" },
  { id: "vehicle", label: "Vehicle / Traffic", icon: Car, color: "text-primary", bg: "bg-primary/10" },
  { id: "cyber", label: "Cybercrime", icon: Wifi, color: "text-secondary", bg: "bg-secondary/10" },
  { id: "missing", label: "Missing Person", icon: Users, color: "text-warning", bg: "bg-warning/10" },
  { id: "domestic", label: "Domestic Issue", icon: Home, color: "text-primary", bg: "bg-primary/10" },
  { id: "fraud", label: "Fraud / Financial", icon: Briefcase, color: "text-destructive", bg: "bg-destructive/10" },
];

const templates = [
  {
    id: "theft",
    label: "Theft",
    icon: ShieldAlert,
    title: "Theft incident report",
    description:
      "On [date] at approximately [time], my [item description] was stolen from [location]. The item is valued at approximately ₹[amount]. I have / do not have CCTV footage and witnesses available.",
    category: "theft",
  },
  {
    id: "cyber",
    label: "Cyber Fraud",
    icon: Wifi,
    title: "Online financial fraud",
    description:
      "On [date], I received a call/message from [number/email] claiming to be from [bank/company]. I was deceived into sharing OTP / making a UPI transfer of ₹[amount] to account [details]. Transaction reference: [TXN ID].",
    category: "cyber",
  },
  {
    id: "harass",
    label: "Harassment",
    icon: AlertTriangle,
    title: "Harassment complaint",
    description:
      "I am being repeatedly harassed by [name/unknown person] at [location/online platform] since [date]. The harassment includes [verbal/physical/online messages]. I fear for my safety.",
    category: "domestic",
  },
];

// Lightweight keyword-based auto-categorization
const autoCategorize = (text: string): string | null => {
  const t = text.toLowerCase();
  if (/(steal|stolen|theft|robber|snatch|burgl)/.test(t)) return "theft";
  if (/(upi|otp|fraud|scam|phish|hack|cyber|account|bank)/.test(t)) return "cyber";
  if (/(vehicle|bike|car|accident|hit and run|traffic)/.test(t)) return "vehicle";
  if (/(missing|kidnap|abduct|disappear)/.test(t)) return "missing";
  if (/(domestic|harass|abuse|violence|stalk|threat)/.test(t)) return "domestic";
  if (/(cheat|forgery|ponzi|investment fraud|fake)/.test(t)) return "fraud";
  return null;
};

// Suggested IPC sections per category
const legalSuggestions: Record<string, { code: string; title: string; note: string }[]> = {
  theft: [
    { code: "IPC §378", title: "Theft", note: "Definition of theft of movable property." },
    { code: "IPC §379", title: "Punishment", note: "Up to 3 years imprisonment, or fine, or both." },
  ],
  cyber: [
    { code: "IT Act §66C", title: "Identity Theft", note: "Fraudulent use of password/electronic signature." },
    { code: "IT Act §66D", title: "Cheating by Personation", note: "Up to 3 years and ₹1L fine." },
  ],
  vehicle: [{ code: "MV Act §184", title: "Dangerous Driving", note: "Fine up to ₹5,000 or 6 months." }],
  missing: [{ code: "IPC §365", title: "Kidnapping", note: "If kidnapping is suspected, up to 7 years." }],
  domestic: [
    { code: "IPC §354", title: "Outraging Modesty", note: "1–5 years imprisonment." },
    { code: "IPC §509", title: "Insulting Modesty", note: "Word/gesture intended to insult." },
  ],
  fraud: [{ code: "IPC §420", title: "Cheating", note: "Up to 7 years and fine." }],
};

const Raise = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    files: [] as File[],
  });
  const [drag, setDrag] = useState(false);
  const [aiSuggested, setAiSuggested] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [receipt, setReceipt] = useState<null | { id: string; dept: string; sla: number; officer: string; ts: string }>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setForm({ ...form, files: [...form.files, ...Array.from(files)] });
  };

  const applyTemplate = (t: (typeof templates)[number]) => {
    setForm((f) => ({ ...f, title: t.title, description: t.description, category: t.category }));
    setAiSuggested(t.category);
    toast.success(`Template applied: ${t.label}`);
  };

  const handleDescChange = (val: string) => {
    setForm((f) => ({ ...f, description: val }));
    const detected = autoCategorize(val);
    if (detected && !form.category) {
      setAiSuggested(detected);
    }
  };

  const submit = () => {
    if (!consent) {
      toast.error("Please accept the privacy & truthfulness declaration");
      return;
    }
    const dept = getDepartment(form.category);
    const id = `SPC-2024-${Math.floor(900 + Math.random() * 99)}`;
    setReceipt({
      id,
      dept: dept.department,
      sla: dept.sla,
      officer: dept.officer,
      ts: new Date().toLocaleString(),
    });
    toast.success(`Complaint registered · ${id}`);
  };

  const downloadReceipt = () => {
    if (!receipt) return;
    const content = `SPCAES — OFFICIAL ACKNOWLEDGEMENT RECEIPT
=========================================
Complaint ID : ${receipt.id}
Filed On     : ${receipt.ts}
Title        : ${form.title}
Category     : ${categories.find((c) => c.id === form.category)?.label}
Location     : ${form.location}
Department   : ${receipt.dept}
Assigned To  : ${receipt.officer}
SLA Deadline : ${receipt.sla} hours
Status       : Submitted
=========================================
Keep this receipt for tracking and reference.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${receipt.id}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  const progress = (step / 4) * 100;
  const suggestions = form.category ? legalSuggestions[form.category] : null;
  const routedDept = form.category ? getDepartment(form.category) : null;

  if (receipt) {
    return (
      <div className="container py-10 max-w-2xl">
        <div className="rounded-2xl border-2 border-success/30 bg-card shadow-soft overflow-hidden animate-scale-in">
          <div className="p-6 bg-success/10 border-b border-success/20 text-center">
            <div className="h-14 w-14 rounded-full bg-success flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-7 w-7 text-success-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold">Complaint Acknowledged</h2>
            <p className="text-sm text-muted-foreground mt-1">
              An official receipt has been generated. Keep this ID for tracking.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-dashed border-border p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Complaint ID</div>
              <div className="font-display text-3xl font-bold text-primary mt-1">{receipt.id}</div>
              <div className="text-xs text-muted-foreground mt-1">Filed at {receipt.ts}</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> Routed to</div>
                <div className="font-medium mt-1">{receipt.dept}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> SLA Deadline</div>
                <div className="font-medium mt-1">{receipt.sla} hours</div>
              </div>
              <div className="rounded-lg border border-border p-3 sm:col-span-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Assigned Officer</div>
                <div className="font-medium mt-1">{receipt.officer}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="hero" onClick={downloadReceipt} className="flex-1">
                <Download className="h-4 w-4 mr-1" /> Download Receipt
              </Button>
              <Button variant="outline" onClick={() => navigate("/citizen/track")} className="flex-1">
                Track Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Raise a Complaint</h1>
          <p className="text-muted-foreground mt-2">Fill out the form below. It only takes 2-3 minutes.</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-3 ${
                    step >= s.n ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                      step > s.n
                        ? "gradient-primary text-primary-foreground shadow-soft"
                        : step === s.n
                        ? "border-2 border-primary bg-primary/10 text-primary"
                        : "border-2 border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {step > s.n ? <CheckCircle2 className="h-5 w-5" /> : s.n}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-medium">{s.label}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-border mx-2 sm:mx-4 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 gradient-primary transition-all duration-500"
                      style={{ width: step > s.n ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden sm:hidden">
            <div className="h-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft animate-scale-in" key={step}>
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Complaint details</h2>
                <p className="text-sm text-muted-foreground mt-1">Describe what happened in your own words.</p>
              </div>

              {/* Templates */}
              <div className="rounded-xl border border-border bg-accent/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick templates
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => applyTemplate(t)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <t.icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Complaint title *</Label>
                <Input
                  id="title"
                  className="mt-1.5"
                  placeholder="e.g. Two-wheeler stolen from market parking"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="desc">Description *</Label>
                <Textarea
                  id="desc"
                  className="mt-1.5 min-h-[140px]"
                  placeholder="Provide as much detail as possible: when, where, who was involved, what happened..."
                  value={form.description}
                  onChange={(e) => handleDescChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Include date, time and any witness information.
                </p>
                {aiSuggested && !form.category && (
                  <div className="mt-3 rounded-lg border border-secondary/30 bg-secondary/5 p-3 flex items-start gap-3 animate-fade-in">
                    <Zap className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">AI suggests category</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Based on your description, this looks like a{" "}
                        <span className="font-medium text-foreground">
                          {categories.find((c) => c.id === aiSuggested)?.label}
                        </span>{" "}
                        case.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="teal"
                      className="h-7 text-xs"
                      onClick={() => setForm({ ...form, category: aiSuggested })}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location of incident *</Label>
                <Input
                  id="location"
                  className="mt-1.5"
                  placeholder="Address, landmark or coordinates"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Choose a category</h2>
                <p className="text-sm text-muted-foreground mt-1">Helps us route to the right authority.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setForm({ ...form, category: c.id })}
                    className={`text-left rounded-xl border-2 p-4 transition-all hover:border-primary ${
                      form.category === c.id
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                      <c.icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                    <div className="font-medium text-sm">{c.label}</div>
                  </button>
                ))}
              </div>

              {suggestions && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Suggested legal sections
                    </span>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <div key={s.code} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                        <span className="text-xs font-mono font-semibold text-primary shrink-0 mt-0.5">{s.code}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Upload evidence</h2>
                <p className="text-sm text-muted-foreground mt-1">Photos, videos, documents — max 25MB each.</p>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  drag ? "border-primary bg-primary/5" : "border-border bg-muted/30"
                }`}
              >
                <Upload className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="font-medium">Drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, PDF, MP4</p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  Choose files
                </Button>
              </div>

              {form.files.length > 0 && (
                <div className="space-y-2">
                  {form.files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card animate-fade-in">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button
                        onClick={() => setForm({ ...form, files: form.files.filter((_, j) => j !== i) })}
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Review & submit</h2>
                <p className="text-sm text-muted-foreground mt-1">Make sure everything looks right.</p>
              </div>

              <div className="rounded-xl border border-border divide-y divide-border">
                {[
                  { k: "Title", v: form.title || "—" },
                  { k: "Category", v: categories.find((c) => c.id === form.category)?.label || "—" },
                  { k: "Location", v: form.location || "—" },
                  { k: "Description", v: form.description || "—" },
                  { k: "Files", v: `${form.files.length} attached` },
                ].map((row) => (
                  <div key={row.k} className="grid sm:grid-cols-3 gap-2 p-4">
                    <div className="text-xs uppercase text-muted-foreground tracking-wider">{row.k}</div>
                    <div className="sm:col-span-2 text-sm">{row.v}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  By submitting, you confirm that all information provided is true. False complaints are punishable by law.
                </p>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-between pt-8 mt-6 border-t border-border">
            <Button variant="ghost" onClick={prev} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 4 ? (
              <Button variant="hero" onClick={next}>
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="hero" onClick={submit}>
                Submit Complaint <CheckCircle2 className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
    </div>
  );
};

export default Raise;
