/**
 * PDF Text Extraction
 * Extracts text content from PDF files using pdfjs-dist
 */

import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extracts text from a PDF file
 * @param file - PDF file to extract text from
 * @returns Extracted text or null if error
 */
export async function extractPdfText(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items from the page
      const pageText = textContent.items
        .map((item) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");

      if (pageText.trim()) {
        textParts.push(pageText);
      }
    }

    return textParts.join("\n\n");
  } catch (error) {
    console.error("PDF extraction error:", error);
    return null;
  }
}
