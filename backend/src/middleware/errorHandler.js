/**
 * NOVA Backend — Centralized Error Handling Middleware
 * Ensures every error response conforms to the standard JSON contract.
 */

import { formatError } from '../utils/response.js';

/**
 * 404 Route Not Found Handler.
 */
export function notFoundHandler(req, res) {
  res.status(404).json(
    formatError(
      'ROUTE_NOT_FOUND',
      `Cannot ${req.method} ${req.originalUrl}. Please check the API documentation.`,
      null,
      req
    )
  );
}

/**
 * Central Error Handler.
 */
export function errorHandler(err, req, res, next) {
  // 1. JSON parse syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(
      formatError(
        'MALFORMED_JSON',
        'Request payload contains invalid JSON syntax.',
        null,
        req
      )
    );
  }

  // 2. Request entity too large (request-size limits)
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json(
      formatError(
        'PAYLOAD_TOO_LARGE',
        'Request body exceeds maximum allowed size limit of 1MB.',
        null,
        req
      )
    );
  }

  // 3. MySQL Database errors (Connection refused, access denied, bad db)
  if (err.code && (err.code.startsWith('ER_') || err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST')) {
    return res.status(503).json(
      formatError(
        'DATABASE_UNAVAILABLE',
        'MySQL database operation failed. Ensure MySQL is running, check DB credentials in backend/.env, and run "npm run db:migrate".',
        {
          mysqlCode: err.code,
          mysqlMessage: err.message
        },
        req
      )
    );
  }

  // 4. Custom App Error with explicit status code
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message = err.message || 'An unexpected internal error occurred.';

  console.error(`[NOVA Error] ${req.id} - ${errorCode}:`, err);

  res.status(statusCode).json(
    formatError(
      errorCode,
      message,
      process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
      req
    )
  );
}

