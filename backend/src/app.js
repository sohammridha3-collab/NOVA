/**
 * NOVA Backend — Express Application Setup
 */

import express from 'express';
import { requestIdMiddleware } from './middleware/requestId.js';
import { corsMiddleware } from './middleware/cors.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();

  // 1. Assign unique Request ID to each incoming request
  app.use(requestIdMiddleware);

  // 2. Restricted Cross-Origin Resource Sharing
  app.use(corsMiddleware);

  // 3. Request-size limit (1MB max payload)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Mount API Routes
  app.use('/api', apiRouter);

  // 5. 404 Route Not Found
  app.use(notFoundHandler);

  // 6. Centralized Error Handler
  app.use(errorHandler);

  return app;
}

