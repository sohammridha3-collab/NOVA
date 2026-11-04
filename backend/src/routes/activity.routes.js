/**
 * NOVA Backend — Activity Timeline API Routes
 */

import { Router } from 'express';
import { getTimeline } from '../controllers/activityController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/timeline', getTimeline);

export default router;
