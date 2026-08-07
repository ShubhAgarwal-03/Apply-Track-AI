import { z } from "zod";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const parsedJobSchema = z.object({
  companyName: z.string().nullable(),
  roleTitle: z.string().nullable(),
  location: z.string().nullable(),
  companyScale: z
    .enum(["tier_1", "tier_2", "tier_3", "tier_4", "unknown"])
    .nullable(),
  cgpaCutoff: z.number().nullable(),
  deadline: z.string().nullable(), // YYYY-MM-DD
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  salaryCurrency: z.string().nullable(),
  salaryFrequency: z.string().nullable(),
  jdSummary: z.string().nullable(),
});

export type ParsedJob = z.infer<typeof parsedJobSchema>;

function buildPrompt(rawText: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `You are a job-application data extractor. Read the job posting or recruiter email below and return ONLY valid JSON (no markdown fences, no preamble, no trailing commentary) matching exactly this shape:

{
  "companyName": string|null,
  "roleTitle": string|null,
  "location": string|null,
  "companyScale": "tier_1"|"tier_2"|"tier_3"|"tier_4"|"unknown"|null,
  "cgpaCutoff": number|null,
  "deadline": "YYYY-MM-DD"|null,
  "salaryMin": number|null,
  "salaryMax": number|null,
  "salaryCurrency": string|null,
  "salaryFrequency": "annually"|"monthly"|"hourly"|null,
  "jdSummary": string|null
}

Rules:
- companyScale: tier_1 = large, globally recognized companies (big tech, top banks/consulting); tier_2 = large established companies; tier_3 = mid-size or growth-stage; tier_4 = small startup or unclear scale; unknown if you truly cannot tell.
- deadline must resolve to an absolute ISO date. Resolve relative phrases like "in 2 weeks" using today's date: ${today}.
- jdSummary: a plain-language 2-3 sentence summary of the role.
- If a field cannot be found in the text, use null. Never guess or fabricate a value.

Text to extract from:
"""
${rawText}
"""`;
}

export async function parseJobText(rawText: string): Promise<ParsedJob> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(rawText) }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
  const errText = await res.text();
  if (res.status === 429) {
    throw new Error("Gemini rate limit hit — wait a minute and try again.");
  }
  throw new Error(`Gemini API error (${res.status}): ${errText}`);
}

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");

  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  let raw: unknown;
  try {
    raw = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini response was not valid JSON");
  }

  return parsedJobSchema.parse(raw);
}
