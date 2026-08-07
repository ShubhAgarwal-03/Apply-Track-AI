// components/tracker/ScaleBadge.tsx
import { cn } from "@/lib/utils";
import type { CompanyScale } from "@/types/application";

const SCALE_LABELS: Record<CompanyScale, string> = {
  tier_1: "Tier 1",
  tier_2: "Tier 2",
  tier_3: "Tier 3",
  tier_4: "Tier 4",
  unknown: "Unknown",
};

const SCALE_STYLES: Record<CompanyScale, string> = {
  tier_1: "bg-indigo-50 text-indigo-700 border-indigo-200",
  tier_2: "bg-sky-50 text-sky-700 border-sky-200",
  tier_3: "bg-teal-50 text-teal-700 border-teal-200",
  tier_4: "bg-slate-50 text-slate-600 border-slate-200",
  unknown: "bg-slate-50 text-slate-400 border-slate-200",
};

export function ScaleBadge({ scale }: { scale: CompanyScale | null | undefined }) {
  const value = scale ?? "unknown";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        SCALE_STYLES[value]
      )}
    >
      {SCALE_LABELS[value]}
    </span>
  );
}