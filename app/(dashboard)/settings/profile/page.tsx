"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { ArrowLeft, Check } from "lucide-react";

const DEGREES = ["B.Tech", "B.E.", "B.Sc", "M.Tech", "M.Sc", "MBA", "Other"];

export default function ProfileSettingsPage() {
  const { profile, loading, saving, error, save } = useProfile();

  const [form, setForm] = useState({
    name: "",
    graduationBatch: "",
    branch: "",
    degree: "",
    cgpa: "",
    citizenship: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        graduationBatch: profile.graduationBatch ?? "",
        branch: profile.branch ?? "",
        degree: profile.degree ?? "",
        cgpa: profile.cgpa ?? "",
        citizenship: profile.citizenship ?? "",
      });
    }
  }, [profile]);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await save({
      ...form,
      cgpa: form.cgpa as any,
    });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) {
    return <div className="text-center text-slate-400 text-sm py-16">Loading...</div>;
  }

  return (
    <div className="max-w-lg">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft size={15} />
        Back to Settings
      </Link>

      <h1 className="text-xl font-bold text-slate-900 mb-1">Profile</h1>
      <p className="text-sm text-slate-400 mb-6">
        Used to check eligibility and flag applications that need your attention.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
            <select
              value={form.degree}
              onChange={(e) => update("degree", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Select</option>
              {DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
            <input
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Batch</label>
            <input
              value={form.graduationBatch}
              onChange={(e) => update("graduationBatch", e.target.value)}
              placeholder="e.g. 2026"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Citizenship</label>
          <input
            value={form.citizenship}
            onChange={(e) => update("citizenship", e.target.value)}
            placeholder="e.g. Indian"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg py-2.5"
        >
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save Profile"
          )}
        </button>
      </form>
    </div>
  );
}
