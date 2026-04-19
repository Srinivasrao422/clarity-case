import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  UserCircle2,
  UserPlus,
  UserMinus,
  Phone,
  Mic,
  MicOff,
  Camera,
  Copy,
  BadgeCheck,
  Gavel,
  FileSignature,
  MapPin,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getDepartment } from "@/lib/departments";
import { getLegalSections, LEGAL_DISCLAIMER } from "@/lib/legal";
import { detectPriority, findDuplicates, maskId, type Priority } from "@/lib/smart";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useI18n, type Lang } from "@/lib/i18n";
import { generateFIRDraft, type FIRData } from "@/lib/firPdf";
import { SignaturePad } from "@/components/SignaturePad";
import { SeverityBadge } from "@/components/SeverityBadge";
import { EditWindowTimer } from "@/components/EditWindowTimer";

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

const ID_TYPES = ["Aadhaar", "Voter ID", "PAN", "Driving Licence", "Passport"];

const langToSpeechCode: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
};

interface AccusedEntry {
  name: string;
  contact: string;
  address: string;
  relation: string;
}

interface WitnessEntry {
  name: string;
  contact: string;
  statement: string;
}

type EvidenceTag = "Image" | "Video" | "Document";

interface TaggedFile {
  file: File;
  tag: EvidenceTag;
}

const guessTag = (f: File): EvidenceTag => {
  if (f.type.startsWith("image/")) return "Image";
  if (f.type.startsWith("video/")) return "Video";
  return "Document";
};

const DRAFT_KEY = "spcaes.draft.v1";
const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const Raise = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [step, setStep] = useState(1);

  // Identity / victim
  const [victim, setVictim] = useState({
    fullName: "",
    mobile: "",
    address: "",
    idType: "Aadhaar",
    idNumber: "",
    photoName: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Incident
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    files: [] as TaggedFile[],
  });
  const [drag, setDrag] = useState(false);
  const [aiSuggested, setAiSuggested] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Parties
  const [accused, setAccused] = useState<AccusedEntry[]>([
    { name: "", contact: "", address: "", relation: "" },
  ]);
  const [witnesses, setWitnesses] = useState<WitnessEntry[]>([]);

  const [consent, setConsent] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [createdAt] = useState(() => new Date().toISOString());
  const [receipt, setReceipt] = useState<null | {
    id: string;
    dept: string;
    sla: number;
    officer: string;
    ts: string;
    tsEpoch: number;
    priority: Priority;
  }>(null);

  const priority: Priority = useMemo(
    () => detectPriority(`${form.title} ${form.description}`),
    [form.title, form.description]
  );

  const duplicates = useMemo(
    () =>
      form.title || form.description
        ? findDuplicates(form.title, form.description, form.category)
        : [],
    [form.title, form.description, form.category]
  );

  const { listening, supported: speechSupported, start: startMic, stop: stopMic } =
    useSpeechToText(
      (text) => setForm((f) => ({ ...f, description: f.description ? `${f.description} ${text}` : text })),
      langToSpeechCode[lang]
    );

  const STEPS = [
    { n: 1, label: t("raise.step.identity"), icon: UserCircle2 },
    { n: 2, label: t("raise.step.details"), icon: FileText },
    { n: 3, label: t("raise.step.parties"), icon: Users },
    { n: 4, label: t("raise.step.category"), icon: Tag },
    { n: 5, label: t("raise.step.evidence"), icon: Upload },
    { n: 6, label: t("raise.step.review"), icon: CheckCircle2 },
  ];

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const tagged: TaggedFile[] = Array.from(files).map((f) => ({ file: f, tag: guessTag(f) }));
    setForm({ ...form, files: [...form.files, ...tagged] });
  };

  const setFileTag = (i: number, tag: EvidenceTag) =>
    setForm((f) => ({ ...f, files: f.files.map((tf, idx) => (idx === i ? { ...tf, tag } : tf)) }));

  const handlePhoto = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      toast.error("Photo must be JPG, PNG or WebP");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Photo must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setVictim((v) => ({ ...v, photoName: file.name }));
    toast.success("Photo uploaded");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({
          ...f,
          location: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
        }));
        setLocating(false);
        toast.success("Location captured — you can edit it manually");
      },
      () => {
        setLocating(false);
        toast.error("Unable to capture location");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const saveDraft = () => {
    const data = {
      victim: { ...victim },
      form: { ...form, files: [] }, // skip File objects
      accused,
      witnesses,
      step,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      toast.success("Draft saved locally");
    } catch {
      toast.error("Unable to save draft");
    }
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) {
        toast.info("No saved draft found");
        return;
      }
      const d = JSON.parse(raw);
      if (d.victim) setVictim(d.victim);
      if (d.form) setForm({ ...d.form, files: [] });
      if (d.accused) setAccused(d.accused);
      if (d.witnesses) setWitnesses(d.witnesses);
      if (d.step) setStep(d.step);
      toast.success(`Draft restored (saved ${new Date(d.savedAt).toLocaleString()})`);
    } catch {
      toast.error("Unable to load draft");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    toast.success("Draft cleared");
  };

  const hasDraft = typeof window !== "undefined" && !!localStorage.getItem(DRAFT_KEY);

  const applyTemplate = (tpl: (typeof templates)[number]) => {
    setForm((f) => ({ ...f, title: tpl.title, description: tpl.description, category: tpl.category }));
    setAiSuggested(tpl.category);
    toast.success(`Template applied: ${tpl.label}`);
  };

  const handleDescChange = (val: string) => {
    setForm((f) => ({ ...f, description: val }));
    const detected = autoCategorize(val);
    if (detected && !form.category) setAiSuggested(detected);
  };

  // Mock OTP flow — generates a random 6-digit code and pre-fills it (demo)
  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(victim.mobile)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setOtpSent(true);
    setOtpCode("");
    toast.success(`OTP sent to ${victim.mobile} (demo: use 1 2 3 4 5 6)`);
  };
  const verifyOtp = () => {
    if (otpCode === "123456") {
      setOtpVerified(true);
      toast.success("Mobile verified ✓");
    } else {
      toast.error("Invalid OTP — demo code is 123456");
    }
  };

  const updateAccused = (i: number, patch: Partial<AccusedEntry>) =>
    setAccused((a) => a.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addAccused = () =>
    setAccused((a) => [...a, { name: "", contact: "", address: "", relation: "" }]);
  const removeAccused = (i: number) => setAccused((a) => a.filter((_, idx) => idx !== i));

  const updateWitness = (i: number, patch: Partial<WitnessEntry>) =>
    setWitnesses((w) => w.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addWitness = () =>
    setWitnesses((w) => [...w, { name: "", contact: "", statement: "" }]);
  const removeWitness = (i: number) => setWitnesses((w) => w.filter((_, idx) => idx !== i));

  const submit = () => {
    if (!consent) {
      toast.error("Please accept the privacy & truthfulness declaration");
      return;
    }
    const dept = getDepartment(form.category);
    const id = `SPC-2024-${Math.floor(900 + Math.random() * 99)}`;
    const nowD = new Date();
    setReceipt({
      id,
      dept: dept.department,
      sla: dept.sla,
      officer: dept.officer,
      ts: nowD.toLocaleString(),
      tsEpoch: nowD.getTime(),
      priority,
    });
    // Clear the saved draft once submitted
    localStorage.removeItem(DRAFT_KEY);
    toast.success(`Complaint registered · ${id}`);
  };

  const downloadReceipt = () => {
    if (!receipt) return;
    const sections = getLegalSections(form.category);
    const content = `SPCAES — OFFICIAL ACKNOWLEDGEMENT RECEIPT
=========================================
Complaint ID : ${receipt.id}
Filed On     : ${receipt.ts}
Title        : ${form.title}
Category     : ${categories.find((c) => c.id === form.category)?.label}
Location     : ${form.location}
Priority     : ${receipt.priority}
Department   : ${receipt.dept}
Assigned To  : ${receipt.officer}
SLA Deadline : ${receipt.sla} hours
Status       : Submitted
-----------------------------------------
COMPLAINANT
Name   : ${victim.fullName}
Mobile : ${victim.mobile}${otpVerified ? " (Verified)" : ""}
ID     : ${victim.idType} — ${maskId(victim.idNumber)}
-----------------------------------------
APPLICABLE SECTIONS (Indicative)
${sections.map((s) => `• ${s.code} — ${s.title} | ${s.punishment}`).join("\n") || "—"}
=========================================
${LEGAL_DISCLAIMER}
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

  const downloadFIRPdf = () => {
    if (!receipt) return;
    const data: FIRData = {
      complaintId: receipt.id,
      filedAt: receipt.ts,
      title: form.title,
      description: form.description,
      category: form.category,
      categoryLabel: categories.find((c) => c.id === form.category)?.label || "—",
      location: form.location,
      department: receipt.dept,
      officer: receipt.officer,
      slaHours: receipt.sla,
      priority: receipt.priority,
      victim: {
        fullName: victim.fullName,
        mobile: victim.mobile + (otpVerified ? " ✓" : ""),
        address: victim.address,
        idType: victim.idType,
        idMasked: maskId(victim.idNumber),
      },
      accused: accused.filter((a) => a.name.trim()),
      witnesses: witnesses.filter((w) => w.name.trim()),
      legalSections: getLegalSections(form.category),
    };
    const doc = generateFIRDraft(data);
    doc.save(`${receipt.id}-FIR-draft.pdf`);
    toast.success("FIR draft generated");
  };

  const progress = (step / STEPS.length) * 100;
  const sections = form.category ? getLegalSections(form.category) : [];
  const routedDept = form.category ? getDepartment(form.category) : null;

  // ============================================================
  // RECEIPT VIEW
  // ============================================================
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
              <div className="font-display text-3xl font-bold text-primary mt-1 flex items-center justify-center gap-2">
                {receipt.id}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(receipt.id);
                    toast.success("Copied");
                  }}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Copy ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
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
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Officer</div>
                <div className="font-medium mt-1">{receipt.officer}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Priority</div>
                <div className={`font-medium mt-1 ${
                  receipt.priority === "High" ? "text-destructive" :
                  receipt.priority === "Medium" ? "text-warning" : "text-muted-foreground"
                }`}>{receipt.priority}</div>
              </div>
            </div>

            <SeverityBadge priority={receipt.priority} className="mx-auto" />

            <EditWindowTimer
              startedAt={receipt.tsEpoch}
              windowMinutes={15}
              onEdit={() => setReceipt(null)}
            />

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="hero" onClick={downloadFIRPdf} className="flex-1">
                <FileSignature className="h-4 w-4 mr-1" /> {t("raise.firDraft")}
              </Button>
              <Button variant="outline" onClick={downloadReceipt} className="flex-1">
                <Download className="h-4 w-4 mr-1" /> {t("raise.summaryReceipt")}
              </Button>
            </div>
            <Button variant="ghost" onClick={() => navigate("/citizen/track")} className="w-full">
              Track Status →
            </Button>
            <p className="text-[11px] text-muted-foreground italic text-center pt-2">
              {LEGAL_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // FORM
  // ============================================================
  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{t("raise.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("raise.subtitle")}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Started at {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasDraft && (
            <Button variant="outline" size="sm" onClick={loadDraft}>
              Restore draft
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={saveDraft}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save draft
          </Button>
          {hasDraft && (
            <Button variant="ghost" size="sm" onClick={clearDraft} aria-label="Clear draft">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 min-w-0">
              <div className={`flex items-center gap-2 ${step >= s.n ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-medium text-sm transition-all shrink-0 ${
                  step > s.n
                    ? "gradient-primary text-primary-foreground shadow-soft"
                    : step === s.n
                    ? "border-2 border-primary bg-primary/10 text-primary"
                    : "border-2 border-border bg-card text-muted-foreground"
                }`}>
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-medium whitespace-nowrap">{s.label}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mx-2 relative overflow-hidden min-w-[12px]">
                  <div className="absolute inset-y-0 left-0 gradient-primary transition-all duration-500"
                    style={{ width: step > s.n ? "100%" : "0%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden md:hidden">
          <div className="h-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft animate-scale-in" key={step}>

        {/* STEP 1 — IDENTITY (Victim + OTP) */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" /> {t("raise.victim")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Verify your mobile via OTP. ID number is masked for privacy.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("raise.fullName")} *</Label>
                <Input className="mt-1.5" value={victim.fullName}
                  onChange={(e) => setVictim({ ...victim, fullName: e.target.value })}
                  placeholder="As per government ID" />
              </div>

              <div>
                <Label>{t("raise.mobile")} *</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={victim.mobile} maxLength={10}
                    onChange={(e) => { setVictim({ ...victim, mobile: e.target.value.replace(/\D/g, "") }); setOtpSent(false); setOtpVerified(false); }}
                    placeholder="10-digit number" />
                  {!otpVerified && (
                    <Button variant="outline" onClick={sendOtp} disabled={otpSent && !!otpCode}>
                      <Phone className="h-3.5 w-3.5 mr-1" /> {t("raise.send")}
                    </Button>
                  )}
                  {otpVerified && (
                    <span className="inline-flex items-center gap-1 px-3 rounded-md bg-success/10 text-success text-xs font-medium border border-success/20">
                      <BadgeCheck className="h-3.5 w-3.5" /> {t("raise.verified")}
                    </span>
                  )}
                </div>
                {otpSent && !otpVerified && (
                  <div className="flex gap-2 mt-2 animate-fade-in">
                    <Input value={otpCode} maxLength={6} placeholder="Enter 6-digit OTP"
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} />
                    <Button variant="hero" onClick={verifyOtp}>Verify</Button>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label>{t("raise.address")} *</Label>
                <Textarea className="mt-1.5 min-h-[70px]" value={victim.address}
                  onChange={(e) => setVictim({ ...victim, address: e.target.value })}
                  placeholder="House no, street, city, state, PIN" />
              </div>

              <div>
                <Label>{t("raise.idType")} *</Label>
                <Select value={victim.idType} onValueChange={(v) => setVictim({ ...victim, idType: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("raise.idNumber")} *</Label>
                <Input className="mt-1.5 font-mono" value={victim.idNumber}
                  onChange={(e) => setVictim({ ...victim, idNumber: e.target.value })}
                  placeholder="Numbers / characters" />
                {victim.idNumber && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Stored as: <span className="font-mono">{maskId(victim.idNumber)}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label>
                  {t("raise.photo")} <span className="text-muted-foreground text-xs">(passport-size, max 2 MB)</span>
                </Label>
                <div className="mt-1.5 flex items-start gap-3">
                  {photoPreview ? (
                    <div className="relative shrink-0">
                      <img
                        src={photoPreview}
                        alt="Victim preview"
                        className="h-24 w-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => { setPhotoPreview(null); setVictim({ ...victim, photoName: "" }); }}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-24 w-20 rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center shrink-0">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground flex-1 truncate">
                      {victim.photoName || "Click to upload (JPG, PNG, WebP — max 2 MB)"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handlePhoto(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Verification status indicator */}
            <div
              className={`rounded-lg border p-3 flex items-center gap-2 ${
                otpVerified
                  ? "border-success/30 bg-success/5"
                  : "border-warning/30 bg-warning/5"
              }`}
            >
              {otpVerified ? (
                <>
                  <BadgeCheck className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Identity Verified</span>
                  <span className="text-xs text-muted-foreground ml-auto">Mobile + ID confirmed</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">Not Verified</span>
                  <span className="text-xs text-muted-foreground ml-auto">Complete OTP to verify</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 — INCIDENT DETAILS */}
        {step === 2 && (
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
                {templates.map((tpl) => (
                  <button key={tpl.id} onClick={() => applyTemplate(tpl)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left">
                    <tpl.icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Complaint title *</Label>
              <Input id="title" className="mt-1.5"
                placeholder="e.g. Two-wheeler stolen from market parking"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="desc">Description *</Label>
                {speechSupported && (
                  <Button type="button" size="sm" variant={listening ? "destructive" : "outline"}
                    className="h-7 text-xs" onClick={listening ? stopMic : startMic}>
                    {listening ? <><MicOff className="h-3 w-3 mr-1" /> Stop</> : <><Mic className="h-3 w-3 mr-1" /> Voice</>}
                  </Button>
                )}
              </div>
              <Textarea id="desc" className="mt-1.5 min-h-[140px]"
                placeholder="Provide as much detail as possible: when, where, who was involved, what happened..."
                value={form.description} onChange={(e) => handleDescChange(e.target.value)} />
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="text-muted-foreground">Tip: include date, time, witnesses.</span>
                {form.description.length > 30 && (
                  <span className={`px-2 py-0.5 rounded-md font-medium border ${
                    priority === "High" ? "bg-destructive/10 text-destructive border-destructive/20" :
                    priority === "Medium" ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-muted text-muted-foreground border-border"
                  }`}>
                    AI Priority: {priority}
                  </span>
                )}
              </div>

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
                  <Button size="sm" variant="teal" className="h-7 text-xs"
                    onClick={() => setForm({ ...form, category: aiSuggested })}>Apply</Button>
                </div>
              )}

              {duplicates.length > 0 && (
                <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-3 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Possible duplicate complaint(s) detected</span>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {duplicates.map((d) => (
                      <li key={d.complaint.id} className="flex items-center justify-between gap-2">
                        <span><span className="font-mono text-foreground">{d.complaint.id}</span> · {d.complaint.title}</span>
                        <span className="font-medium">{Math.round(d.score * 100)}% match</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-muted-foreground mt-2 italic">
                    You can still proceed — the officer will reconcile if needed.
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location of incident *</Label>
              <Input id="location" className="mt-1.5"
                placeholder="Address, landmark or coordinates"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
        )}

        {/* STEP 3 — PARTIES (Accused + Witnesses) */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Parties involved</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add accused person(s) and witnesses. All fields are optional but improve case quality.
              </p>
            </div>

            {/* Accused */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("raise.accused")}
                </h3>
                <Button size="sm" variant="outline" onClick={addAccused}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> {t("raise.addAccused")}
                </Button>
              </div>
              {accused.map((a, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Accused {i + 1}</span>
                    {accused.length > 1 && (
                      <button onClick={() => removeAccused(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                        <UserMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Name" value={a.name} onChange={(e) => updateAccused(i, { name: e.target.value })} />
                    <Input placeholder={`Contact (${t("common.optional")})`} value={a.contact} onChange={(e) => updateAccused(i, { contact: e.target.value })} />
                    <Input placeholder="Address" value={a.address} onChange={(e) => updateAccused(i, { address: e.target.value })} />
                    <Input placeholder="Relation to case (e.g. neighbour, unknown)" value={a.relation} onChange={(e) => updateAccused(i, { relation: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>

            {/* Witnesses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("raise.witness")}
                </h3>
                <Button size="sm" variant="outline" onClick={addWitness}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> {t("raise.addWitness")}
                </Button>
              </div>
              {witnesses.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No witnesses added yet.
                </div>
              )}
              {witnesses.map((w, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Witness {i + 1}</span>
                    <button onClick={() => removeWitness(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Name" value={w.name} onChange={(e) => updateWitness(i, { name: e.target.value })} />
                    <Input placeholder="Contact" value={w.contact} onChange={(e) => updateWitness(i, { contact: e.target.value })} />
                  </div>
                  <Textarea placeholder="Statement (what they witnessed)" value={w.statement}
                    onChange={(e) => updateWitness(i, { statement: e.target.value })} className="min-h-[60px]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — CATEGORY + LEGAL */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Choose a category</h2>
              <p className="text-sm text-muted-foreground mt-1">Helps us route to the right authority.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c) => (
                <button key={c.id} onClick={() => setForm({ ...form, category: c.id })}
                  className={`text-left rounded-xl border-2 p-4 transition-all hover:border-primary ${
                    form.category === c.id ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                  }`}>
                  <div className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <div className="font-medium text-sm">{c.label}</div>
                </button>
              ))}
            </div>

            {sections.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Gavel className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Applicable legal sections
                  </span>
                </div>
                <div className="space-y-2">
                  {sections.map((s) => (
                    <div key={s.code} className="rounded-lg bg-card border border-border p-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-mono font-semibold text-primary shrink-0 mt-0.5">{s.code}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{s.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{s.explanation}</div>
                          <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                              ⚖ {s.punishment}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-warning/10 text-warning font-medium">
                              ₹ {s.fine}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground italic mt-3">{LEGAL_DISCLAIMER}</p>
              </div>
            )}

            {routedDept && (
              <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 flex items-start gap-3 animate-fade-in">
                <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Auto-routed to department
                  </div>
                  <div className="text-sm font-medium mt-0.5">{routedDept.department}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Default SLA: {routedDept.sla}h · Likely officer: {routedDept.officer}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — EVIDENCE */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Upload evidence</h2>
              <p className="text-sm text-muted-foreground mt-1">Photos, videos, documents — max 25MB each.</p>
            </div>

            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
              className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                drag ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              }`}>
              <Upload className="h-10 w-10 mx-auto text-primary mb-3" />
              <p className="font-medium">Drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, PDF, MP4</p>
              <input id="file-input" type="file" multiple className="hidden"
                onChange={(e) => handleFiles(e.target.files)} />
              <Button variant="outline" className="mt-4"
                onClick={() => document.getElementById("file-input")?.click()}>
                Choose files
              </Button>
            </div>

            {form.files.length > 0 && (
              <div className="space-y-2">
                {form.files.map((tf, i) => {
                  const TagIcon = tf.tag === "Image" ? ImageIcon : tf.tag === "Video" ? Video : FileIcon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card animate-fade-in">
                      <TagIcon className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{tf.file.name}</div>
                        <div className="text-xs text-muted-foreground">{(tf.file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <Select value={tf.tag} onValueChange={(v) => setFileTag(i, v as EvidenceTag)}>
                        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Image">Image</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                      <button onClick={() => setForm({ ...form, files: form.files.filter((_, j) => j !== i) })}
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 6 — REVIEW & SUMMARY */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Pre-submission summary</h2>
              <p className="text-sm text-muted-foreground mt-1">Review carefully before submitting.</p>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border">
              {[
                { k: "Complainant", v: `${victim.fullName || "—"} · ${victim.mobile}${otpVerified ? " ✓" : ""}` },
                { k: "ID", v: victim.idNumber ? `${victim.idType}: ${maskId(victim.idNumber)}` : "—" },
                { k: "Title", v: form.title || "—" },
                { k: "Category", v: categories.find((c) => c.id === form.category)?.label || "—" },
                { k: "Priority", v: priority },
                { k: "Location", v: form.location || "—" },
                { k: "Description", v: form.description || "—" },
                { k: "Accused", v: accused.filter((a) => a.name.trim()).map((a) => a.name).join(", ") || "—" },
                { k: "Witnesses", v: witnesses.filter((w) => w.name.trim()).map((w) => w.name).join(", ") || "—" },
                { k: "Files", v: `${form.files.length} attached` },
              ].map((row) => (
                <div key={row.k} className="grid sm:grid-cols-3 gap-2 p-4">
                  <div className="text-xs uppercase text-muted-foreground tracking-wider">{row.k}</div>
                  <div className="sm:col-span-2 text-sm whitespace-pre-wrap">{row.v}</div>
                </div>
              ))}
            </div>

            {routedDept && (
              <div className="rounded-xl border border-border bg-accent/30 p-4 grid sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider">Department</div>
                  <div className="font-medium text-sm mt-0.5">{routedDept.department}</div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider">SLA</div>
                  <div className="font-medium text-sm mt-0.5">{routedDept.sla} hours</div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider">Officer</div>
                  <div className="font-medium text-sm mt-0.5">{routedDept.officer}</div>
                </div>
              </div>
            )}

            {sections.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" /> Likely sections to be invoked
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sections.map((s) => (
                    <span key={s.code} className="text-xs px-2 py-1 rounded-md bg-card border border-border font-mono">
                      {s.code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                By submitting, you confirm that all information provided is true. False complaints are punishable by law.
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card cursor-pointer hover:bg-accent/30 transition-colors">
              <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Privacy & Truthfulness Declaration</div>
                <p className="text-xs text-muted-foreground mt-1">
                  I consent to SPCAES processing my data for complaint resolution under the IT Act, 2000 and confirm the information is true to the best of my knowledge.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-between pt-8 mt-6 border-t border-border">
          <Button variant="ghost" onClick={prev} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("raise.back")}
          </Button>
          {step < STEPS.length ? (
            <Button variant="hero" onClick={next}>
              {t("raise.continue")} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" onClick={submit}>
              {t("raise.submit")} <CheckCircle2 className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Raise;
