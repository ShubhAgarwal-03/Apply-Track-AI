import {
  pgTable,
  uuid,
  text,
  numeric,
  date,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const companyScaleEnum = pgEnum("company_scale", [
  "tier_1",
  "tier_2",
  "tier_3",
  "tier_4",
  "unknown",
]);

export const statusEnum = pgEnum("status", [
  "not_applied",
  "ready_to_apply",
  "drafting",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "expired",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "text",
  "pdf",
  "image",
]);

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),

  companyName: text("company_name").notNull(),
  roleTitle: text("role_title").notNull(),
  location: text("location"),

  companyScale: companyScaleEnum("company_scale").default("unknown"),
  cgpaCutoff: numeric("cgpa_cutoff", { precision: 3, scale: 2 }),

  deadline: date("deadline"),
  appliedOn: date("applied_on"),
  status: statusEnum("status").default("not_applied").notNull(),

  salaryMin: numeric("salary_min", { precision: 12, scale: 2 }),
  salaryMax: numeric("salary_max", { precision: 12, scale: 2 }),
  salaryCurrency: text("salary_currency").default("USD"),
  salaryFrequency: text("salary_frequency"), // annually, monthly, etc.

  jdSummary: text("jd_summary"),
  jdOriginalText: text("jd_original_text"),
  sourceType: sourceTypeEnum("source_type").default("text"),
  sourceFileUrl: text("source_file_url"),

  needsReview: boolean("needs_review").default(false).notNull(),
  needsReviewReasons: jsonb("needs_review_reasons").$type<string[]>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfile = pgTable("user_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  graduationBatch: text("graduation_batch"),
  branch: text("branch"),
  degree: text("degree"),
  cgpa: numeric("cgpa", { precision: 3, scale: 2 }),
  citizenship: text("citizenship"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type UserProfile = typeof userProfile.$inferSelect;