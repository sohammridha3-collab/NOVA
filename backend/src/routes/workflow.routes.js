/**
 * NOVA Backend — Workflows API Routes
 */

import { Router } from 'express';
import {
  getWorkflows,
  createCustomWorkflow,
  proposeWorkflowRun,
  executeWorkflow,
  getRuns,
  getRun,
  resumeRun,
  cancelRun
} from '../controllers/workflowController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getWorkflows);
router.post('/', createCustomWorkflow);
router.get('/runs', getRuns);
router.get('/runs/:runId', getRun);
router.post('/runs/:runId/resume', resumeRun);
router.post('/runs/:runId/cancel', cancelRun);
router.get('/:id/propose', proposeWorkflowRun);
router.post('/:id/run', executeWorkflow);

export default router;
