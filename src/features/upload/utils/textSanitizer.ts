/**
 * Text Sanitization Utilities
 * Cleans extracted text to be compatible with PostgreSQL TEXT type
 */

/**
 * Sanitizes text for PostgreSQL storage by removing problematic characters
 * @param text - Raw extracted text
 * @returns Sanitized text safe for PostgreSQL TEXT columns
 */
export function sanitizeTextForDatabase(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove null bytes (U+0000) - PostgreSQL TEXT doesn't support them
      // eslint-disable-next-line no-control-regex
      .replace(/\u0000/g, "")
      // Remove other problematic control characters (except newlines, tabs, carriage returns)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
      // Remove zero-width characters that might cause issues
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Normalize whitespace - replace multiple spaces with single space
      .replace(/[ \t]+/g, " ")
      // Normalize multiple newlines to maximum of 2
      .replace(/\n{3,}/g, "\n\n")
      // Trim leading/trailing whitespace
      .trim()
  );
}

/**
 * Validates that text meets minimum content requirements
 * @param text - Sanitized text
 * @param minLength - Minimum character length (default: 50)
 * @returns True if text meets requirements
 */
export function isValidTextContent(
  text: string,
  minLength: number = 50
): boolean {
  if (!text) return false;

  const cleanText = text.trim();
  return cleanText.length >= minLength;
}

/**
 * Sanitizes and validates text in one operation
 * @param text - Raw extracted text
 * @param minLength - Minimum character length (default: 50)
 * @returns Object with sanitized text and validation result
 */
export function sanitizeAndValidate(
  text: string,
  minLength: number = 50
): { text: string; isValid: boolean } {
  const sanitized = sanitizeTextForDatabase(text);
  const isValid = isValidTextContent(sanitized, minLength);

  return {
    text: sanitized,
    isValid,
  };
}
