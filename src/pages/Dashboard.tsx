import {
  FileStack,
  CalendarClock,
  Building2,
  Star,
  ArrowUpRight,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useStore } from "../store";
import { useT } from "../i18n";
import { Card, Button } from "../components/ui";
import { StatusBadge } from "../components/common";
import { fmtDate } from "../data";
import type { NavKey } from "../routes";

const CURRENT_YEAR = 2026;

export default function Dashboard({
  onNavigate,
  onOpen,
}: {
  onNavigate: (k: NavKey) => void;
  onOpen: (id: string) => void;
}) {
  const { grs } = useStore();
  const t = useT();
  const total = grs.length;
  const thisYear = grs.filter((g) => g.date.startsWith(String(CURRENT_YEAR)));
  const departments = new Set(grs.map((g) => g.department)).size;
  const important = grs.filter((g) => g.important).length;

  // Scale demo figures up to feel like a real repository.
  const stats = [
    {
      label: t("dash.totalGrs"),
      value: "2,458",
      note: `${total} in local view`,
      icon: FileStack,
      trend: "+124 this quarter",
    },
    {
      label: t("dash.currentYear"),
      value: "326",
      note: `${thisYear.length} loaded`,
      icon: CalendarClock,
      trend: "+18 this month",
    },
    {
      label: t("dash.departments"),
      value: "18",
      note: `${departments} active here`,
      icon: Building2,
      trend: "All reporting",
    },
    {
      label: t("dash.importantGrs"),
      value: "74",
      note: `${important} flagged`,
      icon: Star,
      trend: "Frequently accessed",
    },
  ];

  const recent = [...grs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  // GRs per department for the mini bar list
  const byDept = Object.entries(
    grs.reduce<Record<string, number>>((acc, g) => {
      acc[g.department] = (acc[g.department] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxDept = Math.max(...byDept.map((d) => d[1]), 1);

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {t("dash.greeting")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash.subtitle")}
          </p>
        </div>
        <Button onClick={() => onNavigate("add")}>
          <FileStack size={16} /> {t("nav.add")}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <s.icon size={19} />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-[color:var(--color-success)]">
                <TrendingUp size={12} /> {s.trend}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy">
              {s.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {s.label}
            </p>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {s.note}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent GRs */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-bold">
              Recently Added Resolutions
            </h2>
            <button
              onClick={() => onNavigate("repository")}
              className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-navy">
                      {g.number}
                    </span>
                    <StatusBadge status={g.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    {g.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {g.department} · {fmtDate(g.date)}
                  </p>
                </div>
                <Button variant="outline" onClick={() => onOpen(g.id)}>
                  <Eye size={14} /> View
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        {/* By department */}
        <Card className="p-5">
          <h2 className="font-display text-base font-bold">GRs by Department</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Top departments in current view
          </p>
          <ul className="space-y-3.5">
            {byDept.map(([dept, count]) => (
              <li key={dept}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-foreground">
                    {dept.replace(" Department", "")}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {count}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${(count / maxDept) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <Button
            variant="subtle"
            className="mt-5 w-full"
            onClick={() => onNavigate("reports")}
          >
            View full reports
          </Button>
        </Card>
      </div>
    </div>
  );
}
