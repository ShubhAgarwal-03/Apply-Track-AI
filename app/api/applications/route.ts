import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/db/schema";
import { and, desc, asc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
  companyName: z.string().min(1),
  roleTitle: z.string().min(1),
  location: z.string().optional(),
  companyScale: z
    .enum(["tier_1", "tier_2", "tier_3", "tier_4", "unknown"])
    .optional(),
  cgpaCutoff: z.number().optional(),
  deadline: z.string().optional(), // ISO date string
  appliedOn: z.string().optional(),
  status: z
    .enum([
      "not_applied",
      "ready_to_apply",
      "drafting",
      "applied",
      "interviewing",
      "offer",
      "rejected",
      "expired",
    ])
    .optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  salaryFrequency: z.string().optional(),
  jdSummary: z.string().optional(),
  jdOriginalText: z.string().optional(),
  sourceType: z.enum(["text", "pdf", "image"]).optional(),
  sourceFileUrl: z.string().optional(),
  needsReview: z.boolean().optional(),
  needsReviewReasons: z.array(z.string()).optional(),
});

// GET /api/applications?status=applied&companyScale=tier_1&needsReview=true&search=acme&sortBy=deadline&sortDir=asc&page=1&pageSize=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const companyScale = searchParams.get("companyScale");
  const needsReview = searchParams.get("needsReview");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "deadline";
  const sortDir = searchParams.get("sortDir") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const conditions = [];

  if (status) conditions.push(eq(applications.status, status as any));
  if (companyScale)
    conditions.push(eq(applications.companyScale, companyScale as any));
  if (needsReview !== null && needsReview !== undefined && needsReview !== "")
    conditions.push(eq(applications.needsReview, needsReview === "true"));
  if (search) {
    conditions.push(
      or(
        ilike(applications.companyName, `%${search}%`),
        ilike(applications.roleTitle, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const sortColumnMap = {
    deadline: applications.deadline,
    createdAt: applications.createdAt,
    companyName: applications.companyName,
  } as const;
  const sortColumn =
    sortColumnMap[sortBy as keyof typeof sortColumnMap] ??
    applications.deadline;
  const orderFn = sortDir === "desc" ? desc : asc;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(applications)
      .where(whereClause),
  ]);

  return NextResponse.json({
    data: rows,
    pagination: { page, pageSize, total: count },
  });
}

// POST /api/applications
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(applications)
    .values({
      ...parsed.data,
      cgpaCutoff: parsed.data.cgpaCutoff?.toString(),
      salaryMin: parsed.data.salaryMin?.toString(),
      salaryMax: parsed.data.salaryMax?.toString(),
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}