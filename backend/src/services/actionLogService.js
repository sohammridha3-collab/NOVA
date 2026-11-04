/**
 * NOVA Backend — Action Log Service
 * Stores audit logs for operations, queries, and state shifts.
 */

import { query } from '../database/connection.js';

const inMemoryActionLogs = [];

export async function recordAction(action, details = null, ipAddress = null) {
  const detailsJson = details ? JSON.stringify(details) : null;
  const now = new Date();

  try {
    const [result] = await query(
      'INSERT INTO action_logs (action, details, ip_address, created_at) VALUES (?, ?, ?, ?)',
      [action, detailsJson, ipAddress, now]
    );

    return {
      id: result?.insertId || inMemoryActionLogs.length + 1,
      action,
      details,
      ipAddress,
      timestamp: now.toISOString()
    };
  } catch (e) {
    const logItem = {
      id: inMemoryActionLogs.length + 1,
      action,
      details,
      ipAddress,
      timestamp: now.toISOString()
    };
    inMemoryActionLogs.push(logItem);
    return logItem;
  }
}

export async function recordActionLog(optionsOrAction, details = null, ip = null) {
  if (typeof optionsOrAction === 'object' && optionsOrAction !== null) {
    const action = optionsOrAction.actionType || optionsOrAction.action || 'GENERIC_ACTION';
    const logDetails = optionsOrAction.details || optionsOrAction;
    const ipAddress = optionsOrAction.ipAddress || ip;
    return recordAction(action, logDetails, ipAddress);
  }
  return recordAction(optionsOrAction, details, ip);
}

export async function listActionLogs(limit = 50) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

  try {
    const [rows] = await query(
      'SELECT id, action, details, ip_address AS ipAddress, created_at AS timestamp FROM action_logs ORDER BY created_at DESC LIMIT ?',
      [safeLimit]
    );

    return rows.map(r => ({
      id: r.id,
      action: r.action,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details,
      ipAddress: r.ipAddress,
      timestamp: r.timestamp
    }));
  } catch (e) {
    return inMemoryActionLogs.slice(-safeLimit).reverse();
  }
}
