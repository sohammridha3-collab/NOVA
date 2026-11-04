/**
 * NOVA Backend — Chat Controller
 * Handles AI conversation turns, message persistence, context window management,
 * and structured action triggering.
 */

import { SessionService } from '../services/sessionService.js';
import { MessageService } from '../services/messageService.js';
import { modelAdapter } from '../ai/modelAdapter.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const ChatController = {
  /**
   * POST /api/chat
   * Main conversation endpoint
   */
  async sendMessage(req, res, next) {
    try {
      const { sessionId, message, prompt, content } = req.body;
      const text = message || prompt || content;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return errorResponse(res, "Parameter 'message' is required and must be a non-empty string.", 400, 'INVALID_INPUT');
      }

      // Ensure session exists or create one
      let targetSessionId = sessionId;
      if (!targetSessionId) {
        const newSession = await SessionService.createSession(`Session ${new Date().toLocaleDateString()}`);
        targetSessionId = newSession.id;
      } else {
        const existing = await SessionService.getSessionById(targetSessionId);
        if (!existing) {
          const newSession = await SessionService.createSession(`Session ${new Date().toLocaleDateString()}`);
          targetSessionId = newSession.id;
        }
      }

      // 1. Save user message to MySQL/memory
      await MessageService.addMessage(targetSessionId, 'user', text.trim());

      // 2. Fetch existing session message history
      const history = await MessageService.getMessages(targetSessionId);

      // 3. Delegate to model provider adapter
      const aiResponse = await modelAdapter.generateResponse({
        history,
        prompt: text.trim(),
        sessionId: targetSessionId
      });

      // 4. Save assistant response to MySQL/memory
      const assistantMsg = await MessageService.addMessage(targetSessionId, 'assistant', aiResponse.content);

      // 5. Return documented JSON contract
      return successResponse(
        res,
        {
          sessionId: targetSessionId,
          message: assistantMsg,
          actions: aiResponse.actions || []
        },
        200,
        {
          ...(aiResponse.meta || {})
        }
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/chat/status
   * Provider configuration & readiness status
   */
  async getStatus(req, res) {
    const status = modelAdapter.getStatus();
    return successResponse(res, status);
  }
};

