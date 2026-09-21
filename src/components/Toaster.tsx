import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useStore } from "../store";

const CONFIG = {
  success: {
    icon: CheckCircle2,
    cls: "border-[color:var(--color-success)]/30 bg-success-soft text-[color:var(--color-success)]",
  },
  warning: {
    icon: AlertTriangle,
    cls: "border-[color:var(--color-warning)]/30 bg-warning-soft text-[color:var(--color-warning)]",
  },
  error: {
    icon: XCircle,
    cls: "border-[color:var(--color-danger)]/30 bg-danger-soft text-[color:var(--color-danger)]",
  },
  info: {
    icon: Info,
    cls: "border-accent/30 bg-accent-soft text-accent",
  },
} as const;

export default function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2.5">
      {toasts.map((t) => {
        const { icon: Icon, cls } = CONFIG[t.kind];
        return (
          <div
            key={t.id}
            className={`animate-toast flex items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg ${cls}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium text-foreground">
              {t.message}
            </p>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
