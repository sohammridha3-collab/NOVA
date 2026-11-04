import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.post(
  '/login',
  validateBody({
    username: { type: 'string', required: true, minLength: 1 },
    password: { type: 'string', required: true, minLength: 1 }
  }),
  login
);

router.get('/me', requireAuth, getMe);

export default router;

