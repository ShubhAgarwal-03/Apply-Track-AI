"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/db/schema";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();
      setProfile(json.data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(updates: Partial<UserProfile>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          cgpa: updates.cgpa != null ? Number(updates.cgpa) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const json = await res.json();
      setProfile(json.data);
      return true;
    } catch {
      setError("Failed to save profile");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { profile, loading, saving, error, save, refetch: load };
}
