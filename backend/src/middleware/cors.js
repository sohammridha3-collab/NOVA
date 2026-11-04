/**
 * NOVA Backend — Restricted CORS Middleware
 * Restricts cross-origin requests to configured frontend origins.
 */

import { config } from '../config/env.js';

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    config.corsOrigin,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173'
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // Same-origin or server-to-server / curl
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key, X-Request-Id'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
}

