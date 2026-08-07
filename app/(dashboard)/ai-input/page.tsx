"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextPasteBox } from "@/components/ai-input/TextPasteBox";
import { UploadDropzone } from "@/components/ai-input/UploadDropzone";
import { StatusBadge } from "@/components/tracker/StatusBadge";
import { useApplications } from "@/hooks/useApplications";
import { Sparkles } from "lucide-react";

export default function AiInputPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: recent, loading: recentLoading, refetch } = useApplications({
    sortBy: "createdAt",
    sortDir: "desc",
    pageSize: 5,
  });

async function submit(payload: { text?: string; file?: File }) {
  setSubmitting(true);
  setError(null);
  try {
    const formData = new FormData();
    if (payload.text) formData.set("text", payload.text);
    if (payload.file) formData.set("file", payload.file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9500);

    const res = await fetch("/api/parse", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to parse");

    refetch();
    router.push(`/ai-input/review/${json.data.id}`);
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "This took too long — try pasting shorter text or a smaller file."
        : err instanceof Error
        ? err.message
        : "Something went wrong";
    setError(message);
    setSubmitting(false);
  }
}

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Paste once. Never miss an application deadline again.
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Drop a job description, upload a PDF, or paste raw text. Our AI extracts the details instantly.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <TextPasteBox value={text} onChange={setText} />
        <UploadDropzone onFileSelected={(file) => submit({ file })} />

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <button
          onClick={() => submit({ text })}
          disabled={submitting || !text.trim()}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg py-2.5"
        >
          <Sparkles size={16} />
          {submitting ? "Extracting..." : "Extract & Save"}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Recent Scans</h2>
        <div className="space-y-2">
          {recentLoading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-slate-400">Nothing parsed yet.</p>
          ) : (
            recent.map((app) => (
              <Link
                key={app.id}
                href={
                  app.needsReview
                    ? `/ai-input/review/${app.id}`
                    : `/tracker/${app.id}`
                }
                className="flex items-center justify-between bg-white border border-slate-200 border-l-4 rounded-lg p-3"
                style={{
                  borderLeftColor: app.needsReview ? "#f59e0b" : "#22c55e",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center">
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{app.companyName}</p>
                    <p className="text-xs text-slate-400">{app.roleTitle}</p>
                  </div>
                </div>
                <StatusBadge status={app.needsReview ? "drafting" : "ready_to_apply"} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
