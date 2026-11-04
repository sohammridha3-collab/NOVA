/**
 * NOVA Backend — Reminder Controller
 */

import { ReminderService } from '../services/reminderService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const ReminderController = {
  async listReminders(req, res, next) {
    try {
      const { status, limit } = req.query;
      const reminders = await ReminderService.listReminders({ status, limit });
      return successResponse(res, reminders);
    } catch (err) {
      next(err);
    }
  },

  async createReminder(req, res, next) {
    try {
      const { title, dueAt, priority } = req.body;
      if (!title || !dueAt) {
        return errorResponse(res, "Fields 'title' and 'dueAt' are required.", 400, 'INVALID_INPUT');
      }
      const reminder = await ReminderService.createReminder({ title, dueAt, priority });
      return successResponse(res, reminder, 201);
    } catch (err) {
      next(err);
    }
  },

  async cancelReminder(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ReminderService.cancelReminder(id);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
};

