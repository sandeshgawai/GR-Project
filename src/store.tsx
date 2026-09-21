import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_GRS, type GR } from "./data";
import { api, hasBackend } from "./api";

type ToastKind = "success" | "warning" | "error" | "info";
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

type Backend = "checking" | "online" | "offline";

interface Store {
  grs: GR[];
  loading: boolean;
  backend: Backend;
  addGR: (gr: GR) => Promise<void>;
  addMany: (grs: GR[]) => Promise<void>;
  updateGR: (gr: GR) => Promise<void>;
  toggleImportant: (id: string) => Promise<void>;
  toasts: Toast[];
  toast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "egr-store-grs-v2";

function loadLocal(): GR[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as GR[];
  } catch {
    /* ignore */
  }
  return SEED_GRS;
}

function cacheLocal(grs: GR[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(grs));
  } catch {
    /* ignore */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [grs, setGrs] = useState<GR[]>(loadLocal);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState<Backend>("checking");

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // Initial load: prefer the database, fall back to the local cache.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (await hasBackend()) {
          const remote = await api.list();
          if (!alive) return;
          setGrs(remote);
          cacheLocal(remote);
          setBackend("online");
        } else {
          setBackend("offline");
        }
      } catch {
        if (alive) setBackend("offline");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Keep the local cache in sync so the app works offline too.
  useEffect(() => {
    cacheLocal(grs);
  }, [grs]);

  const persist = useCallback(
    async (fn: () => Promise<void>) => {
      if (backend !== "online") return;
      try {
        await fn();
      } catch {
        toast("Saved locally — could not reach the database.", "warning");
      }
    },
    [backend, toast],
  );

  const value = useMemo<Store>(
    () => ({
      grs,
      loading,
      backend,
      toasts,
      toast,
      dismissToast,
      addGR: async (gr) => {
        setGrs((s) => [gr, ...s]);
        await persist(() => api.create(gr));
      },
      addMany: async (list) => {
        setGrs((s) => [...list, ...s]);
        await persist(() => api.bulk(list));
      },
      updateGR: async (gr) => {
        setGrs((s) => s.map((g) => (g.id === gr.id ? gr : g)));
        await persist(() => api.update(gr));
      },
      toggleImportant: async (id) => {
        let next: GR | undefined;
        setGrs((s) =>
          s.map((g) => {
            if (g.id !== id) return g;
            next = { ...g, important: !g.important };
            return next;
          }),
        );
        if (next) await persist(() => api.update(next!));
      },
    }),
    [grs, loading, backend, toasts, toast, dismissToast, persist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
