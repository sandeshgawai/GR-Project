import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Download,
  Pencil,
  ChevronLeft,
  ChevronRight,
  FolderArchive,
} from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Badge, EmptyState, inputCls } from "../components/ui";
import { PageHeader, StatusBadge } from "../components/common";
import { CATEGORIES, DEPARTMENTS, fmtDate } from "../data";
import { downloadGRPdf } from "../pdf";
import type { NavKey } from "../routes";

const PAGE_SIZE = 8;

export default function Repository({
  onOpen,
  onNavigate,
}: {
  onOpen: (id: string) => void;
  onNavigate: (k: NavKey) => void;
}) {
  const { grs, toast } = useStore();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grs
      .filter((g) => {
        const matchQ =
          !q ||
          g.number.toLowerCase().includes(q) ||
          g.subject.toLowerCase().includes(q) ||
          g.keywords.some((k) => k.toLowerCase().includes(q));
        return (
          matchQ &&
          (!dept || g.department === dept) &&
          (!cat || g.category === cat) &&
          (!status || g.status === status)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [grs, query, dept, cat, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="GR Repository"
        subtitle="Complete catalogue of stored Government Resolutions."
        actions={
          <Button onClick={() => onNavigate("add")}>Add New GR</Button>
        }
      />

      <Card>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className={`${inputCls} pl-9`}
              placeholder="Search GR number, subject or keyword…"
              value={query}
              onChange={(e) => resetPage(setQuery)(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <select
              className={inputCls}
              value={dept}
              onChange={(e) => resetPage(setDept)(e.target.value)}
            >
              <option value="">Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className={inputCls}
              value={cat}
              onChange={(e) => resetPage(setCat)(e.target.value)}
            >
              <option value="">Category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className={inputCls}
              value={status}
              onChange={(e) => resetPage(setStatus)(e.target.value)}
            >
              <option value="">Status</option>
              <option>Active</option>
              <option>Archived</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<FolderArchive size={40} />}
              title="No resolutions match"
              hint="Adjust your search or filters to see records."
            />
          </div>
        ) : (
          <div className="scroll-area overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">GR Number</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onOpen(g.id)}
                        className="font-mono text-[13px] font-semibold text-navy hover:text-accent hover:underline"
                      >
                        {g.number}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {fmtDate(g.date)}
                    </td>
                    <td className="px-4 py-3">
                      {g.department.replace(" Department", "")}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium">
                      {g.subject}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="accent">{g.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn label="View" onClick={() => onOpen(g.id)}>
                          <Eye size={15} />
                        </IconBtn>
                        <IconBtn
                          label="Edit"
                          onClick={() => onOpen(g.id)}
                        >
                          <Pencil size={15} />
                        </IconBtn>
                        <IconBtn
                          label="Download"
                          onClick={() => {
                            downloadGRPdf(g);
                            toast(`Downloaded ${g.number}.pdf`);
                          }}
                        >
                          <Download size={15} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {rows.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}–
              {(current - 1) * PAGE_SIZE + rows.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <IconBtn
              label="Previous"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
            >
              <ChevronLeft size={16} />
            </IconBtn>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-8 min-w-8 rounded-md px-2.5 text-sm font-semibold transition-colors ${
                  current === i + 1
                    ? "bg-navy text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <IconBtn
              label="Next"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={current === pages}
            >
              <ChevronRight size={16} />
            </IconBtn>
          </div>
        </div>
      </Card>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-navy disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
