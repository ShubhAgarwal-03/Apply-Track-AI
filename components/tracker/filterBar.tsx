"use client";

import { cn } from "@/lib/utils";

interface FilterBarProps {
  active: string[];
  onToggle: (key: string) => void;
}

const QUICK_FILTERS = [
  { key: "active", label: "Active" },
  { key: "interviews", label: "Interviews" },
  { key: "tier1", label: "Tier 1" },
  { key: "needsReview", label: "Needs Review" },
];

export function FilterBar({ active, onToggle }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onToggle(f.key)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            active.includes(f.key)
              ? "bg-blue-900 border-blue-900 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
          )}
        >
          {f.label}
          {f.key === "needsReview" && <span className="ml-1">⚠</span>}
        </button>
      ))}
    </div>
  );
}