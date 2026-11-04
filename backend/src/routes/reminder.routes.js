/**
 * NOVA Backend — Reminder Routes
 */

import { Router } from 'express';
import { ReminderController } from '../controllers/reminderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, ReminderController.listReminders);
router.post('/', requireAuth, ReminderController.createReminder);
router.delete('/:id', requireAuth, ReminderController.cancelReminder);

export default router;

