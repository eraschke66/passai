/**
 * Text Extraction Service
 * Coordinates all text extraction methods based on file type
 */

import { MaterialType } from "../../types/material.types";
import { MIN_TEXT_LENGTH } from "../../types/constants";
import { extractPdfText } from "./pdfExtractor";
import { extractDocxText } from "./docxExtractor";
import { extractPptxText } from "./pptxExtractor";
import { extractImageText } from "./imageExtractor";
import { extractTextFileContent } from "./textExtractor";

/**
 * Result of text extraction
 */
export interface ExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Extracts text from a file based on its material type
 * @param file - File to extract text from
 * @param materialType - Type of material
 * @param onProgress - Optional progress callback for OCR
 * @returns Extraction result with text or error
 */
export async function extractText(
  file: File,
  materialType: MaterialType,
  onProgress?: (progress: number) => void
): Promise<ExtractionResult> {
  try {
    let text: string | null = null;

    switch (materialType) {
      case MaterialType.PDF:
        text = await extractPdfText(file);
        break;

      case MaterialType.DOCX:
        text = await extractDocxText(file);
        break;

      case MaterialType.PPTX:
        text = await extractPptxText(file);
        break;

      case MaterialType.IMAGE:
        text = await extractImageText(file, onProgress);
        break;

      case MaterialType.TEXT:
        text = await extractTextFileContent(file);
        break;

      default:
        return {
          success: false,
          error: "Unsupported file type",
        };
    }

    // Check if extraction was successful
    if (!text) {
      return {
        success: false,
        error: "Could not extract text from file",
      };
    }

    // Clean the extracted text
    const cleanedText = cleanText(text);

    // Validate minimum length
    if (cleanedText.length < MIN_TEXT_LENGTH) {
      return {
        success: false,
        error: `Extracted text too short (minimum ${MIN_TEXT_LENGTH} characters)`,
      };
    }

    return {
      success: true,
      text: cleanedText,
    };
  } catch (error) {
    console.error("Text extraction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown extraction error",
    };
  }
}

/**
 * Cleans extracted text by removing extra whitespace and formatting
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  return (
    text
      // Remove multiple spaces
      .replace(/ {2,}/g, " ")
      // Remove multiple newlines (keep max 2)
      .replace(/\n{3,}/g, "\n\n")
      // Remove tabs
      .replace(/\t/g, " ")
      // Remove carriage returns
      .replace(/\r/g, "")
      // Trim whitespace from each line
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      // Final trim
      .trim()
  );
}

/**
 * Checks if extracted text is valid for quiz generation
 * @param text - Extracted text
 * @returns True if valid, false otherwise
 */
export function isValidExtractedText(text: string): boolean {
  if (!text || text.length < MIN_TEXT_LENGTH) {
    return false;
  }

  // Check if text contains mostly gibberish (OCR failure indicator)
  const words = text.split(/\s+/);
  const validWords = words.filter((word) => word.length >= 3);

  // At least 50% of words should be 3+ characters
  return validWords.length >= words.length * 0.5;
}
