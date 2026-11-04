/**
 * NOVA Backend — Action Service
 * Manages the lifecycle of structured tool execution proposals and executions.
 *
 * State Machine:
 * proposed -> awaiting_confirmation -> running -> succeeded | failed
 *          \-> running -> succeeded | failed
 *          \-> cancelled
 *
 * Security:
 * Confirmation tokens are cryptographically bound to the EXACT action ID, tool name,
 * and serialized parameters. Tampering with parameters or reusing tokens across actions
 * will invalidate the confirmation.
 */

import crypto from 'crypto';
import { query } from '../database/connection.js';
import { config } from '../config/env.js';
import { toolRegistry } from '../tools/registry.js';
import { recordActionLog } from './actionLogService.js';

// In-memory fallback for offline or unit-testing environments
export const inMemoryActions = new Map();

/**
 * Generate a cryptographic HMAC token strictly binding an action ID to its tool and parameters
 */
export function generateConfirmationToken(actionId, toolName, args) {
  const payload = `${actionId}:${toolName}:${JSON.stringify(args || {})}`;
  return crypto
    .createHmac('sha256', config.auth.jwtSecret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify that a given confirmation token strictly matches the action ID, tool, and parameters
 */
export function verifyConfirmationToken(actionId, toolName, args, token) {
  if (!token || typeof token !== 'string') return false;
  const expected = generateConfirmationToken(actionId, toolName, args);
  return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
}

export const ActionService = {
  /**
   * Propose a tool execution
   * If the tool requires confirmation, creates an action in 'awaiting_confirmation' state.
   * If the tool does NOT require confirmation, executes it immediately and returns 'succeeded' or 'failed'.
   */
  async proposeAction({ sessionId = null, toolName, args = {} }) {
    const id = crypto.randomUUID();
    const now = new Date();

    const tool = toolRegistry.get(toolName);
    if (!tool) {
      const err = new Error(`Tool '${toolName}' is not registered.`);
      err.code = 'UNAUTHORIZED_TOOL_EXECUTION';
      err.statusCode = 400;
      throw err;
    }

    // Validate parameters before creating any action
    if (typeof tool.validate === 'function') {
      const val = tool.validate(args);
      if (!val.valid) {
        const err = new Error(`Validation failed for tool '${toolName}': ${val.error}`);
        err.code = 'TOOL_ARGUMENT_INVALID';
        err.statusCode = 422;
        err.details = val.error;
        throw err;
      }
    }

    const requiresConfirmation = !!tool.requiresConfirmation;
    let confirmationToken = null;
    let status = requiresConfirmation ? 'awaiting_confirmation' : 'running';

    if (requiresConfirmation) {
      confirmationToken = generateConfirmationToken(id, toolName, args);
    }

    const actionRecord = {
      id,
      sessionId,
      toolName,
      arguments: args,
      requiresConfirmation,
      confirmationToken,
      status,
      result: null,
      errorMessage: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // Store action in DB or fallback
    try {
      await query(
        `INSERT INTO actions (id, session_id, tool_name, arguments_json, status, requires_confirmation, confirmation_token, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, sessionId, toolName, JSON.stringify(args), status, requiresConfirmation, confirmationToken, now, now]
      );
    } catch (e) {
      inMemoryActions.set(id, actionRecord);
    }

    // If confirmation is required, stop here and return the pending action card
    if (requiresConfirmation) {
      await recordActionLog({
        sessionId,
        actionType: 'ACTION_AWAITING_CONFIRMATION',
        details: { actionId: id, toolName, args }
      }).catch(() => {});

      return actionRecord;
    }

    // If no confirmation is needed, execute immediately
    return await this.executeAction(id, actionRecord);
  },

  /**
   * Internal executor for an action
   */
  async executeAction(actionId, existingRecord = null) {
    const action = existingRecord || (await this.getActionById(actionId));
    if (!action) {
      throw new Error(`Action '${actionId}' not found.`);
    }

    // Mark running
    action.status = 'running';
    action.updatedAt = new Date().toISOString();
    try {
      await query("UPDATE actions SET status = 'running', updated_at = NOW() WHERE id = ?", [actionId]);
    } catch (e) {
      inMemoryActions.set(actionId, action);
    }

    try {
      const toolResult = await toolRegistry.executeTool(action.toolName, action.arguments, { confirmed: true });
      action.status = 'succeeded';
      action.result = toolResult;
      action.updatedAt = new Date().toISOString();

      try {
        await query(
          "UPDATE actions SET status = 'succeeded', result_json = ?, updated_at = NOW() WHERE id = ?",
          [JSON.stringify(toolResult), actionId]
        );
      } catch (e) {
        inMemoryActions.set(actionId, action);
      }

      await recordActionLog({
        sessionId: action.sessionId,
        actionType: 'ACTION_SUCCEEDED',
        details: { actionId, toolName: action.toolName, result: toolResult }
      }).catch(() => {});

      return action;
    } catch (execErr) {
      action.status = 'failed';
      action.errorMessage = execErr.message;
      action.updatedAt = new Date().toISOString();

      try {
        await query(
          "UPDATE actions SET status = 'failed', error_message = ?, updated_at = NOW() WHERE id = ?",
          [execErr.message, actionId]
        );
      } catch (e) {
        inMemoryActions.set(actionId, action);
      }

      await recordActionLog({
        sessionId: action.sessionId,
        actionType: 'ACTION_FAILED',
        details: { actionId, toolName: action.toolName, error: execErr.message }
      }).catch(() => {});

      return action;
    }
  },

  /**
   * Confirm an action that is awaiting confirmation.
   * Parameter-bound verification: token must match the exact action and parameters.
   */
  async confirmAction(actionId, confirmationToken, alteredArgs = null) {
    const action = await this.getActionById(actionId);
    if (!action) {
      const err = new Error(`Action '${actionId}' not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (action.status !== 'awaiting_confirmation') {
      const err = new Error(`Action '${actionId}' is in status '${action.status}', not awaiting confirmation.`);
      err.statusCode = 400;
      throw err;
    }

    // Verify token matches exact action parameters
    const targetArgs = alteredArgs || action.arguments;
    const isValidToken = verifyConfirmationToken(actionId, action.toolName, targetArgs, confirmationToken);

    if (!isValidToken) {
      const err = new Error(`Security Violation: Confirmation token is invalid or does not match the bound action parameters.`);
      err.code = 'CONFIRMATION_TOKEN_INVALID';
      err.statusCode = 403;
      throw err;
    }

    // Execute the confirmed action
    return await this.executeAction(actionId, action);
  },

  /**
   * Cancel an action that is proposed or awaiting confirmation
   */
  async cancelAction(actionId, reason = 'Cancelled by operator') {
    const action = await this.getActionById(actionId);
    if (!action) {
      const err = new Error(`Action '${actionId}' not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (!['proposed', 'awaiting_confirmation'].includes(action.status)) {
      const err = new Error(`Cannot cancel action '${actionId}' with status '${action.status}'. Only proposed or awaiting confirmation actions can be cancelled.`);
      err.statusCode = 400;
      throw err;
    }

    action.status = 'cancelled';
    action.errorMessage = reason;
    action.updatedAt = new Date().toISOString();

    try {
      await query(
        "UPDATE actions SET status = 'cancelled', error_message = ?, updated_at = NOW() WHERE id = ?",
        [reason, actionId]
      );
    } catch (e) {
      inMemoryActions.set(actionId, action);
    }

    await recordActionLog({
      sessionId: action.sessionId,
      actionType: 'ACTION_CANCELLED',
      details: { actionId, toolName: action.toolName, reason }
    }).catch(() => {});

    return action;
  },

  /**
   * Retrieve an action by ID
   */
  async getActionById(actionId) {
    try {
      const [rows] = await query(
        `SELECT id, session_id AS sessionId, tool_name AS toolName, arguments_json AS 'arguments',
                status, requires_confirmation AS requiresConfirmation, confirmation_token AS confirmationToken,
                result_json AS result, error_message AS errorMessage,
                created_at AS createdAt, updated_at AS updatedAt
         FROM actions WHERE id = ?`,
        [actionId]
      );
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          ...row,
          arguments: typeof row.arguments === 'string' ? JSON.parse(row.arguments) : row.arguments,
          result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result,
          requiresConfirmation: Boolean(row.requiresConfirmation)
        };
      }
    } catch (e) {
      // Fallback
    }

    return inMemoryActions.get(actionId) || null;
  },

  /**
   * List actions optionally filtered by session or status
   */
  async listActions({ sessionId, status, limit = 50 } = {}) {
    const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    try {
      let sql = `SELECT id, session_id AS sessionId, tool_name AS toolName, arguments_json AS 'arguments',
                        status, requires_confirmation AS requiresConfirmation, confirmation_token AS confirmationToken,
                        result_json AS result, error_message AS errorMessage,
                        created_at AS createdAt, updated_at AS updatedAt
                 FROM actions WHERE 1=1`;
      const params = [];
      if (sessionId) {
        sql += ' AND session_id = ?';
        params.push(sessionId);
      }
      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      params.push(lim);

      const [rows] = await query(sql, params);
      return rows.map(r => ({
        ...r,
        arguments: typeof r.arguments === 'string' ? JSON.parse(r.arguments) : r.arguments,
        result: typeof r.result === 'string' ? JSON.parse(r.result) : r.result,
        requiresConfirmation: Boolean(r.requiresConfirmation)
      }));
    } catch (e) {
      // Fallback
      const res = [];
      for (const a of inMemoryActions.values()) {
        if (sessionId && a.sessionId !== sessionId) continue;
        if (status && a.status !== status) continue;
        res.push(a);
        if (res.length >= lim) break;
      }
      return res;
    }
  }
};

