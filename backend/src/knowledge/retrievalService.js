/**
 * NOVA Backend — Replaceable Document Retrieval Layer
 * Implements a pluggable retriever contract with BM25 / token-overlap scoring,
 * section / page metadata mapping, and an in-memory index fallback for offline/test environments.
 */

import { query as dbQuery } from '../database/connection.js';

// In-memory index fallback for offline testing or when database is not connected
const inMemoryChunks = [];
const inMemoryDocs = new Map();

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your'
]);

/**
 * Base Retriever Interface Contract
 */
export class BaseRetriever {
  async indexDocument(docMetadata, chunks) {
    throw new Error('indexDocument must be implemented');
  }

  async removeDocument(documentId) {
    throw new Error('removeDocument must be implemented');
  }

  async search(queryText, options) {
    throw new Error('search must be implemented');
  }
}

/**
 * BM25 / Term-Frequency Weighted Retriever
 */
export class BM25KnowledgeRetriever extends BaseRetriever {
  constructor(k1 = 1.5, b = 0.75) {
    super();
    this.k1 = k1;
    this.b = b;
  }

  _tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  }

  async indexDocument(docMetadata, chunks) {
    inMemoryDocs.set(docMetadata.id, docMetadata);
    for (const chunk of chunks) {
      inMemoryChunks.push({
        ...chunk,
        documentId: docMetadata.id,
        originalName: docMetadata.originalName || docMetadata.filename,
        fileType: docMetadata.fileType
      });
    }
  }

  async removeDocument(documentId) {
    inMemoryDocs.delete(documentId);
    const initialLen = inMemoryChunks.length;
    for (let i = inMemoryChunks.length - 1; i >= 0; i--) {
      if (inMemoryChunks[i].documentId === documentId) {
        inMemoryChunks.splice(i, 1);
      }
    }
  }

  async search(queryText, options = {}) {
    const { topK = 4, documentId = null, minScore = 0.1 } = options;
    const queryTokens = this._tokenize(queryText);
    if (queryTokens.length === 0) return [];

    let candidateChunks = [];

    // Attempt to retrieve candidate chunks from MySQL
    try {
      let sql = `
        SELECT 
          c.id AS chunkId,
          c.document_id AS documentId,
          c.chunk_index AS chunkIndex,
          c.page_number AS pageNumber,
          c.section_title AS sectionTitle,
          c.content,
          d.original_name AS originalName,
          d.file_type AS fileType
        FROM document_chunks c
        JOIN documents d ON c.document_id = d.id
      `;
      const params = [];

      if (documentId) {
        sql += ' WHERE c.document_id = ?';
        params.push(documentId);
      }

      const [rows] = await dbQuery(sql, params);
      candidateChunks = rows;
    } catch (e) {
      // Use in-memory store if DB query fails or in test mode
      candidateChunks = inMemoryChunks.filter((c) => !documentId || c.documentId === documentId);
    }

    if (candidateChunks.length === 0) {
      // Fallback to in-memory if DB had 0 rows but in-memory has chunks
      candidateChunks = inMemoryChunks.filter((c) => !documentId || c.documentId === documentId);
    }

    if (candidateChunks.length === 0) return [];

    // Calculate average chunk length
    const totalLength = candidateChunks.reduce((acc, c) => acc + (c.content?.length || 0), 0);
    const avgLen = totalLength / candidateChunks.length || 1;

    // Document frequencies of query terms
    const df = {};
    for (const term of queryTokens) {
      df[term] = 0;
      for (const chunk of candidateChunks) {
        const textLower = (chunk.content || '').toLowerCase();
        if (textLower.includes(term)) {
          df[term]++;
        }
      }
    }

    const N = candidateChunks.length;
    const lowerQuery = queryText.toLowerCase().trim();

    // Score each chunk
    const scoredChunks = [];

    for (const chunk of candidateChunks) {
      const text = ((chunk.sectionTitle ? chunk.sectionTitle + '\n' : '') + (chunk.content || '')).trim();
      const textLower = text.toLowerCase();
      const chunkTokens = this._tokenize(text);
      const chunkLen = text.length;

      // Count term frequencies in this chunk
      const tf = {};
      for (const t of chunkTokens) {
        tf[t] = (tf[t] || 0) + 1;
      }

      let score = 0;
      for (const term of queryTokens) {
        const freq = tf[term] || 0;
        if (freq > 0) {
          // Standard BM25 IDF: ln(1 + (N - n + 0.5) / (n + 0.5))
          const n = df[term] || 1;
          const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
          // BM25 TF: (f * (k1 + 1)) / (f + k1 * (1 - b + b * (|D| / avgdl)))
          const bm25Tf = (freq * (this.k1 + 1)) / (freq + this.k1 * (1 - this.b + this.b * (chunkLen / avgLen)));
          score += Math.max(0.1, idf) * bm25Tf;
        }
      }

      // Bonus 1: Exact phrase occurrence
      if (lowerQuery.length > 4 && textLower.includes(lowerQuery)) {
        score += 3.5;
      }

      // Bonus 2: Section title or filename matches (applied only when there is content relevance)
      if (score > 0) {
        const titleTokens = this._tokenize(`${chunk.sectionTitle || ''} ${chunk.originalName || ''}`);
        for (const term of queryTokens) {
          if (titleTokens.includes(term)) {
            score += 1.2;
          }
        }
      }

      if (score >= minScore) {
        scoredChunks.push({
          chunkId: chunk.chunkId || chunk.id,
          documentId: chunk.documentId,
          originalName: chunk.originalName,
          fileType: chunk.fileType,
          pageNumber: chunk.pageNumber || 1,
          sectionTitle: chunk.sectionTitle || `Page ${chunk.pageNumber || 1}`,
          content: chunk.content,
          score: Math.round(score * 100) / 100
        });
      }
    }

    // Sort by descending score
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
  }
}

// Global active retriever instance (replaceable)
let activeRetriever = new BM25KnowledgeRetriever();

/**
 * Replace the active knowledge retriever with a custom implementation
 * (e.g. Vector embeddings or semantic hybrid search).
 */
export function setKnowledgeRetriever(retriever) {
  if (!retriever || typeof retriever.search !== 'function') {
    throw new Error('Invalid retriever: must implement search() method.');
  }
  activeRetriever = retriever;
}

export function getActiveRetriever() {
  return activeRetriever;
}

/**
 * High-level search function called by tools and controllers.
 */
export async function queryKnowledge(queryText, options = {}) {
  return await activeRetriever.search(queryText, options);
}

/**
 * Register document in active retriever.
 */
export async function indexDocumentInRetriever(docMetadata, chunks) {
  await activeRetriever.indexDocument(docMetadata, chunks);
}

/**
 * Remove document from active retriever.
 */
export async function removeDocumentFromRetriever(documentId) {
  await activeRetriever.removeDocument(documentId);
}

/**
 * For testing and memory inspection
 */
export function getInMemoryKnowledgeStore() {
  return {
    docs: Array.from(inMemoryDocs.values()),
    chunks: inMemoryChunks
  };
}

export function clearInMemoryKnowledgeStore() {
  inMemoryDocs.clear();
  inMemoryChunks.length = 0;
}

