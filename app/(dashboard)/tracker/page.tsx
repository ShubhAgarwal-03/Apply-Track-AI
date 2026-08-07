"use client";

import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { useFilters } from "@/hooks/useFilters";
import { FilterBar } from "@/components/tracker/FilterBar";
import { SearchBar } from "@/components/tracker/SearchBar";
import { TrackerTable } from "@/components/tracker/TrackerTable";
import { TrackerCard } from "@/components/tracker/TrackerCard";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function TrackerPage() {
  const { filters, updateFilter } = useFilters();
  const [activeQuick, setActiveQuick] = useState<string[]>([]);
  const { data, total, loading } = useApplications(filters);

  function toggleQuickFilter(key: string) {
    setActiveQuick((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

    if (key === "tier1") {
      updateFilter(
        "companyScale",
        activeQuick.includes("tier1") ? undefined : "tier_1"
      );
    }
    if (key === "needsReview") {
      updateFilter("needsReview", activeQuick.includes("needsReview") ? undefined : true);
    }
    if (key === "interviews") {
      updateFilter("status", activeQuick.includes("interviews") ? undefined : "interviewing");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application Tracker</h1>
          <p className="text-sm text-slate-400">{total} Active Applications</p>
        </div>
        <SearchBar
          value={filters.search ?? ""}
          onChange={(v) => updateFilter("search", v || undefined)}
        />
      </div>

      <FilterBar active={activeQuick} onToggle={toggleQuickFilter} />

      <TrackerTable applications={data} loading={loading} />

      {/* Mobile cards */}
      <div className="md:hidden">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-8">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No applications yet.</p>
        ) : (
          data.map((app) => <TrackerCard key={app.id} app={app} />)
        )}
      </div>

      {/* Mobile floating add button */}
      <Link
        href="/ai-input"
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-lg"
      >
        <Plus size={22} />
      </Link>
    </div>
  );
}