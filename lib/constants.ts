export const STATUS_OPTIONS = [
  { value: "not_applied", label: "Not Applied", color: "gray" },
  { value: "ready_to_apply", label: "Ready to Apply", color: "blue" },
  { value: "drafting", label: "Drafting", color: "purple" },
  { value: "applied", label: "Applied", color: "green" },
  { value: "interviewing", label: "Interviewing", color: "amber" },
  { value: "offer", label: "Offer", color: "emerald" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "expired", label: "Expired", color: "slate" },
] as const;

export const COMPANY_SCALE_OPTIONS = [
  { value: "tier_1", label: "Tier 1" },
  { value: "tier_2", label: "Tier 2" },
  { value: "tier_3", label: "Tier 3" },
  { value: "tier_4", label: "Tier 4" },
  { value: "unknown", label: "Unknown" },
] as const;

export const SOURCE_TYPE_OPTIONS = ["text", "pdf", "image"] as const;

export const DEADLINE_URGENCY = {
  OVERDUE: "overdue",
  TODAY: "today",
  SOON: "soon", // <= 3 days
  UPCOMING: "upcoming",
  FAR: "far",
} as const;