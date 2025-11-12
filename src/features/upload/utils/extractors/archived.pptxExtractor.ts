/**
 * PPTX Text Extraction
 * Extracts text content from PowerPoint presentations using officeparser
 */

import officeParser from "officeparser";

/**
 * Extracts text from a PPTX file
 * @param file - PPTX file to extract text from
 * @returns Extracted text or null if error
 */
export async function extractPptxText(file: File): Promise<string | null> {
  try {
    // officeparser can work with the file directlya
    const buffer = await file.arrayBuffer();
    const text = await officeParser.parseOfficeAsync(buffer);

    return text || null;
  } catch (error) {
    console.error("PPTX extraction error:", error);
    return null;
  }
}
