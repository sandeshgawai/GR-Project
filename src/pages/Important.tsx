import { useState } from "react";
import { Star, ArrowUpRight, Trash2 } from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Badge, EmptyState, Modal } from "../components/ui";
import { PageHeader } from "../components/common";
import { fmtDate } from "../data";
import type { NavKey } from "../routes";

export default function Important({
  onOpen,
  onNavigate,
}: {
  onOpen: (id: string) => void;
  onNavigate: (k: NavKey) => void;
}) {
  const { grs, toggleImportant, toast } = useStore();
  const important = grs.filter((g) => g.important);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const target = grs.find((g) => g.id === removeId);

  return (
    <div className="animate-in">
      <PageHeader
        title="Important GRs"
        subtitle="Your saved and frequently accessed Government Resolutions."
      />

      {important.length === 0 ? (
        <EmptyState
          icon={<Star size={40} />}
          title="No important GRs yet"
          hint="Open any resolution and use “Add to Important” to pin it here for quick access."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {important.map((g) => (
            <Card
              key={g.id}
              className="flex flex-col p-5 transition-colors hover:border-navy/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-navy">
                  {g.number}
                </span>
                <Star
                  size={16}
                  className="fill-[color:var(--color-warning)] text-[color:var(--color-warning)]"
                />
              </div>
              <p className="text-[15px] font-semibold leading-snug text-foreground">
                {g.subject}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone="accent">
                  {g.department.replace(" Department", "")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {fmtDate(g.date)}
                </span>
              </div>
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpen(g.id)}
                >
                  <ArrowUpRight size={14} /> Open
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setRemoveId(g.id)}
                  aria-label="Remove from important"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {important.length > 0 && (
        <Button
          variant="subtle"
          className="mt-6"
          onClick={() => onNavigate("repository")}
        >
          Browse full repository
        </Button>
      )}

      <Modal
        open={!!removeId}
        onClose={() => setRemoveId(null)}
        title="Remove from Important"
        footer={
          <>
            <Button variant="outline" onClick={() => setRemoveId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (removeId) {
                  toggleImportant(removeId);
                  toast("Removed from Important GRs", "info");
                }
                setRemoveId(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          Remove{" "}
          <span className="font-mono font-semibold">{target?.number}</span> from
          your Important GRs? It will remain in the repository.
        </p>
      </Modal>
    </div>
  );
}
