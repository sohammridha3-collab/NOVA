/**
 * NOVA Backend — Message Controller
 */

import * as messageService from '../services/messageService.js';
import { formatSuccess, formatError } from '../utils/response.js';

export async function addMessage(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { role = 'user', content, simulated = false } = req.body;

    const result = await messageService.addMessage(sessionId, {
      role,
      content,
      simulated
    });

    if (!result) {
      return res.status(404).json(
        formatError(
          'SESSION_NOT_FOUND',
          `Cannot append message: Session '${sessionId}' was not found.`,
          null,
          req
        )
      );
    }

    res.status(201).json(formatSuccess(result, req));
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const { sessionId } = req.params;
    const messages = await messageService.listMessagesBySession(sessionId);
    res.status(200).json(formatSuccess(messages, req));
  } catch (err) {
    next(err);
  }
}

