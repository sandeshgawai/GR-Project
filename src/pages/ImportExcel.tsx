import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Import,
} from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Badge, Modal, EmptyState } from "../components/ui";
import { PageHeader } from "../components/common";
import { CATEGORIES, DEPARTMENTS, type GR } from "../data";
import type { NavKey } from "../routes";

interface Row {
  number: string;
  date: string;
  department: string;
  subject: string;
  category: string;
  keywords: string;
  valid: boolean;
  duplicate: boolean;
  reason?: string;
}

// Normalise an arbitrary spreadsheet cell into an ISO date string.
function toISO(v: unknown): string {
  if (typeof v === "number") {
    const d = XLSX.SSF.parse_date_code(v);
    if (d) {
      const mm = String(d.m).padStart(2, "0");
      const dd = String(d.d).padStart(2, "0");
      return `${d.y}-${mm}-${dd}`;
    }
  }
  const s = String(v ?? "").trim();
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return s;
}

function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of Object.keys(obj)) {
    const norm = k.toLowerCase().replace(/[^a-z]/g, "");
    if (keys.some((want) => norm.includes(want)))
      return String(obj[k] ?? "").trim();
  }
  return "";
}

export default function ImportExcel({
  onNavigate,
}: {
  onNavigate: (k: NavKey) => void;
}) {
  const { grs, addMany, toast } = useStore();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const existing = new Set(grs.map((g) => g.number.toLowerCase()));

  function handleFile(file: File) {
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      toast("Please choose an .xlsx or .xls file.", "warning");
      return;
    }
    setFileName(file.name);
    setParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        const seenInFile = new Set<string>();
        const parsed: Row[] = json.map((r) => {
          const number = pick(r, ["grnumber", "number", "grno"]);
          const date = toISO(
            pick(r, ["date"]) || r["GR Date"] || r["Date"] || "",
          );
          const department = pick(r, ["department", "dept"]);
          const subject = pick(r, ["subject", "title"]);
          const category = pick(r, ["category"]);
          const keywords = pick(r, ["keyword", "tags"]);
          const key = number.toLowerCase();
          const duplicate =
            !!number && (existing.has(key) || seenInFile.has(key));
          if (number) seenInFile.add(key);
          const missing = !number || !date || !department || !subject;
          return {
            number,
            date,
            department,
            subject,
            category: category || "General",
            keywords,
            duplicate,
            valid: !missing && !duplicate,
            reason: missing
              ? "Missing required field"
              : duplicate
                ? "Duplicate GR number"
                : undefined,
          };
        });
        setRows(parsed);
        setParsing(false);
      } catch {
        setParsing(false);
        toast("Could not read the Excel file.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function downloadTemplate() {
    const ws = XLSX.utils.json_to_sheet([
      {
        "GR Number": "GR/REV/2026/900",
        "GR Date": "2026-08-15",
        Department: "Revenue Department",
        Subject: "Sample Resolution Subject",
        Category: "Revenue",
        Keywords: "Sample, Demo, Revenue",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GR Records");
    XLSX.writeFile(wb, "e-GR-Store-Import-Template.xlsx");
    toast("Template downloaded.");
  }

  function doImport() {
    if (!rows) return;
    const valid = rows.filter((r) => r.valid);
    const newGRs: GR[] = valid.map((r, i) => ({
      id: `${Date.now()}-${i}`,
      number: r.number,
      date: r.date,
      department: DEPARTMENTS.find((d) =>
        d.toLowerCase().includes(r.department.toLowerCase().split(" ")[0]),
      )
        ? r.department
        : r.department,
      category: CATEGORIES.includes(r.category) ? r.category : r.category,
      subject: r.subject,
      keywords: r.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      description: "Imported from Excel bulk upload.",
      status: "Active",
    }));
    addMany(newGRs);
    setConfirmOpen(false);
    toast(`${newGRs.length} GR records imported successfully.`);
    setRows(null);
    setFileName("");
    onNavigate("repository");
  }

  const validCount = rows?.filter((r) => r.valid).length ?? 0;
  const dupCount = rows?.filter((r) => r.duplicate).length ?? 0;
  const invalidCount =
    (rows?.length ?? 0) - validCount - dupCount;

  return (
    <div className="animate-in">
      <PageHeader
        title="Import GR Records from Excel"
        subtitle="Upload an Excel file to import multiple Government Resolution records at once."
        actions={
          <Button variant="outline" onClick={downloadTemplate}>
            <Download size={16} /> Download Excel Template
          </Button>
        }
      />

      {!rows ? (
        <Card className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
              dragOver
                ? "border-accent bg-accent-soft/50"
                : "border-border bg-muted/40"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <UploadCloud size={26} />
            </div>
            <p className="font-display text-lg font-bold text-foreground">
              {parsing ? "Reading file…" : "Drag & Drop Excel file here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click below to browse — supported formats:{" "}
              <span className="font-mono">.xlsx, .xls</span>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <Button className="mt-2" onClick={() => inputRef.current?.click()}>
              <FileSpreadsheet size={16} /> Choose Excel File
            </Button>
          </div>

          <div className="mt-5 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Expected columns</p>
            <p className="mt-1 font-mono text-xs">
              GR Number · GR Date · Department · Subject · Category · Keywords
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              tone="neutral"
              label="Total Records"
              value={rows.length}
              icon={<FileSpreadsheet size={18} />}
            />
            <SummaryCard
              tone="success"
              label="Valid Records"
              value={validCount}
              icon={<CheckCircle2 size={18} />}
            />
            <SummaryCard
              tone="warning"
              label="Duplicate / Invalid"
              value={dupCount + invalidCount}
              icon={<AlertTriangle size={18} />}
            />
          </div>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-accent" />
                <span className="text-sm font-semibold">{fileName}</span>
                <Badge tone="success">
                  <CheckCircle2 size={11} /> {validCount} Valid
                </Badge>
                {dupCount > 0 && (
                  <Badge tone="warning">
                    <AlertTriangle size={11} /> {dupCount} Duplicate
                  </Badge>
                )}
              </div>
              <button
                onClick={() => {
                  setRows(null);
                  setFileName("");
                }}
                className="text-sm font-semibold text-muted-foreground hover:text-navy"
              >
                Choose another file
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<FileSpreadsheet size={36} />}
                  title="No rows found in the file"
                  hint="Make sure the first sheet contains data rows with headers."
                />
              </div>
            ) : (
              <div className="scroll-area max-h-[420px] overflow-auto">
                <table className="w-full min-w-[860px] border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-border bg-muted text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">GR Number</th>
                      <th className="px-4 py-3 font-semibold">GR Date</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Subject</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Keywords</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((r, i) => (
                      <tr
                        key={i}
                        className={
                          r.valid ? "" : "bg-warning-soft/30"
                        }
                      >
                        <td className="px-4 py-3">
                          {r.valid ? (
                            <Badge tone="success">
                              <CheckCircle2 size={11} /> Valid
                            </Badge>
                          ) : (
                            <Badge tone="warning" >
                              <AlertTriangle size={11} /> {r.reason}
                            </Badge>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-semibold text-navy">
                          {r.number || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {r.date || "—"}
                        </td>
                        <td className="px-4 py-3">{r.department || "—"}</td>
                        <td className="max-w-[220px] truncate px-4 py-3">
                          {r.subject || "—"}
                        </td>
                        <td className="px-4 py-3">{r.category || "—"}</td>
                        <td className="max-w-[160px] truncate px-4 py-3 text-muted-foreground">
                          {r.keywords || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRows(null);
                setFileName("");
              }}
            >
              <X size={16} /> Cancel
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={validCount === 0}
            >
              <Import size={16} /> Import Valid Records ({validCount})
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Import"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={doImport}>
              <Import size={16} /> Import {validCount} Records
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          You are about to import{" "}
          <span className="font-semibold">{validCount} valid records</span> into
          the repository.
        </p>
        {dupCount + invalidCount > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {dupCount + invalidCount} duplicate or invalid record
            {dupCount + invalidCount === 1 ? "" : "s"} will be skipped.
          </p>
        )}
      </Modal>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "neutral" | "success" | "warning";
}) {
  const tones = {
    neutral: "bg-accent-soft text-accent",
    success: "bg-success-soft text-[color:var(--color-success)]",
    warning: "bg-warning-soft text-[color:var(--color-warning)]",
  };
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-extrabold text-navy">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
