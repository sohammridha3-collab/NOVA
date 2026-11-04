/**
 * NOVA Backend — Standard JSON Response Envelope
 * Ensures every single endpoint response matches the documented contract:
 * {
 *   "success": boolean,
 *   "data": any,
 *   "error": { "code": string, "message": string, "details"?: any },
 *   "meta": { "requestId": string, "timestamp": string, ... }
 * }
 */

/**
 * Creates a standardized success response payload.
 * @param {any} data - Payload data
 * @param {import('express').Request} req - Express request object
 * @param {object} extraMeta - Additional metadata (e.g. provider, finishReason)
 * @returns {object} Standard envelope
 */
export function formatSuccess(data = null, req = null, extraMeta = {}) {
  return {
    success: true,
    data,
    meta: {
      requestId: req?.id || `req_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...extraMeta
    }
  };
}

/**
 * Creates a standardized error response payload.
 * @param {string} code - Machine-readable error code (e.g. 'VALIDATION_FAILED')
 * @param {string} message - Human-readable explanation
 * @param {object|null} details - Contextual diagnostics or field errors
 * @param {import('express').Request} req - Express request object
 * @returns {object} Standard envelope
 */
export function formatError(code, message, details = null, req = null) {
  const envelope = {
    success: false,
    error: {
      code,
      message
    },
    meta: {
      requestId: req?.id || `req_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  };

  if (details !== null && details !== undefined) {
    envelope.error.details = details;
  }

  return envelope;
}

/**
 * Direct response helper for Express handlers: sends formatted success JSON
 */
export function successResponse(res, data = null, statusCode = 200, extraMeta = {}) {
  return res.status(statusCode).json(formatSuccess(data, res?.req, extraMeta));
}

/**
 * Direct response helper for Express handlers: sends formatted error JSON
 */
export function errorResponse(res, message, statusCode = 400, code = 'ERROR', details = null) {
  return res.status(statusCode).json(formatError(code, message, details, res?.req));
}
