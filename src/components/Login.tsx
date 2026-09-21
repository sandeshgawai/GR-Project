import { useState } from "react";
import {
  Landmark,
  Lock,
  User,
  ShieldCheck,
  UserPlus,
  IdCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { useStore } from "../store";
import { Button, inputCls } from "./ui";

interface Admin {
  name: string;
  username: string;
  password: string;
}

const ADMINS_KEY = "egr-admins-v1";

function loadAdmins(): Admin[] {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (raw) return JSON.parse(raw) as Admin[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveAdmins(list: Admin[]) {
  try {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { toast } = useStore();
  const [mode, setMode] = useState<"login" | "create">("login");

  // login state
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // create state
  const [cName, setCName] = useState("");
  const [cUser, setCUser] = useState("");
  const [cPass, setCPass] = useState("");
  const [cConfirm, setCConfirm] = useState("");
  const [cError, setCError] = useState("");

  // password visibility
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    const admins = loadAdmins();
    const match = admins.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase(),
    );
    // Registered admins must use the correct password; demo fallback allows any.
    if (match && match.password !== password) {
      setError("Incorrect password for this account.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 650);
  }

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setCError("");
    if (!cName.trim() || !cUser.trim() || !cPass.trim()) {
      setCError("Please fill in all required fields.");
      return;
    }
    if (cPass.length < 4) {
      setCError("Password must be at least 4 characters.");
      return;
    }
    if (cPass !== cConfirm) {
      setCError("Passwords do not match.");
      return;
    }
    const admins = loadAdmins();
    if (
      admins.some(
        (a) => a.username.toLowerCase() === cUser.trim().toLowerCase(),
      )
    ) {
      setCError("An admin with this username already exists.");
      return;
    }
    saveAdmins([
      ...admins,
      { name: cName.trim(), username: cUser.trim(), password: cPass },
    ]);
    toast(`Admin account "${cUser.trim()}" created. You can sign in now.`);
    setUsername(cUser.trim());
    setPassword("");
    setCName("");
    setCUser("");
    setCPass("");
    setCConfirm("");
    setMode("login");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
            <Landmark size={22} />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold tracking-tight">
              e-GR Store
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">
              Gov. Resolution Repository
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Every Government Resolution, one search away.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            A secure internal repository for storing, organising and instantly
            retrieving Government Resolutions — replacing scattered folders and
            physical records with one authoritative system.
          </p>
          <div className="mt-8 flex gap-8">
            {[
              ["2,458", "Resolutions"],
              ["18", "Departments"],
              ["100%", "Digitised"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold">{n}</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck size={14} /> Authorized Government Office System
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
              <Landmark size={22} />
            </div>
            <p className="font-display text-xl font-extrabold text-navy">
              e-GR Store
            </p>
            <p className="text-sm text-muted-foreground">
              Digital Government Resolution Repository
            </p>
          </div>

          {/* Mode switch */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/60 p-1">
            {(["login", "create"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                  setCError("");
                }}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-card text-navy shadow-sm"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {m === "login" ? "Sign in" : "Create Admin"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Officer Sign in
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your government credentials to continue.
              </p>

              <form onSubmit={submitLogin} className="mt-7 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      className={`${inputCls} pl-9`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showLogin ? "text" : "password"}
                      className={`${inputCls} pl-9 pr-10`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLogin((v) => !v)}
                      aria-label={showLogin ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-navy"
                    >
                      {showLogin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-[color:var(--color-danger)]">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Login"}
                </Button>
              </form>

              <div className="mt-6 rounded-md border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Demo access:
                </span>{" "}
                sign in with any username &amp; password, or create a new admin.
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Create New Admin
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Register a new administrator account for this office.
              </p>

              <form onSubmit={submitCreate} className="mt-7 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Full Name <span className="text-[color:var(--color-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <IdCard
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      className={`${inputCls} pl-9`}
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      placeholder="e.g. Priya Deshmukh"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Username <span className="text-[color:var(--color-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      className={`${inputCls} pl-9`}
                      value={cUser}
                      onChange={(e) => setCUser(e.target.value)}
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Password <span className="text-[color:var(--color-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showCreate ? "text" : "password"}
                      className={`${inputCls} pl-9 pr-10`}
                      value={cPass}
                      onChange={(e) => setCPass(e.target.value)}
                      placeholder="At least 4 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreate((v) => !v)}
                      aria-label={showCreate ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-navy"
                    >
                      {showCreate ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Confirm Password <span className="text-[color:var(--color-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`${inputCls} pl-9 pr-10`}
                      value={cConfirm}
                      onChange={(e) => setCConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-navy"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {cError && (
                  <p className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-[color:var(--color-danger)]">
                    {cError}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  <UserPlus size={16} /> Create Admin Account
                </Button>
              </form>
            </>
          )}

          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Authorized Government Office System
          </p>
        </div>
      </div>
    </div>
  );
}
