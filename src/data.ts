export type GRStatus = "Active" | "Archived" | "Draft";

export interface GR {
  id: string;
  number: string;
  date: string; // ISO yyyy-mm-dd
  department: string;
  category: string;
  subject: string;
  keywords: string[];
  description: string;
  status: GRStatus;
  important?: boolean;
}

export const DEPARTMENTS = [
  "Revenue Department",
  "Urban Development Department",
  "Finance Department",
  "General Administration",
  "Rural Development",
  "Public Works Department",
  "Education Department",
  "Health Department",
];

export const CATEGORIES = [
  "Revenue",
  "UDD",
  "Finance",
  "Administration",
  "Development",
  "Infrastructure",
  "Education",
  "Health",
];

export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateLong(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// No demo data — the store starts empty and is populated from the database
// (or by adding / importing GRs).
export const SEED_GRS: GR[] = [];
