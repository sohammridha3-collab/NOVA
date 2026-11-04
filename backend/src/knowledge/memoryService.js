/**
 * NOVA Backend — Personal Memories & Explicit Preferences Service
 * Persists, updates, and deletes explicit user memories and preferences.
 * Provides full CRUD operations and in-memory fallback for test/offline environments.
 */

import crypto from 'crypto';
import { query as dbQuery } from '../database/connection.js';

// In-memory fallback map for offline / test environments
const inMemoryMemories = new Map();

/**
 * Validates memory fields
 */
function validateMemoryInput(data = {}) {
  const { category = 'general', keyName, valueText } = data;
  if (!keyName || typeof keyName !== 'string' || keyName.trim().length === 0) {
    const err = new Error("Parameter 'keyName' is required.");
    err.status = 400;
    err.code = 'INVALID_KEY_NAME';
    throw err;
  }
  if (!valueText || typeof valueText !== 'string' || valueText.trim().length === 0) {
    const err = new Error("Parameter 'valueText' is required.");
    err.status = 400;
    err.code = 'INVALID_VALUE_TEXT';
    throw err;
  }
  return {
    category: (category || 'general').trim().toLowerCase(),
    keyName: keyName.trim(),
    valueText: valueText.trim()
  };
}

/**
 * Save / create a new explicit memory
 */
export async function createMemory(data) {
  const validated = validateMemoryInput(data);
  const id = crypto.randomUUID();
  const now = new Date();

  const record = {
    id,
    category: validated.category,
    keyName: validated.keyName,
    valueText: validated.valueText,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  try {
    await dbQuery(
      `INSERT INTO memories (id, category, key_name, value_text, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, record.category, record.keyName, record.valueText, 1, now, now]
    );
  } catch (e) {
    // In-memory fallback
    inMemoryMemories.set(id, record);
  }

  // Also maintain in-memory copy
  inMemoryMemories.set(id, record);

  return record;
}

/**
 * List all memories, optionally filtered by category
 */
export async function listMemories(category = null, onlyActive = true) {
  try {
    let sql = `
      SELECT 
        id,
        category,
        key_name AS keyName,
        value_text AS valueText,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM memories
    `;
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category.toLowerCase());
    }
    if (onlyActive) {
      conditions.push('is_active = 1');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await dbQuery(sql, params);
    if (rows && rows.length > 0) return rows;
  } catch (e) {}

  // Fallback to in-memory
  const list = Array.from(inMemoryMemories.values());
  return list.filter((m) => {
    if (category && m.category !== category.toLowerCase()) return false;
    if (onlyActive && !m.isActive) return false;
    return true;
  });
}

/**
 * Get single memory by ID
 */
export async function getMemoryById(id) {
  try {
    const [rows] = await dbQuery(
      `SELECT 
        id,
        category,
        key_name AS keyName,
        value_text AS valueText,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM memories WHERE id = ?`,
      [id]
    );
    if (rows.length > 0) return rows[0];
  } catch (e) {}

  return inMemoryMemories.get(id) || null;
}

/**
 * Update an existing memory
 */
export async function updateMemory(id, data = {}) {
  const existing = await getMemoryById(id);
  if (!existing) {
    const err = new Error(`Memory with ID '${id}' not found.`);
    err.status = 404;
    err.code = 'MEMORY_NOT_FOUND';
    throw err;
  }

  const updatedCategory = (data.category !== undefined ? data.category : existing.category).toLowerCase().trim();
  const updatedKey = data.keyName !== undefined ? data.keyName.trim() : existing.keyName;
  const updatedValue = data.valueText !== undefined ? data.valueText.trim() : existing.valueText;
  const updatedIsActive = data.isActive !== undefined ? Boolean(data.isActive) : Boolean(existing.isActive);
  const now = new Date();

  const record = {
    id,
    category: updatedCategory,
    keyName: updatedKey,
    valueText: updatedValue,
    isActive: updatedIsActive,
    createdAt: existing.createdAt,
    updatedAt: now.toISOString()
  };

  try {
    await dbQuery(
      `UPDATE memories 
       SET category = ?, key_name = ?, value_text = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [updatedCategory, updatedKey, updatedValue, updatedIsActive ? 1 : 0, now, id]
    );
  } catch (e) {}

  inMemoryMemories.set(id, record);

  return record;
}

/**
 * Delete a memory by ID
 */
export async function deleteMemory(id) {
  const existing = await getMemoryById(id);
  if (!existing) {
    const err = new Error(`Memory with ID '${id}' not found.`);
    err.status = 404;
    err.code = 'MEMORY_NOT_FOUND';
    throw err;
  }

  try {
    await dbQuery('DELETE FROM memories WHERE id = ?', [id]);
  } catch (e) {}

  inMemoryMemories.delete(id);

  return {
    deleted: true,
    id,
    keyName: existing.keyName
  };
}

/**
 * Search active memories by keyword
 */
export async function searchMemories(keyword) {
  if (!keyword || typeof keyword !== 'string') return [];
  const lower = keyword.toLowerCase().trim();
  const all = await listMemories(null, true);
  return all.filter((m) =>
    m.keyName.toLowerCase().includes(lower) ||
    m.valueText.toLowerCase().includes(lower) ||
    m.category.toLowerCase().includes(lower)
  );
}

/**
 * Clear memory cache for testing
 */
export function clearInMemoryMemories() {
  inMemoryMemories.clear();
}

