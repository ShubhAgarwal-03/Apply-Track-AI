"use client";

import Link from "next/link";
import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { PriorityDeadlinesTable } from "@/components/dashboard/priorityDeadlinesTable";
import { RecentActivity } from "@/components/dashboard/recentActivity";
import { StatusBadge } from "@/components/tracker/statusBadge";
import { formatDeadlineLabel, getDeadlineUrgency } from "@/lib/deadline-utils";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  AlertTriangle,
  XCircle,
  FileClock,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const { data, loading } = useDashboard();
  const [pasteValue, setPasteValue] = useState("");

  if (loading || !data) {
    return <div className="text-center text-slate-400 text-sm py-16">Loading dashboard...</div>;
  }

  const { stats, priorityDeadlines, recentActivity } = data;
  const activeCount = stats.total - stats.notApplied - stats.expired;

  return (
    <div className="space-y-6">
      {/* ---------- Desktop overview ---------- */}
      <div className="hidden md:block space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-400">Your application pipeline at a glance.</p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Total Applications" value={stats.total} icon={Briefcase} trend="↑ 12%" />
          <StatCard label="Not Applied" value={stats.notApplied} icon={FileClock} />
          <StatCard label="Deadlines This Week" value={stats.deadlinesThisWeek} icon={Calendar} />
          <StatCard label="Needs Review" value={stats.needsReview} icon={AlertTriangle} tone="warning" />
          <StatCard label="Expired" value={stats.expired} icon={XCircle} tone="danger" />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Priority Deadlines</h2>
              <Link href="/tracker" className="text-xs text-blue-900 font-medium hover:underline">
                View Tracker →
              </Link>
            </div>
            <PriorityDeadlinesTable applications={priorityDeadlines} />
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900 rounded-xl p-4 text-white">
              <p className="text-sm font-semibold mb-2">Found a new role?</p>
              <p className="text-xs text-blue-100 mb-3">
                Paste the URL or job description below to let AI parse it instantly.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/ai-input?draft=${encodeURIComponent(pasteValue)}`;
                }}
                className="flex gap-2"
              >
                <input
                  value={pasteValue}
                  onChange={(e) => setPasteValue(e.target.value)}
                  placeholder="Paste JD URL here..."
                  className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-900 text-sm font-medium px-3 py-2 rounded-lg shrink-0"
                >
                  Parse
                </button>
              </form>
            </div>

            <RecentActivity applications={recentActivity} />
          </div>
        </div>
      </div>

      {/* ---------- Mobile home ---------- */}
      <div className="md:hidden space-y-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">ApplyTrack AI</h1>
          <p className="text-sm text-slate-400">Welcome back</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-[11px] font-medium text-slate-400 uppercase">Active</p>
            <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-[11px] font-medium text-purple-500 uppercase">Interviews</p>
            <p className="text-2xl font-bold text-purple-700">
              {recentActivity.filter((a) => a.status === "interviewing").length}
            </p>
          </div>
        </div>

        <div className="bg-blue-900 rounded-xl p-4 text-white flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase text-blue-200 font-medium">Total Tracked</p>
            <p className="text-2xl font-bold">{stats.total} Applications</p>
          </div>
          <ArrowRight size={20} className="text-blue-200" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Upcoming Deadlines</h2>
            <Link href="/tracker" className="text-xs text-blue-900 font-medium">View All</Link>
          </div>
          <div className="space-y-2">
            {priorityDeadlines.slice(0, 2).map((app) => {
              const urgency = getDeadlineUrgency(app.deadline);
              return (
                <Link
                  key={app.id}
                  href={`/tracker/${app.id}`}
                  className="block bg-white border border-slate-200 rounded-xl p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{app.roleTitle}</p>
                      <p className="text-xs text-slate-400">
                        {app.companyName}
                        {app.location ? ` • ${app.location}` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium px-2 py-0.5 rounded-full",
                        urgency === "today" || urgency === "overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {formatDeadlineLabel(app.deadline)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href="/ai-input"
          className="block text-center bg-blue-900 text-white font-medium rounded-xl py-3"
        >
          + Paste New Opportunity
        </Link>
      </div>
    </div>
  );
}
