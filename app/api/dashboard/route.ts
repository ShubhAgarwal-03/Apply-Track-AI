import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/db/schema";
import { and, asc, desc, eq, gte, lte, ne, sql } from "drizzle-orm";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const todayStr = today.toISOString().slice(0, 10);
  const weekStr = weekFromNow.toISOString().slice(0, 10);

  const [
    [{ total }],
    [{ notApplied }],
    [{ deadlinesThisWeek }],
    [{ needsReview }],
    [{ expired }],
    priorityDeadlines,
    recentActivity,
  ] = await Promise.all([
    db.select({ total: sql<number>`count(*)::int` }).from(applications),

    db
      .select({ notApplied: sql<number>`count(*)::int` })
      .from(applications)
      .where(eq(applications.status, "not_applied")),

    db
      .select({ deadlinesThisWeek: sql<number>`count(*)::int` })
      .from(applications)
      .where(
        and(
          gte(applications.deadline, todayStr),
          lte(applications.deadline, weekStr)
        )
      ),

    db
      .select({ needsReview: sql<number>`count(*)::int` })
      .from(applications)
      .where(eq(applications.needsReview, true)),

    db
      .select({ expired: sql<number>`count(*)::int` })
      .from(applications)
      .where(eq(applications.status, "expired")),

    // Priority deadlines: closest upcoming deadlines, excluding terminal states
    db
      .select()
      .from(applications)
      .where(
        and(
          gte(applications.deadline, todayStr),
          ne(applications.status, "rejected"),
          ne(applications.status, "expired")
        )
      )
      .orderBy(asc(applications.deadline))
      .limit(5),

    // Recent activity: most recently touched applications
    db
      .select()
      .from(applications)
      .orderBy(desc(applications.updatedAt))
      .limit(5),
  ]);

  return NextResponse.json({
    stats: {
      total,
      notApplied,
      deadlinesThisWeek,
      needsReview,
      expired,
    },
    priorityDeadlines,
    recentActivity,
  });
}
