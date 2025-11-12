/**
 * Text File Reading
 * Reads plain text files
 */

/**
 * Reads text from a plain text file
 * @param file - Text file to read
 * @returns Text content or null if error
 */
export async function extractTextFileContent(
  file: File
): Promise<string | null> {
  try {
    const text = await file.text();
    return text || null;
  } catch (error) {
    console.error("Text file reading error:", error);
    return null;
  }
}
