import { Router } from 'express';
import { createLog, listLogs } from '../controllers/actionLogController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Logging actions is open to the authenticated frontend; reading logs requires auth
router.post(
  '/',
  validateBody({
    action: { type: 'string', required: true, minLength: 1, maxLength: 128 }
  }),
  createLog
);

router.get('/', requireAuth, listLogs);

export default router;

