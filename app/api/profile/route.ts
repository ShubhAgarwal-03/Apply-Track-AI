import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userProfile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().optional(),
  graduationBatch: z.string().optional(),
  branch: z.string().optional(),
  degree: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  citizenship: z.string().optional(),
});

// Single-tenant: always operate on the one profile row, creating it if missing.
async function getOrCreateProfile() {
  const [existing] = await db.select().from(userProfile).limit(1);
  if (existing) return existing;

  const [created] = await db.insert(userProfile).values({}).returning();
  return created;
}

export async function GET() {
  const profile = await getOrCreateProfile();
  return NextResponse.json({ data: profile });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await getOrCreateProfile();

  const [updated] = await db
    .update(userProfile)
    .set({
      ...parsed.data,
      cgpa: parsed.data.cgpa?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(userProfile.id, profile.id))
    .returning();

  return NextResponse.json({ data: updated });
}
