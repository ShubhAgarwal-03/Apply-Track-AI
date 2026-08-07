"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { COMPANY_SCALE_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import type { Application } from "@/types/application";

interface ExtractedFieldsFormProps {
  values: Partial<Application>;
  needsReviewFields: string[]; // field keys flagged as low-confidence
  onChange: <K extends keyof Application>(key: K, value: Application[K]) => void;
}

function fieldClass(flagged: boolean) {
  return cn(
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900",
    flagged ? "border-amber-400 bg-amber-50" : "border-slate-200"
  );
}

function FieldLabel({ children, flagged }: { children: React.ReactNode; flagged: boolean }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="block text-sm font-medium text-slate-700">{children}</label>
      {flagged && (
        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
          <AlertCircle size={12} /> Needs Review
        </span>
      )}
    </div>
  );
}

export function ExtractedFieldsForm({ values, needsReviewFields, onChange }: ExtractedFieldsFormProps) {
  const flagged = (key: string) => needsReviewFields.includes(key);

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel flagged={false}>Company Name</FieldLabel>
        <input
          value={values.companyName ?? ""}
          onChange={(e) => onChange("companyName", e.target.value)}
          className={fieldClass(false)}
        />
      </div>

      <div>
        <FieldLabel flagged={flagged("roleTitle")}>Role / Title</FieldLabel>
        <input
          value={values.roleTitle ?? ""}
          onChange={(e) => onChange("roleTitle", e.target.value)}
          className={fieldClass(flagged("roleTitle"))}
        />
      </div>

      <div>
        <FieldLabel flagged={flagged("deadline")}>Application Deadline</FieldLabel>
        <input
          type="date"
          value={values.deadline ? String(values.deadline).slice(0, 10) : ""}
          onChange={(e) => onChange("deadline", e.target.value as any)}
          className={fieldClass(flagged("deadline"))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel flagged={flagged("salary")}>Salary Range</FieldLabel>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={values.salaryMin ?? ""}
              onChange={(e) => onChange("salaryMin", e.target.value as any)}
              placeholder="Min"
              className={fieldClass(flagged("salary"))}
            />
            <span className="text-slate-400 text-sm">-</span>
            <input
              type="number"
              value={values.salaryMax ?? ""}
              onChange={(e) => onChange("salaryMax", e.target.value as any)}
              placeholder="Max"
              className={fieldClass(flagged("salary"))}
            />
          </div>
        </div>

        <div>
          <FieldLabel flagged={flagged("companyScale")}>Scale / Frequency</FieldLabel>
          <select
            value={values.companyScale ?? "unknown"}
            onChange={(e) => onChange("companyScale", e.target.value as any)}
            className={fieldClass(flagged("companyScale"))}
          >
            {COMPANY_SCALE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel flagged={false}>Initial Status</FieldLabel>
        <select
          value={values.status ?? "ready_to_apply"}
          onChange={(e) => onChange("status", e.target.value as any)}
          className={fieldClass(false)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
