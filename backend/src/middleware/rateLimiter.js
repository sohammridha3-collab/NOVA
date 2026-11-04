/**
 * NOVA Backend — Usage Limit Middleware
 * Enforces USAGE_LIMIT_MAX_REQUESTS_PER_MINUTE to prevent abuse or budget overruns.
 */

import { config } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

const requestCounts = new Map();

// Periodic cleanup every 60 seconds (unref'd so it does not block process exit)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.startTime > 60000) {
      requestCounts.delete(key);
    }
  }
}, 30000);
if (cleanupTimer.unref) cleanupTimer.unref();

export function usageLimiter(req, res, next) {
  const maxReq = config.ai.maxRequestsPerMinute || 30;
  const ip = req.ip || req.connection.remoteAddress || 'localhost';
  const now = Date.now();

  let record = requestCounts.get(ip);
  if (!record || now - record.startTime > 60000) {
    record = { startTime: now, count: 1 };
    requestCounts.set(ip, record);
    return next();
  }

  record.count++;
  if (record.count > maxReq) {
    const retryAfter = Math.ceil((60000 - (now - record.startTime)) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return errorResponse(
      res,
      `Rate limit exceeded. Maximum ${maxReq} requests per minute allowed. Please wait ${retryAfter}s.`,
      429,
      'USAGE_LIMIT_EXCEEDED',
      { limit: maxReq, retryAfterSeconds: retryAfter }
    );
  }

  next();
}

/**
 * Reset helper for testing
 */
export function resetUsageLimits() {
  requestCounts.clear();
}
