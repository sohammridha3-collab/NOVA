/**
 * NOVA Backend — Knowledge & Personal Memories Controller
 * Exposes document ingestion, citation querying, and memory CRUD endpoints.
 */

import {
  ingestDocument,
  listDocuments,
  getDocumentById,
  deleteDocument
} from '../knowledge/documentService.js';
import { answerDocumentQuestion } from '../knowledge/documentQaService.js';
import {
  createMemory,
  listMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
  searchMemories
} from '../knowledge/memoryService.js';
import { successResponse } from '../utils/response.js';

/**
 * Handle document upload and indexing
 */
export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('No document file was uploaded. Please attach a .pdf, .txt, or .md file.');
      err.status = 400;
      err.code = 'FILE_REQUIRED';
      throw err;
    }

    const result = await ingestDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * List all indexed documents
 */
export async function getDocuments(req, res, next) {
  try {
    const docs = await listDocuments();
    return successResponse(res, {
      count: docs.length,
      documents: docs
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single document details
 */
export async function getDocument(req, res, next) {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) {
      const err = new Error(`Document '${req.params.id}' not found.`);
      err.status = 404;
      err.code = 'DOCUMENT_NOT_FOUND';
      throw err;
    }
    return successResponse(res, doc);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a document and purge from retrieval index
 */
export async function deleteDoc(req, res, next) {
  try {
    const result = await deleteDocument(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Query document knowledge with citations and general knowledge distinction
 */
export async function queryDocKnowledge(req, res, next) {
  try {
    const { query: queryText, topK, documentId } = req.body;
    const result = await answerDocumentQuestion(queryText, {
      topK: topK ? parseInt(topK, 10) : 4,
      documentId
    });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * List personal memories
 */
export async function getMemories(req, res, next) {
  try {
    const { category, search } = req.query;
    if (search) {
      const results = await searchMemories(search);
      return successResponse(res, { count: results.length, memories: results });
    }
    const memories = await listMemories(category);
    return successResponse(res, {
      count: memories.length,
      memories
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new personal memory
 */
export async function createMem(req, res, next) {
  try {
    const record = await createMemory(req.body);
    return successResponse(res, record, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing memory
 */
export async function updateMem(req, res, next) {
  try {
    const updated = await updateMemory(req.params.id, req.body);
    return successResponse(res, updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a personal memory
 */
export async function deleteMem(req, res, next) {
  try {
    const result = await deleteMemory(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
