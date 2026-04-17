import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { toast } from "sonner";

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

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setForm({ ...form, files: [...form.files, ...Array.from(files)] });
  };

  const submit = () => {
    toast.success("Complaint submitted! ID: SPC-2024-0893");
    setTimeout(() => navigate("/track"), 800);
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Include date, time and any witness information.
                </p>
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
    </div>
  );
};

export default Raise;
