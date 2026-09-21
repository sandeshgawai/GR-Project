import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "Light" | "System" | "Dark";

export interface Prefs {
  lang: string;
  theme: Theme;
  emailNotifications: boolean;
  demoWatermark: boolean;
  compactTables: boolean;
}

const DEFAULTS: Prefs = {
  lang: "English",
  theme: "Light",
  emailNotifications: true,
  demoWatermark: true,
  compactTables: false,
};

const KEY = "egr-prefs-v1";

function load(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function applyTheme(theme: Theme) {
  const dark = theme === "Dark" || (theme === "System" && prefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

interface Ctx {
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
}

const PrefsCtx = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load);

  // Apply preferences to the document whenever they change.
  useEffect(() => {
    applyTheme(prefs.theme);
    document.documentElement.classList.toggle("compact", prefs.compactTables);
    document.documentElement.lang = prefs.lang === "Marathi" ? "mr" : "en";
  }, [prefs]);

  // Follow the OS theme live while in "System" mode.
  useEffect(() => {
    if (prefs.theme !== "System") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("System");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [prefs.theme]);

  function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <PrefsCtx.Provider value={{ prefs, setPref }}>{children}</PrefsCtx.Provider>
  );
}

export function usePrefs(): Ctx {
  const c = useContext(PrefsCtx);
  if (!c) throw new Error("usePrefs must be used within PrefsProvider");
  return c;
}
