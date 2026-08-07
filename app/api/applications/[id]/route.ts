import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  companyName: z.string().optional(),
  roleTitle: z.string().optional(),
  location: z.string().optional(),
  companyScale: z
    .enum(["tier_1", "tier_2", "tier_3", "tier_4", "unknown"])
    .optional(),
  cgpaCutoff: z.number().optional(),
  deadline: z.string().optional(),
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
  needsReview: z.boolean().optional(),
  needsReviewReasons: z.array(z.string()).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [row] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id));

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: row });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(applications)
    .set({
      ...parsed.data,
      cgpaCutoff: parsed.data.cgpaCutoff?.toString(),
      salaryMin: parsed.data.salaryMin?.toString(),
      salaryMax: parsed.data.salaryMax?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(applications.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [deleted] = await db
    .delete(applications)
    .where(eq(applications.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: deleted });
}