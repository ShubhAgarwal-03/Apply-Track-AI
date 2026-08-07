"use client";

import Link from "next/link";
import type { Application } from "@/types/application";
import { StatusBadge } from "./StatusBadge";
import { DeadlineBadge } from "./DeadlineBadge";
import { ScaleBadge } from "./ScaleBadge";

interface TrackerTableProps {
  applications: Application[];
  loading: boolean;
}

export function TrackerTable({ applications, loading }: TrackerTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400 text-sm">
        Loading applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-slate-600 font-medium">No applications yet</p>
        <p className="text-slate-400 text-sm mt-1">
          Paste a job description in AI Input to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left font-medium px-4 py-3">Company & Role</th>
            <th className="text-left font-medium px-4 py-3">Scale</th>
            <th className="text-left font-medium px-4 py-3">CGPA</th>
            <th className="text-left font-medium px-4 py-3">Deadline</th>
            <th className="text-left font-medium px-4 py-3">Status</th>
            <th className="text-left font-medium px-4 py-3">Salary</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
            >
              <td className="px-4 py-3">
                <Link href={`/tracker/${app.id}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center shrink-0">
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{app.roleTitle}</p>
                    <p className="text-xs text-slate-400">{app.companyName}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3">
                <ScaleBadge scale={app.companyScale} />
              </td>
              <td className="px-4 py-3 text-slate-600">{app.cgpaCutoff ?? "-"}</td>
              <td className="px-4 py-3">
                <DeadlineBadge deadline={app.deadline} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">
                {app.salaryMin && app.salaryMax
                  ? `${app.salaryCurrency ?? "$"}${Number(app.salaryMin).toLocaleString()}${
                      app.salaryMin !== app.salaryMax
                        ? ` - ${Number(app.salaryMax).toLocaleString()}`
                        : ""
                    }`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}