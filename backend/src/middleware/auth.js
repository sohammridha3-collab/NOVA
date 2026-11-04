/**
 * NOVA Backend — Single-Owner Authentication Middleware
 * Supports local development via:
 * 1. Bearer token acquired from POST /api/auth/login
 * 2. Static X-API-Key header matching OWNER_API_KEY
 */

import crypto from 'crypto';
import { config } from '../config/env.js';
import { formatError } from '../utils/response.js';

/**
 * Sign an authentication token for the single owner.
 * Format: payloadBase64.hmacSignature
 */
export function signAuthToken(payload) {
  const data = JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  const b64 = Buffer.from(data).toString('base64url');
  const sig = crypto.createHmac('sha256', config.auth.jwtSecret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

/**
 * Verify and decode an authentication token.
 */
export function verifyAuthToken(token) {
  if (!token || !token.includes('.')) return null;
  const [b64, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', config.auth.jwtSecret).update(b64).digest('base64url');

  if (sig !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Express middleware requiring authentication.
 */
export function requireAuth(req, res, next) {
  // 1. Check API Key header
  const apiKey = req.header('X-API-Key');
  if (apiKey && apiKey === config.auth.ownerApiKey) {
    req.user = { username: config.auth.ownerUsername, role: 'owner', authMethod: 'api-key' };
    return next();
  }

  // 2. Check Bearer token
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const payload = verifyAuthToken(token);
    if (payload) {
      req.user = { ...payload, authMethod: 'bearer' };
      return next();
    }
  }

  return res.status(401).json(
    formatError(
      'UNAUTHORIZED',
      'Authentication required. Provide a valid Bearer token from POST /api/auth/login or a valid X-API-Key header.',
      null,
      req
    )
  );
}

