/**
 * NOVA Backend — Request ID Middleware
 * Generates and assigns a unique UUID identifier to each incoming request
 * and propagates it in the X-Request-Id response header.
 */

import crypto from 'crypto';

export function requestIdMiddleware(req, res, next) {
  const incomingId = req.header('X-Request-Id');
  req.id = incomingId && incomingId.length <= 64 ? incomingId : `req_${crypto.randomUUID()}`;
  res.setHeader('X-Request-Id', req.id);
  next();
}

