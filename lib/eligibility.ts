import { db } from "@/lib/db";
import { userProfile } from "@/db/schema";
import type { ParsedJob } from "@/lib/gemini";

interface EligibilityResult {
  needsReview: boolean;
  needsReviewReasons: string[];
}

export async function checkEligibility(parsed: ParsedJob): Promise<EligibilityResult> {
  const reasons: string[] = [];

  if (!parsed.companyName) reasons.push("Company name could not be determined");
  if (!parsed.roleTitle) reasons.push("Role / title could not be determined confidently");
  if (!parsed.deadline) reasons.push("Application deadline could not be found");
  if (parsed.salaryMin == null && parsed.salaryMax == null)
    reasons.push("Salary information is missing");
  if (!parsed.companyScale || parsed.companyScale === "unknown")
    reasons.push("Company scale / tier is unclear");

  const [profile] = await db.select().from(userProfile).limit(1);

  if (profile?.cgpa != null && parsed.cgpaCutoff != null) {
    const userCgpa = parseFloat(profile.cgpa);
    if (parsed.cgpaCutoff > userCgpa) {
      reasons.push(
        `CGPA cutoff (${parsed.cgpaCutoff}) is above your CGPA (${userCgpa})`
      );
    }
  }

  return { needsReview: reasons.length > 0, needsReviewReasons: reasons };
}
