"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExtractedFieldsForm } from "@/components/ai-input/ExtractedFieldsForm";
import type { Application } from "@/types/application";
import { AlertTriangle, FileText } from "lucide-react";

export default function ReviewParsedDataPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => res.json())
      .then((json) => setApp(json.data))
      .finally(() => setLoading(false));
  }, [id]);

  function updateField<K extends keyof Application>(key: K, value: Application[K]) {
    setApp((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!app) return;
    setSaving(true);
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: app.companyName,
        roleTitle: app.roleTitle,
        deadline: app.deadline,
        salaryMin: app.salaryMin != null ? Number(app.salaryMin) : undefined,
        salaryMax: app.salaryMax != null ? Number(app.salaryMax) : undefined,
        companyScale: app.companyScale,
        status: app.status,
        needsReview: false,
        needsReviewReasons: [],
      }),
    });
    setSaving(false);
    router.push("/tracker");
  }

  async function handleDiscard() {
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    router.push("/ai-input");
  }

  if (loading || !app) {
    return <div className="text-center text-slate-400 text-sm py-16">Loading...</div>;
  }

  const reviewFields = app.needsReviewReasons ?? [];
  // Map free-text reasons to field keys for highlighting
  const flaggedKeys = [
    reviewFields.some((r) => r.toLowerCase().includes("role")) && "roleTitle",
    reviewFields.some((r) => r.toLowerCase().includes("deadline")) && "deadline",
    reviewFields.some((r) => r.toLowerCase().includes("salary")) && "salary",
    reviewFields.some((r) => r.toLowerCase().includes("scale")) && "companyScale",
    reviewFields.some((r) => r.toLowerCase().includes("cgpa")) && "companyScale",
  ].filter(Boolean) as string[];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-slate-900">Review Parsed Data</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-lg"
          >
            {saving ? "Saving..." : "Save to Tracker"}
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Please confirm the extracted details before saving to your tracker.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Original Source</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium capitalize">
              {app.sourceType} {app.sourceType !== "text" ? "Document" : ""}
            </span>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {app.jdOriginalText ? (
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.jdOriginalText}</p>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <FileText size={32} />
                <p className="text-xs mt-2">No source preview available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-800">Extracted Details</span>
            {flaggedKeys.length > 0 && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                <AlertTriangle size={12} />
                {flaggedKeys.length} Field{flaggedKeys.length > 1 ? "s" : ""} Need Review
              </span>
            )}
          </div>

          <ExtractedFieldsForm
            values={app}
            needsReviewFields={flaggedKeys}
            onChange={updateField}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg py-2.5"
          >
            {saving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
