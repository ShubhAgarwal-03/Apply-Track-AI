"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Application, Status } from "@/types/application";
import { JDModal } from "@/components/tracker/JDModal";
import { StatusSelect } from "@/components/tracker/StatusSelect";
import { ScaleBadge } from "@/components/tracker/ScaleBadge";
import { DeadlineBadge } from "@/components/tracker/DeadlineBadge";
import { ArrowLeft, Trash2, AlertTriangle, Save } from "lucide-react";

export default function TrackerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => setApp(json.data))
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField<K extends keyof Application>(key: K, value: Application[K]) {
    setApp((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
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
        location: app.location,
        deadline: app.deadline,
        status: app.status,
        appliedOn: app.appliedOn,
        salaryMin: app.salaryMin != null ? Number(app.salaryMin) : undefined,
        salaryMax: app.salaryMax != null ? Number(app.salaryMax) : undefined,
      }),
    });
    setSaving(false);
    setDirty(false);
    load();
  }

  async function handleDelete() {
    if (!confirm("Delete this application? This can't be undone.")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    router.push("/tracker");
  }

  async function handleStatusChange(status: Status) {
    updateField("status", status);
    // Status changes save immediately — deadline/other edits still need explicit Save
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (loading) {
    return <div className="text-center text-slate-400 text-sm py-16">Loading...</div>;
  }

  if (!app) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 font-medium">Application not found</p>
        <Link href="/tracker" className="text-sm text-blue-900 hover:underline mt-2 inline-block">
          ← Back to Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/tracker"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft size={15} />
        Back to Tracker
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-center shrink-0">
            {app.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{app.roleTitle}</h1>
            <p className="text-sm text-slate-400">
              {app.companyName}
              {app.location ? ` • ${app.location}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusSelect value={app.status} onChange={handleStatusChange} />
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg"
            title="Delete application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {app.needsReview && app.needsReviewReasons && app.needsReviewReasons.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">This entry needs review</p>
            <ul className="text-xs text-amber-700 list-disc list-inside mt-1 space-y-0.5">
              {app.needsReviewReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <JDModal jdSummary={app.jdSummary} jdOriginalText={app.jdOriginalText} />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Details</h3>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Deadline</label>
              <input
                type="date"
                value={app.deadline ? String(app.deadline).slice(0, 10) : ""}
                onChange={(e) => updateField("deadline", e.target.value as any)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="mt-1.5">
                <DeadlineBadge deadline={app.deadline} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Company Scale</label>
              <ScaleBadge scale={app.companyScale} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CGPA Cutoff</label>
              <p className="text-sm text-slate-700">{app.cgpaCutoff ?? "Not specified"}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Salary</label>
              <p className="text-sm text-slate-700">
                {app.salaryMin && app.salaryMax
                  ? `${app.salaryCurrency ?? "$"}${Number(app.salaryMin).toLocaleString()} - ${Number(
                      app.salaryMax
                    ).toLocaleString()} ${app.salaryFrequency ?? ""}`
                  : "Not specified"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Applied On</label>
              <input
                type="date"
                value={app.appliedOn ? String(app.appliedOn).slice(0, 10) : ""}
                onChange={(e) => updateField("appliedOn", e.target.value as any)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {dirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg py-2.5"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
