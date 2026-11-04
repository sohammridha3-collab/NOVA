/**
 * NOVA Backend — Health & Readiness Controller
 */

import { testConnection } from '../database/connection.js';
import { modelAdapter } from '../ai/modelAdapter.js';
import { formatSuccess, formatError } from '../utils/response.js';

/**
 * Basic liveness check. Always returns 200 if Express server is running.
 */
export function getHealth(req, res) {
  res.status(200).json(
    formatSuccess(
      {
        status: 'ok',
        service: 'nova-backend',
        version: '1.0.0',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      },
      req
    )
  );
}

/**
 * Dependency readiness probe.
 * Checks MySQL database connectivity. Returns 503 with troubleshooting guide if down.
 */
export async function getReadiness(req, res) {
  const dbStatus = await testConnection();
  const aiStatus = modelAdapter.getStatus();

  if (dbStatus.ok) {
    return res.status(200).json(
      formatSuccess(
        {
          status: 'ready',
          database: {
            status: 'connected',
            host: dbStatus.host,
            port: dbStatus.port,
            database: dbStatus.database
          },
          ai: aiStatus
        },
        req
      )
    );
  }

  // Database is not reachable or unconfigured
  return res.status(503).json(
    formatError(
      'DATABASE_NOT_READY',
      'MySQL database dependency check failed. Backend server is alive, but database connection is not ready.',
      {
        database: {
          status: 'disconnected',
          host: dbStatus.host,
          port: dbStatus.port,
          code: dbStatus.code,
          message: dbStatus.message
        },
        ai: aiStatus,
        setupGuide: dbStatus.setupGuide
      },
      req
    )
  );
}

/**
 * Actively probe configured AI provider connection
 */
export async function testAiConnection(req, res) {
  const result = await modelAdapter.testProviderConnection();
  return res.status(200).json(formatSuccess(result, req));
}

