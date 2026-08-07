"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/application";
import { StatusBadge } from "./StatusBadge";
import { getDeadlineUrgency, formatDeadlineLabel } from "@/lib/deadline-utils";

const URGENCY_BORDER: Record<string, string> = {
  overdue: "border-l-red-500",
  today: "border-l-red-500",
  soon: "border-l-amber-500",
  upcoming: "border-l-blue-400",
  far: "border-l-slate-200",
  none: "border-l-slate-200",
};

export function TrackerCard({ app }: { app: Application }) {
  const urgency = getDeadlineUrgency(app.deadline);

  return (
    <Link
      href={`/tracker/${app.id}`}
      className={cn(
        "block bg-white border border-slate-200 border-l-4 rounded-xl p-4 mb-3",
        URGENCY_BORDER[urgency]
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center shrink-0">
            {app.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{app.companyName}</p>
            <p className="text-xs text-slate-400">{app.roleTitle}</p>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <div className="flex items-center justify-between mt-2 pl-9">
        <span
          className={cn(
            "text-xs font-medium",
            urgency === "overdue" || urgency === "today"
              ? "text-red-600"
              : urgency === "soon"
              ? "text-amber-600"
              : "text-slate-400"
          )}
        >
          {formatDeadlineLabel(app.deadline)}
        </span>
        <span className="text-xs text-blue-900 font-medium">View JD ›</span>
      </div>
    </Link>
  );
}