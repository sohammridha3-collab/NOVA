import { Router } from 'express';
import { getHealth, getReadiness, testAiConnection } from '../controllers/healthController.js';

const router = Router();

router.get('/', getHealth);
router.get('/ready', getReadiness);
router.get('/ai', testAiConnection);

export default router;

