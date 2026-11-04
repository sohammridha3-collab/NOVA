import { Router } from 'express';
import {
  createSession,
  listSessions,
  getSession,
  updateSession,
  deleteSession
} from '../controllers/sessionController.js';
import {
  addMessage,
  listMessages
} from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// All session & message operations are protected by single-owner authentication
router.use(requireAuth);

router.post(
  '/',
  validateBody({
    title: { type: 'string', maxLength: 255 }
  }),
  createSession
);

router.get('/', listSessions);
router.get('/:id', getSession);

router.patch(
  '/:id',
  validateBody({
    title: { type: 'string', required: true, minLength: 1, maxLength: 255 }
  }),
  updateSession
);

router.delete('/:id', deleteSession);

// Nested message routes
router.post(
  '/:sessionId/messages',
  validateBody({
    content: { type: 'string', required: true, minLength: 1 },
    role: { type: 'string', enum: ['user', 'assistant', 'system'] }
  }),
  addMessage
);

router.get('/:sessionId/messages', listMessages);

export default router;

