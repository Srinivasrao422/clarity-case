// Lightweight client-side "AI" helpers — keyword based.
// These run instantly and require no backend.

export type Priority = "Low" | "Medium" | "High";

const HIGH_KEYWORDS = [
  "weapon", "gun", "knife", "blood", "injur", "kidnap", "abduct", "missing child",
  "rape", "assault", "threat to kill", "ransom", "minor", "acid", "fire",
  "unconscious", "bleeding", "emergency", "life threat",
];
const MEDIUM_KEYWORDS = [
  "stolen", "theft", "fraud", "scam", "harass", "stalk", "phish", "otp",
  "upi", "cheated", "missing", "broke into", "burgl",
];

// Detect priority from free-text description.
export const detectPriority = (text: string): Priority => {
  const t = text.toLowerCase();
  if (HIGH_KEYWORDS.some((k) => t.includes(k))) return "High";
  if (MEDIUM_KEYWORDS.some((k) => t.includes(k))) return "Medium";
  return "Low";
};

// Mock recent complaints used for duplicate detection demo.
export interface KnownComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
}

export const RECENT_COMPLAINTS: KnownComplaint[] = [
  {
    id: "SPC-2024-0892",
    title: "Mobile phone stolen near MG Road metro",
    description: "iPhone snatched from pocket while exiting metro station around 8pm",
    category: "theft",
    location: "MG Road",
  },
  {
    id: "SPC-2024-0891",
    title: "UPI fraud — fake KYC call",
    description: "Caller posing as bank tricked me into sharing OTP, ₹45,000 debited",
    category: "cyber",
    location: "Indira Nagar",
  },
  {
    id: "SPC-2024-0888",
    title: "Two-wheeler stolen from market parking",
    description: "Honda Activa stolen from BTM market parking area on Saturday",
    category: "theft",
    location: "BTM Layout",
  },
];

// Simple Jaccard similarity over word sets.
const tokenize = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

const similarity = (a: string, b: string): number => {
  const A = tokenize(a);
  const B = tokenize(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  A.forEach((w) => {
    if (B.has(w)) inter++;
  });
  const union = new Set([...A, ...B]).size;
  return inter / union;
};

export interface DuplicateMatch {
  complaint: KnownComplaint;
  score: number;
}

export const findDuplicates = (
  title: string,
  description: string,
  category: string,
  threshold = 0.18
): DuplicateMatch[] => {
  const text = `${title} ${description}`;
  return RECENT_COMPLAINTS.filter((c) => !category || c.category === category)
    .map((c) => ({
      complaint: c,
      score: similarity(text, `${c.title} ${c.description}`),
    }))
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

// Mask Aadhaar / Voter ID — keep last 4 chars visible.
export const maskId = (raw: string): string => {
  const clean = raw.replace(/\s+/g, "");
  if (clean.length <= 4) return clean;
  return "X".repeat(clean.length - 4) + clean.slice(-4);
};
