/**
 * NOVA Backend — Action Log Controller
 */

import * as actionLogService from '../services/actionLogService.js';
import { formatSuccess } from '../utils/response.js';

export async function createLog(req, res, next) {
  try {
    const { action, details } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const logged = await actionLogService.recordAction(action, details, ip);
    res.status(201).json(formatSuccess(logged, req));
  } catch (err) {
    next(err);
  }
}

export async function listLogs(req, res, next) {
  try {
    const limit = req.query.limit || 50;
    const logs = await actionLogService.listActionLogs(limit);
    res.status(200).json(formatSuccess(logs, req));
  } catch (err) {
    next(err);
  }
}

