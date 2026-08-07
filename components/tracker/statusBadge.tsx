// components/tracker/StatusBadge.tsx
import { cn } from "@/lib/utils";
import type { Status } from "@/types/application";

const STATUS_STYLES: Record<Status, { label: string; bg: string; text: string }> = {
  not_applied: { label: "Not Applied", bg: "bg-slate-100", text: "text-slate-600" },
  ready_to_apply: { label: "Ready to Apply", bg: "bg-blue-100", text: "text-blue-700" },
  drafting: { label: "Drafting", bg: "bg-purple-100", text: "text-purple-700" },
  applied: { label: "Applied", bg: "bg-green-100", text: "text-green-700" },
  interviewing: { label: "Interviewing", bg: "bg-amber-100", text: "text-amber-700" },
  offer: { label: "Offer", bg: "bg-emerald-100", text: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
  expired: { label: "Expired", bg: "bg-slate-100", text: "text-slate-400" },
};

export function StatusBadge({ status }: { status: Status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.not_applied;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        style.bg,
        style.text
      )}
    >
      {style.label}
    </span>
  );
}