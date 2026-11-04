/**
 * NOVA Backend — Unified Activity Timeline Controller
 */

import { getActivityTimeline } from '../services/activityTimelineService.js';
import { successResponse } from '../utils/response.js';

export async function getTimeline(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const timeline = await getActivityTimeline({ limit });
    return successResponse(res, {
      count: timeline.length,
      timeline
    });
  } catch (err) {
    next(err);
  }
}
