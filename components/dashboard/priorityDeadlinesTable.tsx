"use client";

import Link from "next/link";
import type { Application } from "@/types/application";
import { StatusBadge } from "@/components/tracker/statusBadge";
import { getDeadlineUrgency, formatDateShort, formatDeadlineLabel } from "@/lib/deadline-utils";
import { cn } from "@/lib/utils";

export function PriorityDeadlinesTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">
        No upcoming deadlines. You&apos;re all caught up.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left font-medium px-4 py-3">Role & Company</th>
            <th className="text-left font-medium px-4 py-3">Status</th>
            <th className="text-left font-medium px-4 py-3">Deadline</th>
            <th className="text-left font-medium px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const urgency = getDeadlineUrgency(app.deadline);
            return (
              <tr key={app.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{app.roleTitle}</p>
                  <p className="text-xs text-slate-400">
                    {app.companyName}
                    {app.location ? ` • ${app.location}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      urgency === "today" || urgency === "overdue"
                        ? "text-red-600"
                        : urgency === "soon"
                        ? "text-amber-600"
                        : "text-slate-500"
                    )}
                  >
                    {formatDateShort(app.deadline)} · {formatDeadlineLabel(app.deadline)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/tracker/${app.id}`}
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-md",
                      app.needsReview
                        ? "bg-amber-100 text-amber-700"
                        : "text-blue-900 hover:underline"
                    )}
                  >
                    {app.needsReview ? "Review" : "View"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
