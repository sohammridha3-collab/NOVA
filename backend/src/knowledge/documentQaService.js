/**
 * NOVA Backend — Document Question Answering Service
 * Formulates answers using retrieved passages with filename and page references.
 * Strictly distinguishes document-supported answers from general knowledge.
 */

import { queryKnowledge } from './retrievalService.js';
import { listDocuments } from './documentService.js';

/**
 * Answers a user query against personal indexed knowledge.
 * @param {string} queryText - User's question or search query
 * @param {Object} options - { topK, documentId, threshold }
 */
export async function answerDocumentQuestion(queryText, options = {}) {
  const { topK = 4, documentId = null, threshold = 0.25 } = options;

  if (!queryText || typeof queryText !== 'string' || queryText.trim().length === 0) {
    const err = new Error('Query string is required.');
    err.status = 400;
    err.code = 'INVALID_QUERY';
    throw err;
  }

  // 1. Check if we have any indexed documents at all
  const allDocs = await listDocuments();
  if (allDocs.length === 0) {
    return {
      query: queryText,
      sourceType: 'general_knowledge',
      isDocumentSupported: false,
      answer: 'No personal documents have been indexed yet. Upload PDF, TXT, or Markdown documents in the Knowledge Library to enable grounded document retrieval.',
      citations: [],
      retrievedPassagesCount: 0
    };
  }

  // 2. Query retrieval layer
  const passages = await queryKnowledge(queryText, {
    topK,
    documentId,
    minScore: 0.1
  });

  // 3. Evaluate relevance threshold
  const topScore = passages.length > 0 ? passages[0].score : 0;
  const isDocumentSupported = passages.length > 0 && topScore >= threshold;

  if (!isDocumentSupported) {
    return {
      query: queryText,
      sourceType: 'general_knowledge',
      isDocumentSupported: false,
      answer: `I searched your indexed personal documents (${allDocs.length} available), but found no relevant passages matching "${queryText}". The following response is provided from general knowledge rather than your personal files.`,
      citations: [],
      retrievedPassagesCount: passages.length
    };
  }

  // 4. Extract citations with filename, page numbers, and exact snippets
  const citations = passages.map((p) => ({
    documentId: p.documentId,
    filename: p.originalName,
    page: p.pageNumber || 1,
    section: p.sectionTitle || `Page ${p.pageNumber || 1}`,
    relevanceScore: p.score,
    snippet: p.content.length > 220 ? p.content.slice(0, 220) + '...' : p.content
  }));

  // Format synthesized answer using the best matching passage
  const primaryPassage = passages[0];
  const pageRef = primaryPassage.pageNumber ? `page ${primaryPassage.pageNumber}` : 'the document';
  const synthesizedAnswer = `According to **${primaryPassage.originalName}** (${pageRef}):\n\n"${primaryPassage.content.trim()}"`;

  return {
    query: queryText,
    sourceType: 'document_supported',
    isDocumentSupported: true,
    answer: synthesizedAnswer,
    citations,
    retrievedPassagesCount: passages.length,
    topMatch: {
      filename: primaryPassage.originalName,
      pageNumber: primaryPassage.pageNumber,
      score: primaryPassage.score
    }
  };
}

