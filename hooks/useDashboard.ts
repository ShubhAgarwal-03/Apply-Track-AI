"use client";

import { useEffect, useState, useCallback } from "react";
import type { Application } from "@/types/application";

interface DashboardStats {
  total: number;
  notApplied: number;
  deadlinesThisWeek: number;
  needsReview: number;
  expired: number;
}

interface DashboardData {
  stats: DashboardStats;
  priorityDeadlines: Application[];
  recentActivity: Application[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
