import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

/**
 * Extracts raw text from a base64 encoded PDF buffer.
 */
export async function extractTextFromPDFBase64(pdfBase64: string): Promise<string> {
  try {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const pdfData = await pdfParse(pdfBuffer);
    if (pdfData && pdfData.text) {
      return pdfData.text;
    }
    return '';
  } catch (err) {
    console.error('Failed to parse PDF on server:', err);
    return '';
  }
}
