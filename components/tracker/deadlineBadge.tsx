// components/tracker/DeadlineBadge.tsx
import { cn } from "@/lib/utils";
import {
  formatDateShort,
  formatDeadlineLabel,
  getDeadlineUrgency,
  URGENCY_STYLES,
} from "@/lib/deadline-utils";

export function DeadlineBadge({ deadline }: { deadline: string | Date | null }) {
  const urgency = getDeadlineUrgency(deadline);
  const style = URGENCY_STYLES[urgency];

  if (urgency === "none") {
    return <span className="text-sm text-slate-400">No deadline</span>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-slate-700">{formatDateShort(deadline)}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium rounded px-1.5 py-0.5 w-fit",
          style.bg,
          style.text
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
        {formatDeadlineLabel(deadline)}
      </span>
    </div>
  );
}