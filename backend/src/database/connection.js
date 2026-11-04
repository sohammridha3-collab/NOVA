/**
 * NOVA Backend — Database Connection Manager (MySQL2 Promise Pool)
 * Provides parameterized database queries, health readiness verification,
 * and structured error diagnostics for missing MySQL configurations.
 */

import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
  return pool;
}

/**
 * Execute a parameterized query safely through the pool.
 * @param {string} sql - SQL statement with placeholders (?)
 * @param {Array} params - Parameter values
 */
export async function query(sql, params = []) {
  const p = getPool();
  return await p.query(sql, params);
}

/**
 * Verifies database connectivity and readiness.
 * Returns structured status and actionable troubleshooting guidance if unavailable.
 */
export async function testConnection() {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT 1 AS readiness_check');
    return {
      ok: true,
      host: config.db.host,
      port: config.db.port,
      database: config.db.database
    };
  } catch (err) {
    const isConnRefused = err.code === 'ECONNREFUSED';
    const isAccessDenied = err.code === 'ER_ACCESS_DENIED_ERROR';
    const isBadDb = err.code === 'ER_BAD_DB_ERROR';

    let setupGuide = 'Ensure MySQL is running and verify DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in backend/.env.';
    if (isConnRefused) {
      setupGuide = `Unable to connect to MySQL on ${config.db.host}:${config.db.port}. Ensure the MySQL server service is started (e.g. 'Start-Service MySQL80' on Windows or 'sudo systemctl start mysql' on Linux).`;
    } else if (isAccessDenied) {
      setupGuide = `Access denied for user '${config.db.user}'. Verify DB_USER and DB_PASSWORD in backend/.env.`;
    } else if (isBadDb) {
      setupGuide = `Database '${config.db.database}' does not exist yet. Please run 'npm run db:migrate' from the backend directory to create the database and required tables.`;
    }

    return {
      ok: false,
      code: err.code || 'DB_ERROR',
      message: err.message,
      setupGuide,
      host: config.db.host,
      port: config.db.port,
      database: config.db.database
    };
  }
}

/**
 * Closes the database pool (used during graceful shutdown or tests).
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

