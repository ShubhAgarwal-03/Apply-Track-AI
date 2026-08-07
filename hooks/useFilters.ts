"use client";

import { useState, useCallback } from "react";
import type { ApplicationFilters } from "@/types/application";

export function useFilters(initial: ApplicationFilters = {}) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    pageSize: 20,
    sortBy: "deadline",
    sortDir: "asc",
    ...initial,
  });

  const updateFilter = useCallback(
    <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 1 }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({ page: 1, pageSize: 20, sortBy: "deadline", sortDir: "asc" });
  }, []);

  return { filters, updateFilter, clearFilters, setFilters };
}