import { User, KeyRound, SlidersHorizontal, Save } from "lucide-react";
import { useStore } from "../store";
import { usePrefs, type Theme } from "../prefs";
import { useT } from "../i18n";
import { Card, Button, Field, inputCls } from "../components/ui";
import { PageHeader } from "../components/common";

export default function Settings() {
  const { toast } = useStore();
  const { prefs, setPref } = usePrefs();
  const t = useT();

  return (
    <div className="animate-in">
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="p-6">
          <SectionTitle icon={<User size={16} />} title={t("settings.profile")} />
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy font-display text-xl font-bold text-white">
              AD
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                Admin Officer
              </p>
              <p className="text-sm text-muted-foreground">
                Collector Office · Administrator
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("settings.fullName")}>
              <input className={inputCls} defaultValue="Admin Officer" />
            </Field>
            <Field label={t("settings.designation")}>
              <input className={inputCls} defaultValue="Administrator" />
            </Field>
            <Field label={t("settings.email")}>
              <input className={inputCls} defaultValue="admin@egr.gov.in" />
            </Field>
            <Field label={t("settings.office")}>
              <input className={inputCls} defaultValue="Collector Office" />
            </Field>
          </div>
          <Button className="mt-5" onClick={() => toast("Profile updated.")}>
            <Save size={16} /> {t("settings.saveProfile")}
          </Button>
        </Card>

        {/* Change password */}
        <Card className="p-6">
          <SectionTitle
            icon={<KeyRound size={16} />}
            title={t("settings.changePassword")}
          />
          <div className="mt-4 space-y-4">
            <Field label={t("settings.currentPassword")}>
              <input type="password" className={inputCls} placeholder="••••••••" />
            </Field>
            <Field label={t("settings.newPassword")}>
              <input type="password" className={inputCls} placeholder="••••••••" />
            </Field>
            <Field label={t("settings.confirmPassword")}>
              <input type="password" className={inputCls} placeholder="••••••••" />
            </Field>
          </div>
          <Button
            className="mt-5"
            onClick={() => toast("Password changed successfully.")}
          >
            {t("settings.updatePassword")}
          </Button>
        </Card>

        {/* Preferences */}
        <Card className="p-6 lg:col-span-2">
          <SectionTitle
            icon={<SlidersHorizontal size={16} />}
            title={t("settings.preferences")}
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("settings.language")}>
              <select
                className={inputCls}
                value={prefs.lang}
                onChange={(e) => setPref("lang", e.target.value)}
              >
                <option>English</option>
                <option>Marathi</option>
              </select>
            </Field>
            <Field label={t("settings.theme")}>
              <select
                className={inputCls}
                value={prefs.theme}
                onChange={(e) => setPref("theme", e.target.value as Theme)}
              >
                <option>Light</option>
                <option>Dark</option>
              </select>
            </Field>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Toggle
              label={t("settings.emailNotifications")}
              on={prefs.emailNotifications}
              onChange={(v) => {
                setPref("emailNotifications", v);
                toast(
                  v
                    ? "Email notifications turned on."
                    : "Email notifications turned off.",
                );
              }}
            />
            <Toggle
              label={t("settings.compactTables")}
              on={prefs.compactTables}
              onChange={(v) => {
                setPref("compactTables", v);
                toast(v ? "Compact tables enabled." : "Compact tables disabled.");
              }}
            />
          </div>
          <Button
            className="mt-6"
            onClick={() => toast("Preferences saved.")}
          >
            <Save size={16} /> {t("settings.savePreferences")}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-accent">
        {icon}
      </span>
      <h2 className="font-display text-base font-bold">{title}</h2>
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-medium transition-colors hover:border-navy/30"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          on ? "bg-accent" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}
