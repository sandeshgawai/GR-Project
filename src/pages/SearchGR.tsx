import { useMemo, useState } from "react";
import { Search, Eye, Download, SlidersHorizontal, FileSearch } from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Badge, EmptyState, inputCls } from "../components/ui";
import { PageHeader } from "../components/common";
import {
  CATEGORIES,
  DEPARTMENTS,
  fmtDate,
  type GR,
} from "../data";
import { downloadGRPdf } from "../pdf";

const selectCls = inputCls;

export default function SearchGR({ onOpen }: { onOpen: (id: string) => void }) {
  const { grs, toast } = useStore();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [cat, setCat] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [year, setYear] = useState("");
  const [searched, setSearched] = useState(false);

  const years = useMemo(
    () =>
      Array.from(new Set(grs.map((g) => g.date.slice(0, 4)))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [grs],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grs.filter((g) => {
      const matchQ =
        !q ||
        g.number.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.department.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.keywords.some((k) => k.toLowerCase().includes(q));
      const matchDept = !dept || g.department === dept;
      const matchCat = !cat || g.category === cat;
      const matchYear = !year || g.date.startsWith(year);
      const matchFrom = !from || g.date >= from;
      const matchTo = !to || g.date <= to;
      return matchQ && matchDept && matchCat && matchYear && matchFrom && matchTo;
    });
  }, [grs, query, dept, cat, from, to, year]);

  function reset() {
    setQuery("");
    setDept("");
    setCat("");
    setFrom("");
    setTo("");
    setYear("");
    setSearched(false);
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Search Government Resolutions"
        subtitle="Search across GR number, subject, department, category and keywords."
      />

      <Card className="p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            className={`${inputCls} py-3 pl-11 text-[15px]`}
            placeholder="Search by GR number, subject, department or keyword…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(true);
            }}
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <SlidersHorizontal size={13} /> Filters
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select
            className={selectCls}
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            className={selectCls}
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            className={selectCls}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
          />
          <input
            type="date"
            className={selectCls}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
          />
          <select
            className={selectCls}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Any Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={() => setSearched(true)}>
            <Search size={16} /> Search
          </Button>
          <Button variant="ghost" onClick={reset}>
            Clear filters
          </Button>
        </div>
      </Card>

      <div className="mt-6">
        {searched && (
          <p className="mb-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "resolution" : "resolutions"} found
          </p>
        )}

        {!searched ? (
          <EmptyState
            icon={<FileSearch size={40} />}
            title="Start searching resolutions"
            hint="Type a GR number, subject or keyword above, or apply filters to narrow the repository."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<FileSearch size={40} />}
            title="No matching resolutions"
            hint="Try a different keyword or clear some filters."
          />
        ) : (
          <div className="space-y-3">
            {results.map((g) => (
              <ResultRow key={g.id} gr={g} onOpen={onOpen} onDownload={() => { downloadGRPdf(g); toast(`Downloaded ${g.number}.pdf`); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({
  gr,
  onOpen,
  onDownload,
}: {
  gr: GR;
  onOpen: (id: string) => void;
  onDownload: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4 transition-colors hover:border-navy/30 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-navy">
            {gr.number}
          </span>
          <Badge tone="accent">{gr.department.replace(" Department", "")}</Badge>
          <span className="text-xs text-muted-foreground">{fmtDate(gr.date)}</span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold text-foreground">
          {gr.subject}
        </p>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
          {gr.description}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" onClick={() => onOpen(gr.id)}>
          <Eye size={14} /> View
        </Button>
        <Button variant="subtle" onClick={onDownload}>
          <Download size={14} /> Download
        </Button>
      </div>
    </Card>
  );
}
