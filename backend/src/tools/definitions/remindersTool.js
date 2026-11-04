/**
 * NOVA Backend — Reminders Tools Definition
 * Handles creating, listing, and cancelling scheduled reminders.
 * Cancelling a reminder is destructive and requires operator confirmation.
 */

import crypto from 'crypto';
import { query } from '../../database/connection.js';

// In-memory fallback for offline/unit-test environments
export const inMemoryReminders = new Map();

/**
 * Parse a dueAt string into a valid Date object.
 * Supports ISO-8601 strings and relative formats (e.g., "+10m", "+2h", "+1d").
 */
export function parseDueAt(dueAtStr) {
  if (!dueAtStr || typeof dueAtStr !== 'string') return null;

  const trimmed = dueAtStr.trim();

  // Relative offset match e.g. "+15m", "+2h", "+1d", "in 10 minutes"
  const relMatch = trimmed.match(/^(?:\+|in\s+)?(\d+)\s*(m|min|minute|minutes|h|hr|hour|hours|d|day|days|s|sec|second|seconds)$/i);
  if (relMatch) {
    const amount = parseInt(relMatch[1], 10);
    const unit = relMatch[2].toLowerCase();
    const now = Date.now();
    let ms = 0;
    if (unit.startsWith('s')) ms = amount * 1000;
    else if (unit.startsWith('m')) ms = amount * 60 * 1000;
    else if (unit.startsWith('h')) ms = amount * 60 * 60 * 1000;
    else if (unit.startsWith('d')) ms = amount * 24 * 60 * 60 * 1000;
    return new Date(now + ms);
  }

  // Natural clock time e.g. "6 PM", "6:00 PM", "18:00"
  const cleanTime = trimmed.replace(/\.$/, '').trim();
  const timeOfDayMatch = cleanTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (timeOfDayMatch && (timeOfDayMatch[3] || timeOfDayMatch[2])) {
    let hours = parseInt(timeOfDayMatch[1], 10);
    const minutes = parseInt(timeOfDayMatch[2] || '0', 10);
    const meridian = timeOfDayMatch[3]?.toLowerCase();
    if (meridian === 'pm' && hours < 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() <= Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  // ISO or standard date format
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return null;
}

export const createReminderTool = {
  name: 'createReminder',
  description: 'Create and schedule a new reminder with a title, due time/date, and optional priority.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['title', 'dueAt'],
    properties: {
      title: {
        type: 'string',
        description: 'Short title or description of what to be reminded about.',
        minLength: 1,
        maxLength: 255
      },
      dueAt: {
        type: 'string',
        description: 'ISO-8601 datetime string (e.g. "2026-11-04T12:00:00Z") or relative string (e.g. "+30m", "+2h", "+1d").'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        description: 'Priority level of the reminder. Defaults to "medium".'
      }
    }
  },
  validate(args = {}) {
    if (!args.title || typeof args.title !== 'string' || args.title.trim().length === 0) {
      return { valid: false, error: "Parameter 'title' is required and must be a non-empty string." };
    }
    if (!args.dueAt || typeof args.dueAt !== 'string') {
      return { valid: false, error: "Parameter 'dueAt' is required and must be an ISO datetime or relative string." };
    }
    const parsedDate = parseDueAt(args.dueAt);
    if (!parsedDate) {
      return { valid: false, error: `Invalid date format for 'dueAt': "${args.dueAt}". Use ISO-8601 or relative format like "+15m", "+2h".` };
    }
    if (args.priority && !['low', 'medium', 'high'].includes(args.priority.toLowerCase())) {
      return { valid: false, error: "Parameter 'priority' must be 'low', 'medium', or 'high'." };
    }
    return { valid: true };
  },
  async execute(args) {
    const id = crypto.randomUUID();
    const title = args.title.trim();
    const dueAtDate = parseDueAt(args.dueAt);
    const priority = (args.priority || 'medium').toLowerCase();
    const now = new Date();
    const status = dueAtDate.getTime() <= now.getTime() ? 'overdue' : 'pending';

    const reminder = {
      id,
      title,
      dueAt: dueAtDate.toISOString(),
      priority,
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    try {
      await query(
        'INSERT INTO reminders (id, title, due_at, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, title, dueAtDate, priority, status, now, now]
      );
    } catch (e) {
      // DB fallback
      inMemoryReminders.set(id, reminder);
    }

    return {
      reminderId: id,
      title,
      dueAt: reminder.dueAt,
      priority,
      status,
      scheduled: true
    };
  }
};

export const listRemindersTool = {
  name: 'listReminders',
  description: 'List reminders filtered by status (pending, overdue, completed, cancelled, or all).',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'overdue', 'completed', 'cancelled', 'all'],
        description: 'Filter status. Defaults to "pending".'
      },
      limit: {
        type: 'number',
        description: 'Max reminders to return (1-50). Defaults to 20.'
      }
    }
  },
  validate(args = {}) {
    const validStatuses = ['pending', 'overdue', 'completed', 'cancelled', 'all'];
    if (args.status && !validStatuses.includes(args.status.toLowerCase())) {
      return { valid: false, error: `Invalid status: '${args.status}'. Must be one of: ${validStatuses.join(', ')}` };
    }
    return { valid: true };
  },
  async execute(args = {}) {
    const status = (args.status || 'pending').toLowerCase();
    const limit = Math.min(Math.max(parseInt(args.limit, 10) || 20, 1), 50);

    let reminders = [];

    try {
      if (status === 'all') {
        const [rows] = await query(
          'SELECT id, title, due_at AS dueAt, priority, status, created_at AS createdAt FROM reminders ORDER BY due_at ASC LIMIT ?',
          [limit]
        );
        reminders = rows;
      } else {
        const [rows] = await query(
          'SELECT id, title, due_at AS dueAt, priority, status, created_at AS createdAt FROM reminders WHERE status = ? ORDER BY due_at ASC LIMIT ?',
          [status, limit]
        );
        reminders = rows;
      }
    } catch (e) {
      // In-memory fallback
      for (const item of inMemoryReminders.values()) {
        if (status === 'all' || item.status === status) {
          reminders.push(item);
          if (reminders.length >= limit) break;
        }
      }
    }

    return {
      filterStatus: status,
      total: reminders.length,
      dataType: 'untrusted_user_stored_data',
      reminders
    };
  }
};

export const cancelReminderTool = {
  name: 'cancelReminder',
  description: 'Cancel a pending or scheduled reminder by ID. Destructive action requiring operator confirmation.',
  requiresConfirmation: true, // DESTRUCTIVE: operator confirmation required!
  parameters: {
    type: 'object',
    required: ['reminderId'],
    properties: {
      reminderId: {
        type: 'string',
        description: 'The unique UUID of the reminder to cancel.',
        minLength: 1
      }
    }
  },
  validate(args = {}) {
    if (!args.reminderId || typeof args.reminderId !== 'string' || args.reminderId.trim().length === 0) {
      return { valid: false, error: "Parameter 'reminderId' is required and must be a non-empty string." };
    }
    return { valid: true };
  },
  async execute(args) {
    const id = args.reminderId.trim();
    let updated = false;

    try {
      const [res] = await query(
        "UPDATE reminders SET status = 'cancelled', updated_at = NOW() WHERE id = ? AND status IN ('pending', 'overdue')",
        [id]
      );
      updated = res.affectedRows > 0;
    } catch (e) {
      const item = inMemoryReminders.get(id);
      if (item && (item.status === 'pending' || item.status === 'overdue')) {
        item.status = 'cancelled';
        item.updatedAt = new Date().toISOString();
        updated = true;
      }
    }

    if (!updated) {
      throw new Error(`Reminder with ID '${id}' was not found or is already completed/cancelled.`);
    }

    return {
      cancelled: true,
      reminderId: id,
      message: `Reminder '${id}' has been cancelled.`
    };
  }
};

