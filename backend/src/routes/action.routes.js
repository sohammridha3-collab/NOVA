/**
 * NOVA Backend — Action Routes
 */

import { Router } from 'express';
import { ActionController } from '../controllers/actionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, ActionController.listActions);
router.get('/:id', requireAuth, ActionController.getAction);
router.post('/:id/confirm', requireAuth, ActionController.confirmAction);
router.post('/:id/cancel', requireAuth, ActionController.cancelAction);

export default router;

