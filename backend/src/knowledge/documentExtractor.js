/**
 * NOVA Backend — Document Text Extractor & Chunking Engine
 * Validates, extracts, and chunks PDF, TXT, and Markdown documents.
 * Preserves page numbers and section headers for accurate citation.
 */

import path from 'path';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt', '.md']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/octet-stream' // Some browsers send markdown or plain text as octet-stream
]);

/**
 * Validates whether an uploaded file is a supported document format.
 */
export function validateDocumentFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const ext = path.extname(file.originalname || file.name || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Unsupported file type: '${ext}'. Only PDF (.pdf), TXT (.txt), and Markdown (.md) are supported.`
    };
  }

  const mime = (file.mimetype || '').toLowerCase();
  if (mime && !ALLOWED_MIME_TYPES.has(mime) && !mime.startsWith('text/')) {
    return {
      valid: false,
      error: `Invalid MIME type '${mime}' for file '${file.originalname}'.`
    };
  }

  return { valid: true, extension: ext.slice(1) };
}

/**
 * Extracts raw pages/sections and structured text from document buffer.
 */
export async function extractDocumentText(buffer, fileType = '', originalName = '') {
  const normType = (fileType || '').toLowerCase().replace('.', '');
  const ext = (originalName ? originalName.split('.').pop() : '').toLowerCase();

  if (normType === 'pdf' || normType === 'application/pdf' || ext === 'pdf') {
    return await extractPdfText(buffer);
  } else if (normType === 'md' || normType === 'markdown' || normType === 'text/markdown' || ext === 'md') {
    return extractMarkdownText(buffer.toString('utf-8'), originalName);
  } else if (normType === 'txt' || normType === 'text/plain' || ext === 'txt') {
    return extractPlainText(buffer.toString('utf-8'), originalName);
  }

  throw new Error(`Unsupported document extractor for type: ${fileType || originalName}`);
}

/**
 * Extracts text from PDF with page-accurate markers using pdf-parse.
 */
async function extractPdfText(buffer) {
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return {
      pageCount: result.total,
      fullText: result.text,
      sections: result.pages.filter(page => page.text.trim()).map(page => ({
        pageNumber: page.num, sectionTitle: `Page ${page.num}`, text: page.text.trim()
      }))
    };
  } finally {
    await parser.destroy();
  }
}

/**
 * Extracts text from Markdown, dividing by headings.
 */
function extractMarkdownText(markdownStr, originalName) {
  const lines = markdownStr.split('\n');
  const sections = [];
  let currentTitle = originalName || 'Overview';
  let currentBuffer = [];
  let pageCounter = 1;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      if (currentBuffer.length > 0) {
        sections.push({
          pageNumber: pageCounter,
          sectionTitle: currentTitle,
          text: currentBuffer.join('\n').trim()
        });
        currentBuffer = [];
        pageCounter++;
      }
      currentTitle = headingMatch[2].trim();
    } else {
      currentBuffer.push(line);
    }
  }

  if (currentBuffer.length > 0) {
    sections.push({
      pageNumber: pageCounter,
      sectionTitle: currentTitle,
      text: currentBuffer.join('\n').trim()
    });
  }

  const validSections = sections.filter((s) => s.text.length > 0);
  return {
    pageCount: Math.max(1, validSections.length),
    sections: validSections.length > 0 ? validSections : [{ pageNumber: 1, sectionTitle: 'General', text: markdownStr.trim() }],
    fullText: markdownStr
  };
}

/**
 * Extracts text from Plain Text, segmenting by double newlines into virtual pages.
 */
function extractPlainText(plainStr, originalName) {
  const paragraphs = plainStr.split(/\n\s*\n+/);
  const sections = [];
  let pageCounter = 1;
  let currentChunk = [];
  let currentLen = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    currentChunk.push(trimmed);
    currentLen += trimmed.length;

    // Every ~1500 chars represents roughly one virtual page of reading
    if (currentLen > 1500) {
      sections.push({
        pageNumber: pageCounter,
        sectionTitle: `Section ${pageCounter}`,
        text: currentChunk.join('\n\n')
      });
      pageCounter++;
      currentChunk = [];
      currentLen = 0;
    }
  }

  if (currentChunk.length > 0) {
    sections.push({
      pageNumber: pageCounter,
      sectionTitle: `Section ${pageCounter}`,
      text: currentChunk.join('\n\n')
    });
  }

  const validSections = sections.filter((s) => s.text.length > 0);
  return {
    pageCount: Math.max(1, validSections.length),
    sections: validSections.length > 0 ? validSections : [{ pageNumber: 1, sectionTitle: 'Document Body', text: plainStr.trim() }],
    fullText: plainStr
  };
}

/**
 * Chunks extracted document sections into indexed passages with overlap.
 * @param {Array} sections - Extracted sections with { pageNumber, sectionTitle, text }
 * @param {number} maxChunkSize - Target max length in characters
 * @param {number} chunkOverlap - Overlap length between consecutive chunks
 */
export function chunkDocumentSections(sections, maxChunkSize = 600, chunkOverlap = 100) {
  const chunks = [];
  let chunkIndex = 0;

  for (const sec of sections) {
    const text = sec.text;
    if (!text || text.length === 0) continue;

    if (text.length <= maxChunkSize) {
      chunks.push({
        chunkIndex: chunkIndex++,
        pageNumber: sec.pageNumber || 1,
        sectionTitle: sec.sectionTitle || 'General',
        content: text,
        tokenCount: Math.ceil(text.length / 4)
      });
      continue;
    }

    // Split text into sliding chunks
    let start = 0;
    while (start < text.length) {
      let end = start + maxChunkSize;
      if (end < text.length) {
        // Try to break at a sentence or line boundary if nearby
        const nextBreak = text.lastIndexOf('\n', end);
        const nextPeriod = text.lastIndexOf('. ', end);
        const breakPoint = Math.max(nextBreak, nextPeriod);
        if (breakPoint > start + maxChunkSize * 0.6) {
          end = breakPoint + (nextPeriod === breakPoint ? 2 : 1);
        }
      } else {
        end = text.length;
      }

      const chunkContent = text.slice(start, end).trim();
      if (chunkContent.length > 0) {
        chunks.push({
          chunkIndex: chunkIndex++,
          pageNumber: sec.pageNumber || 1,
          sectionTitle: sec.sectionTitle || 'General',
          content: chunkContent,
          tokenCount: Math.ceil(chunkContent.length / 4)
        });
      }

      if (end >= text.length) break;
      start = end - chunkOverlap;
    }
  }

  return chunks;
}

