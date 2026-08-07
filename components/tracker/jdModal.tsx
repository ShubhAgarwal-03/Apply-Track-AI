"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface JDModalProps {
  jdSummary: string | null;
  jdOriginalText: string | null;
}

export function JDModal({ jdSummary, jdOriginalText }: JDModalProps) {
  const [tab, setTab] = useState<"summary" | "original">(jdSummary ? "summary" : "original");

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setTab("summary")}
          className={cn(
            "flex-1 text-sm font-medium py-3 border-b-2 -mb-px",
            tab === "summary"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-400"
          )}
        >
          Summary
        </button>
        <button
          onClick={() => setTab("original")}
          className={cn(
            "flex-1 text-sm font-medium py-3 border-b-2 -mb-px",
            tab === "original"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-400"
          )}
        >
          Original
        </button>
      </div>

      <div className="p-4 max-h-[420px] overflow-y-auto">
        {tab === "summary" ? (
          jdSummary ? (
            <p className="text-sm text-slate-600 leading-relaxed">{jdSummary}</p>
          ) : (
            <EmptyState />
          )
        ) : jdOriginalText ? (
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{jdOriginalText}</p>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
      <FileText size={28} />
      <p className="text-xs mt-2">Nothing to show here</p>
    </div>
  );
}
