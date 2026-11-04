/**
 * NOVA Backend — Reminder Service
 * Handles reminder lifecycle, storage, and startup reconciliation of overdue reminders.
 */

import crypto from 'crypto';
import { query } from '../database/connection.js';
import { inMemoryReminders, parseDueAt } from '../tools/definitions/remindersTool.js';
import { recordActionLog } from './actionLogService.js';

export const ReminderService = {
  /**
   * Reconcile any reminders whose due_at timestamp is in the past but status is still 'pending'.
   * Executed on server startup to handle downtime and ensure accurate state.
   */
  async reconcileOverdueReminders() {
    let reconciledCount = 0;
    const now = new Date();

    try {
      const [result] = await query(
        "UPDATE reminders SET status = 'overdue', updated_at = NOW() WHERE status = 'pending' AND due_at < NOW()"
      );
      reconciledCount = result?.affectedRows || 0;
    } catch (e) {
      // In-memory fallback
      for (const [id, rem] of inMemoryReminders.entries()) {
        if (rem.status === 'pending') {
          const due = new Date(rem.dueAt);
          if (due.getTime() < now.getTime()) {
            rem.status = 'overdue';
            rem.updatedAt = now.toISOString();
            reconciledCount++;
          }
        }
      }
    }

    if (reconciledCount > 0) {
      console.log(`⏱️ Reconciled ${reconciledCount} overdue reminder(s) on startup.`);
      try {
        await recordActionLog({
          actionType: 'REMINDER_RECONCILIATION',
          details: {
            reconciledCount,
            timestamp: now.toISOString(),
            reason: 'Backend startup overdue reconciliation check'
          }
        });
      } catch (logErr) {
        // Non-blocking log failure
      }
    }

    return { reconciledCount };
  },

  /**
   * Create a new reminder.
   */
  async createReminder({ title, dueAt, priority = 'medium' }) {
    const id = crypto.randomUUID();
    const now = new Date();
    const parsedDate = parseDueAt(dueAt);
    if (!parsedDate) {
      throw new Error(`Invalid dueAt parameter: ${dueAt}`);
    }

    const status = parsedDate.getTime() <= now.getTime() ? 'overdue' : 'pending';
    const reminder = {
      id,
      title: title.trim(),
      dueAt: parsedDate.toISOString(),
      priority: priority.toLowerCase(),
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    try {
      await query(
        'INSERT INTO reminders (id, title, due_at, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, reminder.title, parsedDate, reminder.priority, reminder.status, now, now]
      );
    } catch (e) {
      inMemoryReminders.set(id, reminder);
    }

    return reminder;
  },

  /**
   * List reminders with status filter.
   */
  async listReminders({ status = 'pending', limit = 20 } = {}) {
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
    try {
      if (status === 'all') {
        const [rows] = await query(
          'SELECT id, title, due_at AS dueAt, priority, status, created_at AS createdAt FROM reminders ORDER BY due_at ASC LIMIT ?',
          [lim]
        );
        return rows;
      }
      const [rows] = await query(
        'SELECT id, title, due_at AS dueAt, priority, status, created_at AS createdAt FROM reminders WHERE status = ? ORDER BY due_at ASC LIMIT ?',
        [status, lim]
      );
      return rows;
    } catch (e) {
      const results = [];
      for (const item of inMemoryReminders.values()) {
        if (status === 'all' || item.status === status) {
          results.push(item);
          if (results.length >= lim) break;
        }
      }
      return results;
    }
  },

  /**
   * Cancel a reminder by ID.
   */
  async cancelReminder(reminderId) {
    const id = reminderId.trim();
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
      throw new Error(`Reminder '${id}' was not found or is already completed/cancelled.`);
    }

    return { cancelled: true, reminderId: id };
  },

  /**
   * Periodically check for due reminders, mark as delivered, and record to action log.
   */
  async checkDueReminders() {
    const now = new Date();
    const delivered = [];

    try {
      const [rows] = await query(
        "SELECT id, title, due_at AS dueAt, priority, status FROM reminders WHERE status = 'pending' AND due_at <= NOW()"
      );
      if (rows && rows.length > 0) {
        await query(
          "UPDATE reminders SET status = 'delivered', updated_at = NOW() WHERE status = 'pending' AND due_at <= NOW()"
        );
        delivered.push(...rows);
      }
    } catch (e) {
      for (const [id, rem] of inMemoryReminders.entries()) {
        if (rem.status === 'pending') {
          const due = new Date(rem.dueAt);
          if (due.getTime() <= now.getTime()) {
            rem.status = 'delivered';
            rem.updatedAt = now.toISOString();
            delivered.push(rem);
          }
        }
      }
    }

    for (const rem of delivered) {
      try {
        console.log(`🔔 Reminder Due: "${rem.title}" at ${now.toLocaleTimeString()}`);
        await recordActionLog({
          actionType: 'REMINDER_DELIVERED',
          details: {
            reminderId: rem.id,
            title: rem.title,
            dueAt: rem.dueAt,
            deliveredAt: now.toISOString()
          }
        });
      } catch (err) {}
    }

    return delivered;
  },

  /**
   * Start recurring background timer for delivery checks
   */
  startScheduler(intervalMs = 5000) {
    if (this._intervalId) return;
    this._intervalId = setInterval(async () => {
      try {
        await this.checkDueReminders();
      } catch (e) {}
    }, intervalMs);
    if (this._intervalId && this._intervalId.unref) {
      this._intervalId.unref();
    }
  },

  /**
   * Stop recurring timer
   */
  stopScheduler() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
};

