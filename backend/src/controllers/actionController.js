/**
 * NOVA Backend — Action Controller
 * Exposes endpoints to inspect, confirm, or cancel structured tool executions.
 */

import { ActionService } from '../services/actionService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const ActionController = {
  /**
   * GET /api/actions
   * List actions with optional filters
   */
  async listActions(req, res, next) {
    try {
      const { sessionId, status, limit } = req.query;
      const actions = await ActionService.listActions({ sessionId, status, limit });
      return successResponse(res, actions);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/actions/:id
   * Get action details
   */
  async getAction(req, res, next) {
    try {
      const { id } = req.params;
      const action = await ActionService.getActionById(id);
      if (!action) {
        return errorResponse(res, `Action '${id}' not found.`, 404, 'ACTION_NOT_FOUND');
      }
      return successResponse(res, action);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/actions/:id/confirm
   * Operator confirmation for a destructive action.
   * Parameter-bound: token and parameters must strictly match.
   */
  async confirmAction(req, res, next) {
    try {
      const { id } = req.params;
      const { confirmationToken, arguments: passedArgs } = req.body;

      if (!confirmationToken || typeof confirmationToken !== 'string') {
        return errorResponse(
          res,
          "Parameter 'confirmationToken' is required to confirm a destructive action.",
          400,
          'MISSING_CONFIRMATION_TOKEN'
        );
      }

      const result = await ActionService.confirmAction(id, confirmationToken, passedArgs);
      return successResponse(res, result, 200, {
        confirmedAt: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/actions/:id/cancel
   * Cancel an action that is awaiting confirmation
   */
  async cancelAction(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await ActionService.cancelAction(id, reason || 'Operator cancelled execution');
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
};

