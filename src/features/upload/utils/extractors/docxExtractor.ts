/**
 * DOCX Text Extraction
 * Extracts text content from Word documents using mammoth
 */

import mammoth from "mammoth";

/**
 * Extracts text from a DOCX file
 * @param file - DOCX file to extract text from
 * @returns Extracted text or null if error
 */
export async function extractDocxText(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    return result.value || null;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return null;
  }
}
