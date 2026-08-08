CREATE TYPE "public"."company_scale" AS ENUM('tier_1', 'tier_2', 'tier_3', 'tier_4', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('text', 'pdf', 'image');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('not_applied', 'ready_to_apply', 'drafting', 'applied', 'interviewing', 'offer', 'rejected', 'expired');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"role_title" text NOT NULL,
	"location" text,
	"company_scale" "company_scale" DEFAULT 'unknown',
	"cgpa_cutoff" numeric(3, 2),
	"deadline" date,
	"applied_on" date,
	"status" "status" DEFAULT 'not_applied' NOT NULL,
	"salary_min" numeric(12, 2),
	"salary_max" numeric(12, 2),
	"salary_currency" text DEFAULT 'USD',
	"salary_frequency" text,
	"jd_summary" text,
	"jd_original_text" text,
	"source_type" "source_type" DEFAULT 'text',
	"source_file_url" text,
	"needs_review" boolean DEFAULT false NOT NULL,
	"needs_review_reasons" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"graduation_batch" text,
	"branch" text,
	"degree" text,
	"cgpa" numeric(3, 2),
	"citizenship" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
