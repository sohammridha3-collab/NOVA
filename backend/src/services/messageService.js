/**
 * NOVA Backend — Message Service
 * Manages message persistence and retrieval for conversation sessions.
 */

import crypto from 'crypto';
import { query } from '../database/connection.js';

const inMemoryMessages = new Map();

/**
 * Generate intelligent non-streaming response for Stage 1.
 */
function generateAssistantReply(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('restaurant') || p.includes('aura') || p.includes('michelin')) {
    return `### NOVA Architecture Blueprint: AURA Digital Experience\n\n` +
      `**Concept Overview:** A minimalist multi-sensory website designed for Michelin-star dining.\n\n` +
      `#### System Specifications:\n` +
      `- **Visual Language:** Obsidian charcoal, warm champagne (#e2d9cc), and titanium glass.\n` +
      `- **Reservation Engine:** Low-latency inventory locking with optimistic queue verification.\n` +
      `- **Interactive Sequence:** Procedural 3D wine cellar visualization and curated tasting menu carousel.\n\n` +
      `\`\`\`json\n{\n  "service": "AURA_RESERVATION_API",\n  "status": "ready",\n  "capacity": 24,\n  "nextSeating": "19:30 UTC"\n}\n\`\`\``;
  }

  return `### NOVA Neural Core Response\n\n` +
    `Received operational command: **"${prompt.slice(0, 60)}..."**\n\n` +
    `Backend Stage 2 architecture online. Tool execution and AI conversation system ready.`;
}

export async function addMessage(sessionId, roleOrOptions, contentArg = null, simulatedArg = false) {
  let role = 'user';
  let content = '';
  let simulated = false;

  if (typeof roleOrOptions === 'object' && roleOrOptions !== null) {
    role = roleOrOptions.role || 'user';
    content = roleOrOptions.content || '';
    simulated = Boolean(roleOrOptions.simulated);
  } else {
    role = roleOrOptions || 'user';
    content = contentArg || '';
    simulated = Boolean(simulatedArg);
  }

  const msgId = crypto.randomUUID();
  const now = new Date();

  const msgRecord = {
    id: msgId,
    sessionId,
    role,
    content,
    simulated,
    timestamp: now.toISOString(),
    createdAt: now.toISOString()
  };

  try {
    await query(
      'INSERT INTO messages (id, session_id, role, content, simulated, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [msgId, sessionId, role, content, simulated, now]
    );

    // Auto-update session title if it's the first message
    if (role === 'user') {
      const autoTitle = content.trim().slice(0, 48) + (content.length > 48 ? '...' : '');
      await query("UPDATE sessions SET title = ?, updated_at = ? WHERE id = ? AND title LIKE 'New %'", [autoTitle, now, sessionId]).catch(() => {});
    }
  } catch (e) {
    // In-memory fallback
    if (!inMemoryMessages.has(sessionId)) {
      inMemoryMessages.set(sessionId, []);
    }
    inMemoryMessages.get(sessionId).push(msgRecord);
  }

  // If called via the Stage 1 legacy signature (where user message triggered auto assistant message)
  if (typeof roleOrOptions === 'object' && role === 'user') {
    const replyContent = generateAssistantReply(content);
    const assistantMsgId = crypto.randomUUID();
    const replyTime = new Date(Date.now() + 100);

    const assistantMsg = {
      id: assistantMsgId,
      sessionId,
      role: 'assistant',
      content: replyContent,
      simulated: true,
      timestamp: replyTime.toISOString()
    };

    try {
      await query(
        'INSERT INTO messages (id, session_id, role, content, simulated, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [assistantMsgId, sessionId, 'assistant', replyContent, true, replyTime]
      );
    } catch (e) {
      inMemoryMessages.get(sessionId).push(assistantMsg);
    }

    return {
      userMessage: msgRecord,
      assistantMessage: assistantMsg
    };
  }

  return msgRecord;
}

export async function listMessagesBySession(sessionId) {
  try {
    const [rows] = await query(
      'SELECT id, session_id AS sessionId, role, content, simulated, created_at AS timestamp FROM messages WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    return rows.map(r => ({
      id: r.id,
      sessionId: r.sessionId,
      role: r.role,
      content: r.content,
      simulated: Boolean(r.simulated),
      timestamp: r.timestamp
    }));
  } catch (e) {
    return inMemoryMessages.get(sessionId) || [];
  }
}

export const MessageService = {
  addMessage,
  listMessagesBySession,
  getMessages: listMessagesBySession
};
