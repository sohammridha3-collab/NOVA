/**
 * NOVA Backend — Document Text Extractor & Chunking Engine
 * Validates, extracts, and chunks PDF, TXT, and Markdown documents.
 * Preserves page numbers and section headers for accurate citation.
 */

import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

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
export async function extractDocumentText(buffer, fileType, originalName = '') {
  const normType = fileType.toLowerCase().replace('.', '');

  if (normType === 'pdf') {
    return await extractPdfText(buffer);
  } else if (normType === 'md' || normType === 'markdown') {
    return extractMarkdownText(buffer.toString('utf-8'), originalName);
  } else if (normType === 'txt') {
    return extractPlainText(buffer.toString('utf-8'), originalName);
  }

  throw new Error(`Unsupported document extractor for type: ${normType}`);
}

/**
 * Extracts text from PDF with page-accurate markers using pdf-parse.
 */
async function extractPdfText(buffer) {
  // Custom pagerender to inject page-number boundary delimiters
  const pageRender = (pageData) => {
    return pageData.getTextContent().then((textContent) => {
      let lastY, text = '';
      for (const item of textContent.items) {
        if (lastY == null || lastY === item.transform[5]) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }
      const pageNum = pageData.pageIndex + 1;
      return `\n[[NOVA_PAGE_${pageNum}]]\n` + text;
    });
  };

  const parsed = await pdfParse(buffer, { pagerender: pageRender });
  const rawText = parsed.text || '';
  const totalPages = parsed.numpages || 1;

  // Split into page sections based on delimiter
  const pageRegex = /\[\[NOVA_PAGE_(\d+)\]\]/g;
  const sections = [];
  let match;
  let lastIndex = 0;
  let currentPage = 1;

  while ((match = pageRegex.exec(rawText)) !== null) {
    if (sections.length > 0) {
      sections[sections.length - 1].text = rawText.slice(lastIndex, match.index).trim();
    }
    currentPage = parseInt(match[1], 10);
    lastIndex = match.index + match[0].length;
    sections.push({ pageNumber: currentPage, sectionTitle: `Page ${currentPage}`, text: '' });
  }

  if (sections.length > 0) {
    sections[sections.length - 1].text = rawText.slice(lastIndex).trim();
  } else {
    // Delimiter wasn't found (fallback)
    sections.push({ pageNumber: 1, sectionTitle: 'Page 1', text: rawText.trim() });
  }

  return {
    pageCount: totalPages,
    sections: sections.filter((s) => s.text.length > 0),
    fullText: rawText
  };
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
