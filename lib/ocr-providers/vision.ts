export async function extractTextFromImageVision(base64Image: string): Promise<string> {
  const apiKey = process.env.GOOGLE_VISION_KEY;
  if (!apiKey) throw new Error("GOOGLE_VISION_KEY not configured");

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Vision API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.responses?.[0]?.fullTextAnnotation?.text;
  if (!text) throw new Error("No text detected in image");
  return text;
}
