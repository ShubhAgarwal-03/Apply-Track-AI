import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/db/schema";
import { parseJobText } from "@/lib/gemini";
import { extractTextFromPdf } from "@/lib/pdf";
import { extractTextFromImage } from "@/lib/ocr"; // was: from "@/lib/vision"
import { checkEligibility } from "@/lib/eligibility";

export const runtime = "nodejs"; // pdf-parse requires the Node runtime, not edge
export const maxDuration = 10; // seconds — requires Vercel Pro plan; Hobby caps at 10s regardless

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;

    let rawText = "";
    let sourceType: "text" | "pdf" | "image" = "text";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.type === "application/pdf") {
        sourceType = "pdf";
        rawText = await extractTextFromPdf(buffer);
      } else if (file.type.startsWith("image/")) {
        sourceType = "image";
        rawText = await extractTextFromImage(buffer.toString("base64"));
      } else {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
      }
    } else if (text?.trim()) {
      sourceType = "text";
      rawText = text;
    } else {
      return NextResponse.json({ error: "No text or file provided" }, { status: 400 });
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Could not extract any readable text" },
        { status: 422 }
      );
    }

    const parsed = await parseJobText(rawText);
    const eligibility = await checkEligibility(parsed);

    const [created] = await db
      .insert(applications)
      .values({
        companyName: parsed.companyName ?? "Unknown Company",
        roleTitle: parsed.roleTitle ?? "Unknown Role",
        location: parsed.location ?? undefined,
        companyScale: parsed.companyScale ?? "unknown",
        cgpaCutoff: parsed.cgpaCutoff?.toString(),
        deadline: parsed.deadline ?? undefined,
        status: "ready_to_apply",
        salaryMin: parsed.salaryMin?.toString(),
        salaryMax: parsed.salaryMax?.toString(),
        salaryCurrency: parsed.salaryCurrency ?? undefined,
        salaryFrequency: parsed.salaryFrequency ?? undefined,
        jdSummary: parsed.jdSummary ?? undefined,
        jdOriginalText: rawText,
        sourceType,
        needsReview: eligibility.needsReview,
        needsReviewReasons: eligibility.needsReviewReasons,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error("Parse error:", err);
    const message = err instanceof Error ? err.message : "Failed to parse";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
