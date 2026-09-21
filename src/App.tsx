import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { StoreProvider } from "./store";
import { PrefsProvider, usePrefs } from "./prefs";
import { useT } from "./i18n";
import type { NavKey, Route } from "./routes";
import Login from "./components/Login";
import Notifications from "./components/Notifications";
import Sidebar from "./components/Sidebar";
import Toaster from "./components/Toaster";
import Dashboard from "./pages/Dashboard";
import SearchGR from "./pages/SearchGR";
import Repository from "./pages/Repository";
import GRDetails from "./pages/GRDetails";
import AddGR from "./pages/AddGR";
import ImportExcel from "./pages/ImportExcel";
import Departments from "./pages/Departments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Shell({ onLogout }: { onLogout: () => void }) {
  const { prefs } = usePrefs();
  const t = useT();
  const [route, setRoute] = useState<Route>({ key: "dashboard" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const go = (key: NavKey) => {
    setRoute({ key });
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };
  const openDetail = (id: string) => {
    setRoute((r) => ({ key: r.key, detailId: id }));
    window.scrollTo({ top: 0 });
  };
  const clearDetail = () => setRoute((r) => ({ key: r.key }));

  function renderPage() {
    if (route.detailId)
      return <GRDetails id={route.detailId} onBack={clearDetail} />;
    switch (route.key) {
      case "dashboard":
        return <Dashboard onNavigate={go} onOpen={openDetail} />;
      case "search":
        return <SearchGR onOpen={openDetail} />;
      case "repository":
        return <Repository onOpen={openDetail} onNavigate={go} />;
      case "add":
        return <AddGR onNavigate={go} />;
      case "import":
        return <ImportExcel onNavigate={go} />;
      case "departments":
        return <Departments onNavigate={go} />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        active={route.key}
        onNavigate={go}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-navy lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              e-GR Store /
            </span>
            <span className="font-display text-sm font-bold text-navy">
              {t(`nav.${route.key}`)}
            </span>
          </div>

          <button
            onClick={() => go("search")}
            className="ml-auto flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-navy/30 hover:text-navy"
          >
            <Search size={15} />
            <span className="hidden sm:inline">{t("topbar.search")}</span>
          </button>
          <Notifications onOpen={openDetail} />
        </header>

        {/* Page */}
        <main className="scroll-area flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">{renderPage()}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-4 py-4 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 text-xs text-muted-foreground sm:flex-row">
            <p>e-GR Store • Government Resolution Management System</p>
            <p className="font-mono uppercase tracking-wide">Demo Version</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <PrefsProvider>
      <StoreProvider>
        {authed ? (
          <Shell onLogout={() => setAuthed(false)} />
        ) : (
          <Login onLogin={() => setAuthed(true)} />
        )}
        <Toaster />
      </StoreProvider>
    </PrefsProvider>
  );
}
