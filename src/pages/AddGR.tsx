import { useState } from "react";
import { Save, X, CheckCircle2 } from "lucide-react";
import { useStore } from "../store";
import { Card, Button, Field, inputCls } from "../components/ui";
import { PageHeader } from "../components/common";
import { CATEGORIES, DEPARTMENTS, type GR } from "../data";
import type { NavKey } from "../routes";

interface FormState {
  number: string;
  date: string;
  department: string;
  category: string;
  subject: string;
  keywords: string;
  description: string;
  file: string;
}

const empty: FormState = {
  number: "",
  date: "",
  department: "",
  category: "",
  subject: "",
  keywords: "",
  description: "",
  file: "",
};

export default function AddGR({ onNavigate }: { onNavigate: (k: NavKey) => void }) {
  const { grs, addGR, toast } = useStore();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.number.trim()) e.number = "GR Number is required.";
    else if (grs.some((g) => g.number.toLowerCase() === form.number.trim().toLowerCase()))
      e.number = "This GR Number already exists.";
    if (!form.date) e.date = "GR Date is required.";
    if (!form.department) e.department = "Please select a department.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.file.trim()) e.file = "A GR PDF must be uploaded.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "warning");
      return;
    }
    const gr: GR = {
      id: Date.now().toString(),
      number: form.number.trim(),
      date: form.date,
      department: form.department,
      category: form.category,
      subject: form.subject.trim(),
      keywords: form.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      description: form.description.trim() || "No description provided.",
      status: "Active",
    };
    addGR(gr);
    toast(`${gr.number} saved to repository.`);
    onNavigate("repository");
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Add New GR"
        subtitle="Register a new Government Resolution in the repository."
      />

      <form onSubmit={submit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="GR Number" required error={errors.number}>
                <input
                  className={inputCls}
                  placeholder="GR/DEPT/2026/000"
                  value={form.number}
                  onChange={(e) => set("number", e.target.value)}
                />
              </Field>
              <Field label="GR Date" required error={errors.date}>
                <input
                  type="date"
                  className={inputCls}
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
              <Field label="Department" required error={errors.department}>
                <select
                  className={inputCls}
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Category" required error={errors.category}>
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Subject" required error={errors.subject}>
              <input
                className={inputCls}
                placeholder="Brief subject of the resolution"
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
              />
            </Field>

            <Field
              label="Keywords"
              hint="Comma-separated, e.g. Land, Revenue, Compensation"
            >
              <input
                className={inputCls}
                placeholder="Land, Revenue, Compensation"
                value={form.keywords}
                onChange={(e) => set("keywords", e.target.value)}
              />
            </Field>

            <Field label="Description">
              <textarea
                className={`${inputCls} min-h-28 resize-y`}
                placeholder="Detailed information about the Government Resolution…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </Card>

          {/* Upload + actions */}
          <div className="space-y-5">
            <Card className="p-6">
              <Field label="Upload GR PDF" required error={errors.file}>
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                    errors.file
                      ? "border-[color:var(--color-danger)] bg-danger-soft/40"
                      : form.file
                        ? "border-[color:var(--color-success)] bg-success-soft/50"
                        : "border-border bg-muted/50 hover:border-accent hover:bg-accent-soft/40"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      set("file", e.target.files?.[0]?.name ?? "")
                    }
                  />
                  {form.file ? (
                    <>
                      <CheckCircle2
                        size={24}
                        className="text-[color:var(--color-success)]"
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {form.file}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <Save size={22} className="text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        Click to upload PDF
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Only .pdf files accepted
                      </span>
                    </>
                  )}
                </label>
              </Field>
            </Card>

            <Card className="space-y-2 p-4">
              <Button type="submit" className="w-full">
                <Save size={16} /> Save GR
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onNavigate("repository")}
              >
                <X size={16} /> Cancel
              </Button>
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Fields marked <span className="text-[color:var(--color-danger)]">*</span> are required.
              </p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
