/**
 * Image OCR Text Extraction
 * Extracts text from images using Tesseract.js
 */

import { createWorker } from "tesseract.js";

/**
 * Extracts text from an image file using OCR
 * @param file - Image file to extract text from
 * @param onProgress - Optional progress callback (0-100)
 * @returns Extracted text or null if error
 */
export async function extractImageText(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  let worker = null;

  try {
    // Create Tesseract worker
    worker = await createWorker("eng", undefined, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    // Perform OCR
    const { data } = await worker.recognize(file);

    await worker.terminate();

    return data.text || null;
  } catch (error) {
    console.error("OCR extraction error:", error);

    // Cleanup worker if it was created
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignore cleanup errors
      }
    }

    return null;
  }
}
