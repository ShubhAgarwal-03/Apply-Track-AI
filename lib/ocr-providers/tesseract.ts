import { createWorker } from "tesseract.js";

export async function extractTextFromImageTesseract(base64Image: string): Promise<string> {
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(`data:image/png;base64,${base64Image}`);

    if (!text.trim()) {
      throw new Error("No text detected in image");
    }

    return text;
  } finally {
    await worker.terminate();
  }
}
