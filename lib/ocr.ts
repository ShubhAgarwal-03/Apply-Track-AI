import { extractTextFromImageTesseract } from "@/lib/ocr-providers/tesseract";
import { extractTextFromImageVision } from "@/lib/ocr-providers/vision";

type OcrProvider = "tesseract" | "vision";

const ACTIVE_PROVIDER: OcrProvider =
  (process.env.OCR_PROVIDER as OcrProvider) || "tesseract";

export async function extractTextFromImage(base64Image: string): Promise<string> {
  if (ACTIVE_PROVIDER === "vision") {
    return extractTextFromImageVision(base64Image);
  }
  return extractTextFromImageTesseract(base64Image);
}
