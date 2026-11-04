/**
 * NOVA Backend — Central API Router
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import sessionRoutes from './session.routes.js';
import preferenceRoutes from './preference.routes.js';
import actionLogRoutes from './actionLog.routes.js';
import chatRoutes from './chat.routes.js';
import actionRoutes from './action.routes.js';
import reminderRoutes from './reminder.routes.js';
import notesRoutes from './notes.routes.js';
import voiceRoutes from './voice.routes.js';
import automationRoutes from './automation.routes.js';
import deviceRoutes from './device.routes.js';
import knowledgeRoutes from './knowledge.routes.js';
import workflowRoutes from './workflow.routes.js';
import activityRoutes from './activity.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/sessions', sessionRoutes);
apiRouter.use('/preferences', preferenceRoutes);
apiRouter.use('/action-logs', actionLogRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/actions', actionRoutes);
apiRouter.use('/reminders', reminderRoutes);
apiRouter.use('/notes', notesRoutes);
apiRouter.use('/voice', voiceRoutes);
apiRouter.use('/automation', automationRoutes);
apiRouter.use('/devices', deviceRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);
apiRouter.use('/workflows', workflowRoutes);
apiRouter.use('/activity', activityRoutes);

export default apiRouter;
