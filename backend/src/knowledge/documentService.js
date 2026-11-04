/**
 * NOVA Backend — Document Management Service
 * Manages original document uploads, local file storage, text extraction,
 * indexing into MySQL and active retrieval layer, and clean deletion.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { query as dbQuery } from '../database/connection.js';
import {
  validateDocumentFile,
  extractDocumentText,
  chunkDocumentSections
} from './documentExtractor.js';
import {
  indexDocumentInRetriever,
  removeDocumentFromRetriever,
  getInMemoryKnowledgeStore
} from './retrievalService.js';

/**
 * Ensure storage directory exists safely
 */
function ensureStorageDirectory() {
  const dir = path.resolve(config.knowledge.documentsDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Ingests an uploaded document file:
 * 1. Validates format
 * 2. Writes original to configured storage directory
 * 3. Extracts text and chunks
 * 4. Stores metadata and passages in MySQL
 * 5. Indexes in replaceable retrieval layer
 */
export async function ingestDocument(fileBuffer, originalFilename, mimeType) {
  const validation = validateDocumentFile({
    originalname: originalFilename,
    mimetype: mimeType
  });

  if (!validation.valid) {
    const err = new Error(validation.error);
    err.status = 400;
    err.code = 'INVALID_DOCUMENT_FORMAT';
    throw err;
  }

  const storageDir = ensureStorageDirectory();
  const docId = crypto.randomUUID();
  const fileExt = `.${validation.extension}`;
  const safeStorageName = `${docId}_${Date.now()}${fileExt}`;
  const absoluteStoragePath = path.join(storageDir, safeStorageName);

  // 1. Write original file to disk
  fs.writeFileSync(absoluteStoragePath, fileBuffer);

  try {
    // 2. Extract text and sections
    const extraction = await extractDocumentText(fileBuffer, validation.extension, originalFilename);

    // 3. Chunk sections into retrieval passages
    const rawChunks = chunkDocumentSections(
      extraction.sections,
      config.knowledge.maxChunkSize,
      config.knowledge.chunkOverlap
    );

    const docMetadata = {
      id: docId,
      filename: safeStorageName,
      originalName: originalFilename,
      fileType: validation.extension,
      fileSize: fileBuffer.length,
      pageCount: extraction.pageCount,
      chunkCount: rawChunks.length,
      storagePath: absoluteStoragePath,
      createdAt: new Date().toISOString()
    };

    // 4. Save to MySQL or fallback
    try {
      await dbQuery(
        `INSERT INTO documents 
          (id, filename, original_name, file_type, file_size, page_count, chunk_count, storage_path, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          docId,
          safeStorageName,
          originalFilename,
          validation.extension,
          fileBuffer.length,
          extraction.pageCount,
          rawChunks.length,
          absoluteStoragePath
        ]
      );

      // Insert chunks in bulk
      for (const chunk of rawChunks) {
        const chunkId = crypto.randomUUID();
        await dbQuery(
          `INSERT INTO document_chunks 
            (id, document_id, chunk_index, page_number, section_title, content, token_count, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            chunkId,
            docId,
            chunk.chunkIndex,
            chunk.pageNumber,
            chunk.sectionTitle,
            chunk.content,
            chunk.tokenCount
          ]
        );
      }
    } catch (dbErr) {
      // In-memory fallback if DB is offline or in test mode
      console.warn('[NOVA Knowledge] MySQL offline or error, persisting document to in-memory fallback store:', dbErr.message);
    }

    // 5. Index in active retriever
    const preparedChunks = rawChunks.map((c) => ({
      id: crypto.randomUUID(),
      chunkIndex: c.chunkIndex,
      pageNumber: c.pageNumber,
      sectionTitle: c.sectionTitle,
      content: c.content,
      tokenCount: c.tokenCount
    }));

    await indexDocumentInRetriever(docMetadata, preparedChunks);

    return {
      documentId: docId,
      originalName: originalFilename,
      fileType: validation.extension,
      fileSize: fileBuffer.length,
      pageCount: extraction.pageCount,
      chunkCount: rawChunks.length,
      createdAt: docMetadata.createdAt
    };
  } catch (err) {
    // Clean up file if processing failed
    if (fs.existsSync(absoluteStoragePath)) {
      try {
        fs.unlinkSync(absoluteStoragePath);
      } catch (cleanupErr) {}
    }
    throw err;
  }
}

/**
 * List all documents with metadata
 */
export async function listDocuments() {
  try {
    const [rows] = await dbQuery(`
      SELECT 
        id,
        filename,
        original_name AS originalName,
        file_type AS fileType,
        file_size AS fileSize,
        page_count AS pageCount,
        chunk_count AS chunkCount,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM documents
      ORDER BY created_at DESC
    `);
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback to in-memory
  }

  const { docs } = getInMemoryKnowledgeStore();
  return docs.map((d) => ({
    id: d.id,
    filename: d.filename,
    originalName: d.originalName,
    fileType: d.fileType,
    fileSize: d.fileSize,
    pageCount: d.pageCount,
    chunkCount: d.chunkCount,
    createdAt: d.createdAt,
    updatedAt: d.createdAt
  }));
}

/**
 * Get document details by ID
 */
export async function getDocumentById(documentId) {
  try {
    const [rows] = await dbQuery(
      `SELECT 
        id,
        filename,
        original_name AS originalName,
        file_type AS fileType,
        file_size AS fileSize,
        page_count AS pageCount,
        chunk_count AS chunkCount,
        storage_path AS storagePath,
        created_at AS createdAt
       FROM documents WHERE id = ?`,
      [documentId]
    );
    if (rows.length > 0) return rows[0];
  } catch (e) {}

  const { docs } = getInMemoryKnowledgeStore();
  const found = docs.find((d) => d.id === documentId);
  return found || null;
}

/**
 * Delete a document and its chunks from disk and database
 */
export async function deleteDocument(documentId) {
  const doc = await getDocumentById(documentId);
  if (!doc) {
    const err = new Error(`Document with ID '${documentId}' not found.`);
    err.status = 404;
    err.code = 'DOCUMENT_NOT_FOUND';
    throw err;
  }

  // 1. Remove original file from disk if present
  if (doc.storagePath && fs.existsSync(doc.storagePath)) {
    try {
      fs.unlinkSync(doc.storagePath);
    } catch (e) {
      console.warn('[NOVA Knowledge] Could not remove file on disk:', e.message);
    }
  }

  // 2. Remove from MySQL
  try {
    await dbQuery('DELETE FROM documents WHERE id = ?', [documentId]);
  } catch (e) {}

  // 3. Remove from retrieval index
  await removeDocumentFromRetriever(documentId);

  return {
    deleted: true,
    documentId,
    originalName: doc.originalName
  };
}

