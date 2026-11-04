/**
 * NOVA Backend — Chat Routes
 */

import { Router } from 'express';
import { ChatController } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { usageLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Protected chat endpoints
router.post('/', requireAuth, usageLimiter, ChatController.sendMessage);
router.get('/status', requireAuth, ChatController.getStatus);

export default router;

