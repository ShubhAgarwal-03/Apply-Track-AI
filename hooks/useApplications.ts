"use client";

import { useCallback, useEffect, useState } from "react";
import type { Application, ApplicationFilters } from "@/types/application";

interface UseApplicationsResult {
  data: Application[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function buildQuery(filters: ApplicationFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.companyScale) params.set("companyScale", filters.companyScale);
  if (filters.needsReview !== undefined)
    params.set("needsReview", String(filters.needsReview));
  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDir) params.set("sortDir", filters.sortDir);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  return params.toString();
}

export function useApplications(filters: ApplicationFilters = {}): UseApplicationsResult {
  const [data, setData] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQuery(filters);
      const res = await fetch(`/api/applications${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to load applications");
      const json = await res.json();
      setData(json.data);
      setTotal(json.pagination?.total ?? json.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), nonce]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    total,
    loading,
    error,
    refetch: () => setNonce((n) => n + 1),
  };
}