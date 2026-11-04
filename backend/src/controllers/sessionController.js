/**
 * NOVA Backend — Session Controller
 */

import * as sessionService from '../services/sessionService.js';
import { formatSuccess, formatError } from '../utils/response.js';

export async function createSession(req, res, next) {
  try {
    const title = req.body.title || 'New Neural Session';
    const session = await sessionService.createSession(title);
    res.status(201).json(formatSuccess(session, req));
  } catch (err) {
    next(err);
  }
}

export async function listSessions(req, res, next) {
  try {
    const sessions = await sessionService.listSessions();
    res.status(200).json(formatSuccess(sessions, req));
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json(
        formatError(
          'SESSION_NOT_FOUND',
          `Session with ID '${req.params.id}' does not exist.`,
          null,
          req
        )
      );
    }
    res.status(200).json(formatSuccess(session, req));
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req, res, next) {
  try {
    const { title } = req.body;
    const updated = await sessionService.updateSessionTitle(req.params.id, title);
    if (!updated) {
      return res.status(404).json(
        formatError(
          'SESSION_NOT_FOUND',
          `Session with ID '${req.params.id}' does not exist.`,
          null,
          req
        )
      );
    }
    res.status(200).json(formatSuccess(updated, req));
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req, res, next) {
  try {
    const deleted = await sessionService.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json(
        formatError(
          'SESSION_NOT_FOUND',
          `Session with ID '${req.params.id}' does not exist.`,
          null,
          req
        )
      );
    }
    res.status(200).json(formatSuccess({ deleted: true, id: req.params.id }, req));
  } catch (err) {
    next(err);
  }
}

