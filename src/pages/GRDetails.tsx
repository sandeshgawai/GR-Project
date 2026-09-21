import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Star,
  Building2,
  CalendarDays,
  Tag,
  Hash,
  X,
} from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Badge } from "../components/ui";
import { StatusBadge } from "../components/common";
import { fmtDateLong } from "../data";
import { downloadGRPdf } from "../pdf";

export default function GRDetails({
  id,
  onBack,
}: {
  id: string;
  onBack: () => void;
}) {
  const { grs, toggleImportant, toast } = useStore();
  const gr = grs.find((g) => g.id === id);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (!viewerOpen) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setViewerOpen(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [viewerOpen]);

  if (!gr) {
    return (
      <div className="animate-in">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <p className="mt-6 text-muted-foreground">Resolution not found.</p>
      </div>
    );
  }

  const meta = [
    { icon: Hash, label: "GR Number", value: gr.number, mono: true },
    { icon: CalendarDays, label: "GR Date", value: fmtDateLong(gr.date) },
    { icon: Building2, label: "Department", value: gr.department },
    { icon: Tag, label: "Category", value: gr.category },
  ];

  return (
    <div className="animate-in">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft size={16} /> Back to repository
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Details */}
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <StatusBadge status={gr.status} />
                  {gr.important && (
                    <Badge tone="warning">
                      <Star size={11} className="fill-current" /> Important
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-2xl font-extrabold leading-snug tracking-tight text-foreground">
                  {gr.subject}
                </h1>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <m.icon size={15} />
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      {m.label}
                    </dt>
                    <dd
                      className={`mt-0.5 font-semibold text-foreground ${
                        m.mono ? "font-mono text-sm" : "text-[15px]"
                      }`}
                    >
                      {m.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                Keywords
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {gr.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground">
                {gr.description}
              </p>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setViewerOpen(true)}>
              <FileText size={16} /> View PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => { downloadGRPdf(gr); toast(`Downloaded ${gr.number}.pdf`); }}
            >
              <Download size={16} /> Download PDF
            </Button>
            <Button
              variant={gr.important ? "subtle" : "outline"}
              onClick={() => {
                toggleImportant(gr.id);
                toast(
                  gr.important
                    ? "Removed from Important GRs"
                    : "Added to Important GRs",
                  gr.important ? "info" : "success",
                );
              }}
            >
              <Star
                size={16}
                className={gr.important ? "fill-current" : ""}
              />
              {gr.important ? "Remove from Important" : "Add to Important"}
            </Button>
          </div>
        </div>

        {/* PDF preview */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText size={15} /> Document Preview
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">
              {gr.number}.pdf
            </span>
          </div>
          <div className="scroll-area max-h-[640px] overflow-y-auto bg-[#5c6b80] p-5">
            <DocumentPage gr={gr} />
          </div>
        </Card>
      </div>

      {/* Full-screen PDF viewer */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy/70 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <FileText size={16} /> {gr.number}.pdf
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="subtle"
                onClick={() => { downloadGRPdf(gr); toast(`Downloaded ${gr.number}.pdf`); }}
              >
                <Download size={15} /> Download
              </Button>
              <button
                onClick={() => setViewerOpen(false)}
                className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close viewer"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div
            className="scroll-area flex-1 overflow-y-auto p-6"
            onClick={() => setViewerOpen(false)}
          >
            <div
              className="mx-auto w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentPage gr={gr} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentPage({ gr }: { gr: import("../data").GR }) {
  return (
    <div className="mx-auto aspect-[1/1.414] w-full max-w-md bg-white p-8 shadow-xl">
      <div className="border-b-2 border-navy pb-3 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-navy">
          Government of the State
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          {gr.department}
        </p>
      </div>
      <div className="mt-4 flex justify-between text-[10px] text-slate-500">
        <span>No. {gr.number}</span>
        <span>{fmtDateLong(gr.date)}</span>
      </div>
      <p className="mt-5 text-center text-[13px] font-bold text-slate-800">
        GOVERNMENT RESOLUTION
      </p>
      <p className="mt-1 text-center text-[11px] font-semibold text-slate-600">
        Subject: {gr.subject}
      </p>
      <div className="mt-5 space-y-2">
        <p className="text-[10px] leading-relaxed text-slate-600">
          {gr.description}
        </p>
        {[85, 92, 78, 96, 70, 88, 60].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded bg-slate-200"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="mt-8 space-y-2">
        {[90, 82, 95, 74].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded bg-slate-200"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="mt-10 text-right">
        <div className="ml-auto h-8 w-24 rounded bg-slate-100" />
        <p className="mt-1 text-[9px] text-slate-500">Authorised Signatory</p>
      </div>
      <p className="mt-6 text-center text-[8px] uppercase tracking-widest text-slate-300">
        Demo document — sample data only
      </p>
    </div>
  );
}
