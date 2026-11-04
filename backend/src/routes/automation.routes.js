/**
 * NOVA Backend — Automation Routes
 * GET /api/automation/status
 * GET /api/automation/capabilities
 * POST /api/automation/execute
 */

import { Router } from 'express';
import { AutomationController } from '../controllers/automationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Status and capabilities can be queried publicly or with auth
router.get('/status', AutomationController.getStatus);
router.get('/capabilities', AutomationController.getCapabilities);

// Execution requires single-owner authentication
router.post('/execute', requireAuth, AutomationController.execute);

export default router;
