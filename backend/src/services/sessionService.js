/**
 * NOVA Backend — Session Service
 * Manages conversation sessions using parameterized MySQL queries with in-memory fallback.
 */

import crypto from 'crypto';
import { query } from '../database/connection.js';

const inMemorySessions = new Map();

export async function createSession(title = 'New Neural Session') {
  const id = crypto.randomUUID();
  const now = new Date();

  const sessionObj = {
    id,
    title,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    messages: []
  };

  try {
    await query(
      'INSERT INTO sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [id, title, now, now]
    );
  } catch (e) {
    inMemorySessions.set(id, sessionObj);
  }

  return sessionObj;
}

export async function listSessions() {
  try {
    const [rows] = await query(`
      SELECT 
        s.id,
        s.title,
        s.created_at AS createdAt,
        s.updated_at AS updatedAt,
        COUNT(m.id) AS messageCount
      FROM sessions s
      LEFT JOIN messages m ON s.id = m.session_id
      GROUP BY s.id, s.title, s.created_at, s.updated_at
      ORDER BY s.updated_at DESC
    `);

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      messageCount: Number(r.messageCount)
    }));
  } catch (e) {
    return Array.from(inMemorySessions.values()).map(s => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages ? s.messages.length : 0
    }));
  }
}

export async function getSessionById(sessionId) {
  try {
    const [sessionRows] = await query(
      'SELECT id, title, created_at AS createdAt, updated_at AS updatedAt FROM sessions WHERE id = ?',
      [sessionId]
    );

    if (sessionRows.length === 0) {
      return inMemorySessions.get(sessionId) || null;
    }

    const session = sessionRows[0];

    const [messageRows] = await query(
      'SELECT id, session_id AS sessionId, role, content, simulated, created_at AS createdAt FROM messages WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    return {
      ...session,
      messages: messageRows.map(m => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role,
        content: m.content,
        simulated: Boolean(m.simulated),
        timestamp: m.createdAt
      }))
    };
  } catch (e) {
    return inMemorySessions.get(sessionId) || null;
  }
}

export async function updateSessionTitle(sessionId, newTitle) {
  const now = new Date();
  try {
    const [result] = await query(
      'UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?',
      [newTitle, now, sessionId]
    );

    if (result.affectedRows === 0) {
      const mem = inMemorySessions.get(sessionId);
      if (mem) {
        mem.title = newTitle;
        mem.updatedAt = now.toISOString();
        return mem;
      }
      return null;
    }

    return getSessionById(sessionId);
  } catch (e) {
    const mem = inMemorySessions.get(sessionId);
    if (mem) {
      mem.title = newTitle;
      mem.updatedAt = now.toISOString();
      return mem;
    }
    return null;
  }
}

export async function deleteSession(sessionId) {
  try {
    const [result] = await query(
      'DELETE FROM sessions WHERE id = ?',
      [sessionId]
    );
    return result.affectedRows > 0;
  } catch (e) {
    return inMemorySessions.delete(sessionId);
  }
}

export const SessionService = {
  createSession,
  listSessions,
  getSessionById,
  updateSessionTitle,
  deleteSession
};
