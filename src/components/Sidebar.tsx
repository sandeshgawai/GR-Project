import {
  LayoutDashboard,
  FolderArchive,
  Search,
  FilePlus2,
  FileSpreadsheet,
  Building2,
  BarChart3,
  Settings,
  Landmark,
  LogOut,
  X,
} from "lucide-react";
import type { NavKey } from "../routes";
import { useT } from "../i18n";

const NAV: { key: NavKey; tkey: string; icon: typeof Search }[] = [
  { key: "dashboard", tkey: "nav.dashboard", icon: LayoutDashboard },
  { key: "repository", tkey: "nav.repository", icon: FolderArchive },
  { key: "search", tkey: "nav.search", icon: Search },
  { key: "add", tkey: "nav.add", icon: FilePlus2 },
  { key: "import", tkey: "nav.import", icon: FileSpreadsheet },
  { key: "departments", tkey: "nav.departments", icon: Building2 },
  { key: "reports", tkey: "nav.reports", icon: BarChart3 },
  { key: "settings", tkey: "nav.settings", icon: Settings },
];

export default function Sidebar({
  active,
  onNavigate,
  onLogout,
  open,
  onClose,
}: {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <Landmark size={18} />
            </div>
            <div>
              <p className="font-display text-[15px] font-extrabold leading-none tracking-tight">
                e-GR Store
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/50">
                {t("brand.tagline")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="scroll-area space-y-0.5 overflow-y-auto px-3 py-2">
          {NAV.map(({ key, tkey, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`h-5 w-0.5 rounded-full transition-colors ${
                    isActive ? "bg-white" : "bg-transparent"
                  }`}
                />
                <Icon size={17} className="shrink-0" />
                {t(tkey)}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Admin Officer</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-white/50">
                {t("user.role")}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("action.logout")}
              title={t("action.logout")}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
