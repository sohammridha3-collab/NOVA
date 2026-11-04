/**
 * NOVA Backend — Preferences Controller
 */

import * as preferenceService from '../services/preferenceService.js';
import { formatSuccess } from '../utils/response.js';

export async function getPreferences(req, res, next) {
  try {
    const preferences = await preferenceService.getPreferences();
    res.status(200).json(formatSuccess(preferences, req));
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const updated = await preferenceService.savePreferences(req.body);
    res.status(200).json(formatSuccess(updated, req));
  } catch (err) {
    next(err);
  }
}

