import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Star, FileText, CheckCheck } from "lucide-react";
import { useStore } from "../store";
import { fmtDate } from "../data";

const SEEN_KEY = "egr-seen-gr-ids-v1";

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function persistSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export default function Notifications({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const { grs } = useStore();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(loadSeen);
  const [highlight, setHighlight] = useState<Set<string>>(new Set());
  const seededRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // First run: treat the records already in the store as "seen" so the bell
  // only lights up for GRs added from here on, not the entire backlog.
  useEffect(() => {
    if (seededRef.current) return;
    if (localStorage.getItem(SEEN_KEY) === null && grs.length > 0) {
      const ids = grs.map((g) => g.id);
      persistSeen(ids);
      setSeen(new Set(ids));
      seededRef.current = true;
    }
  }, [grs]);

  // Most recent resolutions, newest first.
  const feed = useMemo(
    () => [...grs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    [grs],
  );
  const unread = useMemo(
    () => grs.filter((g) => !seen.has(g.id)),
    [grs, seen],
  );

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markAllRead() {
    const ids = grs.map((g) => g.id);
    persistSeen(ids);
    setSeen(new Set(ids));
  }

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (next) {
        // Snapshot what was unread so we can flag those rows, then clear the dot.
        setHighlight(new Set(unread.map((g) => g.id)));
        markAllRead();
      }
      return next;
    });
  }

  function openGr(id: string) {
    setOpen(false);
    onOpen(id);
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={toggle}
        className={`relative rounded-md p-2 transition-colors hover:bg-muted hover:text-navy ${
          open ? "bg-muted text-navy" : "text-muted-foreground"
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold leading-none text-white ring-2 ring-card">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-in absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_32px_rgba(16,41,79,0.16)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-navy">
                Notifications
              </span>
              {unread.length > 0 && (
                <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-accent">
                  {unread.length} new
                </span>
              )}
            </div>
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-navy"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          </div>

          <div className="scroll-area max-h-[22rem] overflow-y-auto">
            {feed.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 px-6 py-12 text-center">
                <Bell size={22} className="text-muted-foreground/50" />
                <p className="text-sm font-semibold text-foreground">
                  You&apos;re all caught up
                </p>
                <p className="text-xs text-muted-foreground">
                  New Government Resolutions will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {feed.map((g) => {
                  const isNew = highlight.has(g.id);
                  return (
                    <li key={g.id}>
                      <button
                        onClick={() => openGr(g.id)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            g.important
                              ? "bg-warning-soft text-[color:var(--color-warning)]"
                              : "bg-accent-soft text-accent"
                          }`}
                        >
                          {g.important ? (
                            <Star size={15} />
                          ) : (
                            <FileText size={15} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {g.subject}
                            </span>
                            {isNew && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            )}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                            {g.number}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {g.department} • {fmtDate(g.date)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
