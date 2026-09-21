import { Building2, ArrowUpRight, FileStack } from "lucide-react";
import { useStore } from "../store";
import { Card, Button } from "../components/ui";
import { PageHeader } from "../components/common";
import { DEPARTMENTS } from "../data";
import type { NavKey } from "../routes";

export default function Departments({
  onNavigate,
}: {
  onNavigate: (k: NavKey) => void;
}) {
  const { grs } = useStore();

  const counts = DEPARTMENTS.map((d) => ({
    name: d,
    count: grs.filter((g) => g.department === d).length,
    active: grs.filter((g) => g.department === d && g.status === "Active").length,
  }));

  return (
    <div className="animate-in">
      <PageHeader
        title="Departments"
        subtitle="Government departments contributing resolutions to the repository."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map((d) => (
          <Card
            key={d.name}
            className="flex flex-col p-5 transition-colors hover:border-navy/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                <Building2 size={20} />
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                {d.name.split(" ")[0].slice(0, 3).toUpperCase()}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold leading-snug text-foreground">
              {d.name}
            </h3>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <FileStack size={14} />
                <span className="font-semibold text-foreground">{d.count}</span>{" "}
                GRs
              </span>
              <span className="text-[color:var(--color-success)]">
                {d.active} active
              </span>
            </div>
            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => onNavigate("repository")}
            >
              View GRs <ArrowUpRight size={14} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
