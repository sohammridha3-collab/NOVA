/**
 * NOVA Backend — Automation Controller
 * Provides endpoints for frontend and external integrations to query agent status,
 * capabilities, and dispatch automation actions.
 */

import { automationService } from '../automation/automationService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const AutomationController = {
  /**
   * GET /api/automation/status
   */
  async getStatus(req, res) {
    try {
      const status = await automationService.getStatus();
      return successResponse(res, status);
    } catch (err) {
      return errorResponse(res, err.message, err.statusCode || 500, err.code || 'AUTOMATION_STATUS_ERROR');
    }
  },

  /**
   * GET /api/automation/capabilities
   */
  async getCapabilities(req, res) {
    try {
      const capabilities = await automationService.getCapabilities();
      return successResponse(res, capabilities);
    } catch (err) {
      return errorResponse(res, err.message, err.statusCode || 500, err.code || 'AUTOMATION_CAPABILITIES_ERROR');
    }
  },

  /**
   * POST /api/automation/execute
   */
  async execute(req, res, next) {
    try {
      const { action, params } = req.body;
      if (!action || typeof action !== 'string') {
        return errorResponse(res, "Field 'action' is required and must be a string.", 400, 'INVALID_INPUT');
      }

      const result = await automationService.execute(action, params || {});
      return successResponse(res, result, 200, {
        cancellationNotice: 'Cancellation may not undo completed operating-system side effects.'
      });
    } catch (err) {
      next(err);
    }
  }
};

