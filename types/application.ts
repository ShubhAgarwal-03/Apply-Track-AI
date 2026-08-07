import type { Application as DBApplication } from "@/db/schema";

export type Status =
  | "not_applied"
  | "ready_to_apply"
  | "drafting"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "expired";

export type CompanyScale = "tier_1" | "tier_2" | "tier_3" | "tier_4" | "unknown";

export type SourceType = "text" | "pdf" | "image";

export interface Application extends DBApplication {
  daysLeft?: number | null;
}

export interface ApplicationFilters {
  status?: Status;
  companyScale?: CompanyScale;
  needsReview?: boolean;
  search?: string;
  sortBy?: "deadline" | "createdAt" | "companyName";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}