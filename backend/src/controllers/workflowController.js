/**
 * NOVA Backend — Reusable Workflows Controller
 * Exposes endpoints for listing workflows, proposing steps, executing sequentially,
 * pausing on consequential steps, and cancelling runs.
 */

import {
  listWorkflows,
  getWorkflow,
  createWorkflow,
  proposeWorkflow,
  runWorkflow,
  resumeWorkflowRun,
  cancelWorkflowRun,
  getWorkflowRun,
  listWorkflowRuns
} from '../workflows/workflowEngine.js';
import { successResponse } from '../utils/response.js';

export async function getWorkflows(req, res, next) {
  try {
    const list = await listWorkflows();
    return successResponse(res, { count: list.length, workflows: list });
  } catch (err) {
    next(err);
  }
}

export async function createCustomWorkflow(req, res, next) {
  try {
    const created = await createWorkflow(req.body);
    return successResponse(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function proposeWorkflowRun(req, res, next) {
  try {
    const { id } = req.params;
    const params = { ...(req.query || {}), ...(req.body?.params || {}) };
    const proposal = await proposeWorkflow(id, params);
    return successResponse(res, proposal);
  } catch (err) {
    next(err);
  }
}

export async function executeWorkflow(req, res, next) {
  try {
    const { id } = req.params;
    const { params = {}, confirmed = false } = req.body || {};
    const result = await runWorkflow(id, params, { confirmed: Boolean(confirmed) });
    return successResponse(res, result, result.status === 'awaiting_confirmation' ? 202 : 200);
  } catch (err) {
    next(err);
  }
}

export async function getRuns(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const runs = await listWorkflowRuns(limit);
    return successResponse(res, { count: runs.length, runs });
  } catch (err) {
    next(err);
  }
}

export async function getRun(req, res, next) {
  try {
    const run = await getWorkflowRun(req.params.runId);
    if (!run) {
      const err = new Error(`Workflow run '${req.params.runId}' not found.`);
      err.status = 404;
      err.code = 'WORKFLOW_RUN_NOT_FOUND';
      throw err;
    }
    return successResponse(res, run);
  } catch (err) {
    next(err);
  }
}

export async function resumeRun(req, res, next) {
  try {
    const { runId } = req.params;
    const { confirmationToken, confirmed = true, resolvedArguments } = req.body || {};
    const result = await resumeWorkflowRun(runId, {
      confirmationToken,
      confirmed: Boolean(confirmed),
      resolvedArguments
    });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function cancelRun(req, res, next) {
  try {
    const { runId } = req.params;
    const result = await cancelWorkflowRun(runId);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
