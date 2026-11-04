/**
 * NOVA Backend — Reusable Workflow Execution Engine
 * Supports named workflows ("Start study mode", "Start coding mode", custom workflows).
 * Enforces sequential step execution, fail-safe termination on error,
 * permission preservation through Tool Registry, and confirmation gating for consequential steps.
 */

import crypto from 'crypto';
import { toolRegistry } from '../tools/registry.js';
import { query as dbQuery } from '../database/connection.js';
import { config } from '../config/env.js';

// In-memory fallback stores for offline testing
const inMemoryWorkflows = new Map();
const inMemoryRuns = new Map();

/**
 * Built-in named workflows
 */
const BUILTIN_WORKFLOWS = [
  {
    id: 'start_study_mode',
    name: 'Start Study Mode',
    description: 'Prepares a distraction-free study environment: creates a study note, sets a 45-minute focus reminder, mutes media, and sets ambient lighting.',
    isBuiltin: true,
    steps: [
      {
        stepIndex: 0,
        name: 'Create Study Note',
        toolName: 'saveNote',
        description: 'Initialize a study session note to track learnings and goals',
        requiresConfirmation: false,
        getArguments: (params = {}) => ({
          title: params.subject ? `Study Session: ${params.subject}` : 'Study Session Notes',
          content: `# Study Session Log\nSubject: ${params.subject || 'General Focus'}\nStarted: ${new Date().toISOString()}\n\n## Goals:\n- [ ] Deep focus\n- [ ] Complete core review\n- [ ] Summarize key takeaways`,
          tags: ['study', 'focus', params.subject ? params.subject.toLowerCase() : 'general']
        })
      },
      {
        stepIndex: 1,
        name: 'Set Focus Timer Reminder',
        toolName: 'createReminder',
        description: 'Set a reminder for the end of the 45-minute focus session',
        requiresConfirmation: false,
        getArguments: (params = {}) => ({
          title: `Study Session Break: ${params.subject || 'Focus Block'}`,
          dueAt: params.durationMinutes ? `+${params.durationMinutes}m` : '+45m',
          priority: 'high'
        })
      },
      {
        stepIndex: 2,
        name: 'Mute/Pause Entertainment Media',
        toolName: 'hassControlMedia',
        description: 'Pause or mute active TV and media players to eliminate distractions',
        requiresConfirmation: false,
        getArguments: () => ({
          entityId: 'media_player.living_room_tv',
          action: 'pause'
        })
      },
      {
        stepIndex: 3,
        name: 'Adjust Study Lighting',
        toolName: 'hassControlSwitchOrLight',
        description: 'Activate optimal concentration lighting at 75% warm intensity',
        requiresConfirmation: false,
        getArguments: () => ({
          entityId: 'light.living_room_lights',
          action: 'turn_on',
          brightness: 75
        })
      }
    ]
  },
  {
    id: 'start_coding_mode',
    name: 'Start Coding Mode',
    description: 'Initializes a developer workstation: opens configured editor, launches documentation, creates a scratchpad note, and sets a 60-minute development sprint timer.',
    isBuiltin: true,
    steps: [
      {
        stepIndex: 0,
        name: 'Open Code Editor / Scratchpad',
        toolName: 'openConfiguredApp',
        description: 'Launch authorized editor application',
        requiresConfirmation: false,
        getArguments: () => ({
          appName: 'notepad'
        })
      },
      {
        stepIndex: 1,
        name: 'Open Developer Documentation',
        toolName: 'openWebUrl',
        description: 'Open developer documentation portal',
        requiresConfirmation: false,
        getArguments: (params = {}) => ({
          url: params.docUrl || 'https://developer.mozilla.org'
        })
      },
      {
        stepIndex: 2,
        name: 'Create Workspace Coding Note',
        toolName: 'createWorkspaceNote',
        description: 'Initialize a project sprint note inside the dedicated workspace',
        requiresConfirmation: false,
        getArguments: (params = {}) => ({
          filename: `coding_sprint_${Date.now()}.md`,
          content: `# Coding Sprint: ${params.project || 'NOVA Development'}\nStarted: ${new Date().toISOString()}\n\n## Tasks:\n1. Implement feature specification\n2. Run automated test suites\n3. Verify security boundaries\n`
        })
      },
      {
        stepIndex: 3,
        name: 'Set Development Sprint Reminder',
        toolName: 'createReminder',
        description: 'Set a 60-minute reminder to review code progress and take a stretch break',
        requiresConfirmation: false,
        getArguments: (params = {}) => ({
          title: `Coding Sprint Review: ${params.project || 'Sprint Block'}`,
          dueAt: params.durationMinutes ? `+${params.durationMinutes}m` : '+60m',
          priority: 'medium'
        })
      }
    ]
  },
  {
    id: 'system_audit_mode',
    name: 'System Audit Mode',
    description: 'Performs an operational check across the Windows host, connected Android handsets, and smart home IoT entities.',
    isBuiltin: true,
    steps: [
      {
        stepIndex: 0,
        name: 'Host Telemetry Check',
        toolName: 'getOperatingSystemInfo',
        description: 'Query Windows CPU, memory utilization, and uptime',
        requiresConfirmation: false,
        getArguments: () => ({})
      },
      {
        stepIndex: 1,
        name: 'Android Devices Audit',
        toolName: 'androidListDevices',
        description: 'Discover connected Android handsets and verify RSA authorization states',
        requiresConfirmation: false,
        getArguments: () => ({})
      },
      {
        stepIndex: 2,
        name: 'Smart Home Entity Audit',
        toolName: 'hassListEntities',
        description: 'Query reachable media players, lights, and switches in Home Assistant',
        requiresConfirmation: false,
        getArguments: () => ({})
      }
    ]
  }
];

// Initialize in-memory cache with built-in workflows
for (const wf of BUILTIN_WORKFLOWS) {
  inMemoryWorkflows.set(wf.id, wf);
}

/**
 * Generate HMAC token for consequential workflow steps
 */
function generateStepConfirmationToken(runId, stepIndex, toolName, args) {
  const secret = config.auth.jwtSecret || 'nova_workflow_secret';
  const payload = `${runId}:${stepIndex}:${toolName}:${JSON.stringify(args)}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
}

/**
 * List all available workflows
 */
export async function listWorkflows() {
  const customList = [];
  try {
    const [rows] = await dbQuery('SELECT id, name, description, steps_json, is_builtin, created_at FROM workflows ORDER BY created_at ASC');
    if (rows && rows.length > 0) {
      for (const r of rows) {
        customList.push({
          id: r.id,
          name: r.name,
          description: r.description,
          isBuiltin: Boolean(r.is_builtin),
          steps: typeof r.steps_json === 'string' ? JSON.parse(r.steps_json) : r.steps_json,
          createdAt: r.created_at
        });
      }
    }
  } catch (e) {}

  const merged = new Map();
  for (const bw of BUILTIN_WORKFLOWS) {
    merged.set(bw.id, {
      id: bw.id,
      name: bw.name,
      description: bw.description,
      isBuiltin: true,
      stepCount: bw.steps.length,
      steps: bw.steps.map((s) => ({
        stepIndex: s.stepIndex,
        name: s.name,
        toolName: s.toolName,
        description: s.description,
        requiresConfirmation: s.requiresConfirmation
      }))
    });
  }

  for (const cw of customList) {
    merged.set(cw.id, {
      ...cw,
      stepCount: cw.steps ? cw.steps.length : 0
    });
  }

  for (const [id, memWf] of inMemoryWorkflows.entries()) {
    if (!merged.has(id)) {
      merged.set(id, {
        id: memWf.id,
        name: memWf.name,
        description: memWf.description,
        isBuiltin: Boolean(memWf.isBuiltin),
        stepCount: memWf.steps.length,
        steps: memWf.steps
      });
    }
  }

  return Array.from(merged.values());
}

/**
 * Get workflow definition by ID or case-insensitive name
 */
export async function getWorkflow(idOrName) {
  if (!idOrName) return null;
  const norm = idOrName.toLowerCase().trim().replace(/\s+/g, '_');

  // Check builtins first
  for (const bw of BUILTIN_WORKFLOWS) {
    if (bw.id === norm || bw.id === idOrName || bw.name.toLowerCase() === idOrName.toLowerCase().trim()) {
      return bw;
    }
  }

  // Check memory
  if (inMemoryWorkflows.has(norm)) return inMemoryWorkflows.get(norm);
  if (inMemoryWorkflows.has(idOrName)) return inMemoryWorkflows.get(idOrName);

  // Check database
  try {
    const [rows] = await dbQuery('SELECT id, name, description, steps_json, is_builtin FROM workflows WHERE id = ? OR name = ?', [idOrName, idOrName]);
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        isBuiltin: Boolean(r.is_builtin),
        steps: typeof r.steps_json === 'string' ? JSON.parse(r.steps_json) : r.steps_json
      };
    }
  } catch (e) {}

  return null;
}

/**
 * Create a custom user-defined workflow
 */
export async function createWorkflow({ name, description, steps = [] }) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const err = new Error("Workflow 'name' is required.");
    err.status = 400;
    err.code = 'INVALID_WORKFLOW_NAME';
    throw err;
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    const err = new Error('Workflow must contain at least one step.');
    err.status = 400;
    err.code = 'WORKFLOW_EMPTY_STEPS';
    throw err;
  }

  // Validate each step refers to a valid tool
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step.toolName || !toolRegistry.get(step.toolName)) {
      const err = new Error(`Step ${i + 1} refers to unrecognized tool '${step.toolName}'.`);
      err.status = 400;
      err.code = 'UNRECOGNIZED_WORKFLOW_TOOL';
      throw err;
    }
  }

  const id = `custom_${crypto.randomUUID().slice(0, 8)}`;
  const record = {
    id,
    name: name.trim(),
    description: description || '',
    steps: steps.map((s, idx) => ({
      stepIndex: idx,
      name: s.name || `Step ${idx + 1}`,
      toolName: s.toolName,
      description: s.description || '',
      requiresConfirmation: Boolean(s.requiresConfirmation || toolRegistry.get(s.toolName)?.requiresConfirmation),
      arguments: s.arguments || {}
    })),
    isBuiltin: false,
    createdAt: new Date().toISOString()
  };

  try {
    await dbQuery(
      'INSERT INTO workflows (id, name, description, steps_json, is_builtin, created_at, updated_at) VALUES (?, ?, ?, ?, 0, NOW(), NOW())',
      [id, record.name, record.description, JSON.stringify(record.steps)]
    );
  } catch (e) {}

  inMemoryWorkflows.set(id, record);
  return record;
}

/**
 * Propose workflow steps with resolved arguments prior to execution
 */
export async function proposeWorkflow(idOrName, params = {}) {
  const workflow = await getWorkflow(idOrName);
  if (!workflow) {
    const err = new Error(`Workflow '${idOrName}' not found.`);
    err.status = 404;
    err.code = 'WORKFLOW_NOT_FOUND';
    throw err;
  }

  const proposedSteps = workflow.steps.map((step, idx) => {
    const args = typeof step.getArguments === 'function' ? step.getArguments(params) : (step.arguments || {});
    const toolDef = toolRegistry.get(step.toolName);
    const requiresConfirmation = Boolean(step.requiresConfirmation || toolDef?.requiresConfirmation);

    return {
      stepIndex: idx,
      name: step.name,
      toolName: step.toolName,
      description: step.description,
      arguments: args,
      requiresConfirmation,
      isConsequential: requiresConfirmation
    };
  });

  return {
    workflowId: workflow.id,
    name: workflow.name,
    description: workflow.description,
    totalSteps: proposedSteps.length,
    proposedSteps
  };
}

/**
 * Execute a workflow sequentially with fail-safe error handling and confirmation gating
 */
export async function runWorkflow(idOrName, params = {}, options = {}) {
  const proposal = await proposeWorkflow(idOrName, params);
  const runId = crypto.randomUUID();
  const startTime = new Date();

  const runRecord = {
    id: runId,
    workflowId: proposal.workflowId,
    workflowName: proposal.name,
    status: 'running',
    currentStepIndex: 0,
    totalSteps: proposal.totalSteps,
    steps: proposal.proposedSteps.map((s) => ({
      ...s,
      status: 'pending',
      result: null,
      error: null,
      durationMs: null
    })),
    errorMessage: null,
    createdAt: startTime.toISOString(),
    completedAt: null
  };

  inMemoryRuns.set(runId, runRecord);

  // Persist initial run to MySQL
  try {
    await dbQuery(
      `INSERT INTO workflow_runs 
        (id, workflow_id, workflow_name, status, current_step_index, total_steps, steps_result_json, created_at)
       VALUES (?, ?, ?, 'running', 0, ?, ?, NOW())`,
      [runId, proposal.workflowId, proposal.name, proposal.totalSteps, JSON.stringify(runRecord.steps)]
    );
  } catch (e) {}

  // Execute steps sequentially
  return await executeWorkflowSteps(runRecord, options);
}

/**
 * Sequential step runner
 */
async function executeWorkflowSteps(runRecord, options = {}) {
  const startIndex = runRecord.currentStepIndex || 0;

  for (let i = startIndex; i < runRecord.steps.length; i++) {
    const step = runRecord.steps[i];
    runRecord.currentStepIndex = i;

    // Check if run was cancelled in the interim
    if (runRecord.status === 'cancelled') {
      step.status = 'cancelled';
      break;
    }

    // Check if step is consequential and requires operator confirmation
    if (step.requiresConfirmation && !options.confirmed) {
      runRecord.status = 'awaiting_confirmation';
      step.status = 'awaiting_confirmation';
      const token = generateStepConfirmationToken(runRecord.id, i, step.toolName, step.arguments);
      step.confirmationToken = token;

      // Update database status
      await updateRunRecordInDb(runRecord);

      return {
        runId: runRecord.id,
        workflowId: runRecord.workflowId,
        workflowName: runRecord.workflowName,
        status: 'awaiting_confirmation',
        currentStepIndex: i,
        totalSteps: runRecord.totalSteps,
        pendingStep: {
          stepIndex: i,
          name: step.name,
          toolName: step.toolName,
          arguments: step.arguments,
          confirmationToken: token
        },
        stepsCompleted: i,
        steps: runRecord.steps
      };
    }

    // Execute step via Tool Registry (Preserves full action permissions & validations)
    step.status = 'running';
    const stepStart = Date.now();

    try {
      const result = await toolRegistry.executeTool(step.toolName, step.arguments, {
        confirmed: Boolean(options.confirmed)
      });

      // Check if result returned an ambiguity check that needs user clarification
      if (result && result.isAmbiguous) {
        runRecord.status = 'awaiting_confirmation';
        step.status = 'awaiting_confirmation';
        step.ambiguity = result;
        await updateRunRecordInDb(runRecord);

        return {
          runId: runRecord.id,
          workflowId: runRecord.workflowId,
          workflowName: runRecord.workflowName,
          status: 'awaiting_confirmation',
          currentStepIndex: i,
          totalSteps: runRecord.totalSteps,
          isAmbiguous: true,
          pendingStep: step,
          candidates: result.candidates,
          stepsCompleted: i,
          steps: runRecord.steps
        };
      }

      step.status = 'succeeded';
      step.result = result;
      step.durationMs = Date.now() - stepStart;
    } catch (stepErr) {
      // STOP SAFELY ON FAILURE: Do not proceed to subsequent steps
      step.status = 'failed';
      step.error = stepErr.message;
      step.durationMs = Date.now() - stepStart;

      runRecord.status = 'failed';
      runRecord.errorMessage = `Step ${i + 1} (${step.name}) failed: ${stepErr.message}`;
      runRecord.completedAt = new Date().toISOString();

      await updateRunRecordInDb(runRecord);

      return {
        runId: runRecord.id,
        workflowId: runRecord.workflowId,
        workflowName: runRecord.workflowName,
        status: 'failed',
        failedAtStep: i,
        failedStepName: step.name,
        error: stepErr.message,
        stepsCompleted: i,
        totalSteps: runRecord.totalSteps,
        steps: runRecord.steps
      };
    }
  }

  // All steps succeeded
  if (runRecord.status !== 'cancelled' && runRecord.status !== 'failed' && runRecord.status !== 'awaiting_confirmation') {
    runRecord.status = 'succeeded';
    runRecord.completedAt = new Date().toISOString();
  }

  await updateRunRecordInDb(runRecord);

  return {
    runId: runRecord.id,
    workflowId: runRecord.workflowId,
    workflowName: runRecord.workflowName,
    status: runRecord.status,
    totalSteps: runRecord.totalSteps,
    stepsCompleted: runRecord.steps.filter((s) => s.status === 'succeeded').length,
    steps: runRecord.steps,
    completedAt: runRecord.completedAt
  };
}

/**
 * Resume a paused workflow run after user confirmation
 */
export async function resumeWorkflowRun(runId, { confirmed = true, confirmationToken, resolvedArguments } = {}) {
  const runRecord = inMemoryRuns.get(runId);
  if (!runRecord) {
    const err = new Error(`Workflow run '${runId}' not found.`);
    err.status = 404;
    err.code = 'WORKFLOW_RUN_NOT_FOUND';
    throw err;
  }

  if (runRecord.status !== 'awaiting_confirmation') {
    const err = new Error(`Workflow run '${runId}' is in state '${runRecord.status}', not awaiting confirmation.`);
    err.status = 400;
    err.code = 'INVALID_WORKFLOW_STATE';
    throw err;
  }

  const currentStep = runRecord.steps[runRecord.currentStepIndex];

  // Verify HMAC confirmation token if step required confirmation
  if (currentStep.requiresConfirmation) {
    const expectedToken = generateStepConfirmationToken(
      runRecord.id,
      runRecord.currentStepIndex,
      currentStep.toolName,
      currentStep.arguments
    );
    if (!confirmationToken || confirmationToken !== expectedToken) {
      const err = new Error('Security Violation: Invalid or mismatched confirmation token for workflow step.');
      err.status = 403;
      err.code = 'CONFIRMATION_TOKEN_INVALID';
      throw err;
    }
  }

  if (resolvedArguments && typeof resolvedArguments === 'object') {
    currentStep.arguments = { ...currentStep.arguments, ...resolvedArguments };
  }

  runRecord.status = 'running';
  return await executeWorkflowSteps(runRecord, { confirmed: Boolean(confirmed) });
}

/**
 * Cancel a workflow run
 */
export async function cancelWorkflowRun(runId) {
  const runRecord = inMemoryRuns.get(runId);
  if (!runRecord) {
    const err = new Error(`Workflow run '${runId}' not found.`);
    err.status = 404;
    err.code = 'WORKFLOW_RUN_NOT_FOUND';
    throw err;
  }

  runRecord.status = 'cancelled';
  runRecord.completedAt = new Date().toISOString();

  // Mark all pending steps as cancelled
  for (const step of runRecord.steps) {
    if (step.status === 'pending' || step.status === 'running' || step.status === 'awaiting_confirmation') {
      step.status = 'cancelled';
    }
  }

  await updateRunRecordInDb(runRecord);

  return {
    runId,
    status: 'cancelled',
    workflowName: runRecord.workflowName,
    message: 'Workflow execution cancelled. Operating-system actions already completed cannot be reverted.'
  };
}

/**
 * Get workflow run by ID
 */
export async function getWorkflowRun(runId) {
  const memRun = inMemoryRuns.get(runId);
  if (memRun) return memRun;

  try {
    const [rows] = await dbQuery(
      `SELECT id, workflow_id, workflow_name, status, current_step_index, total_steps, steps_result_json, error_message, created_at, completed_at
       FROM workflow_runs WHERE id = ?`,
      [runId]
    );
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        workflowId: r.workflow_id,
        workflowName: r.workflow_name,
        status: r.status,
        currentStepIndex: r.current_step_index,
        totalSteps: r.total_steps,
        steps: typeof r.steps_result_json === 'string' ? JSON.parse(r.steps_result_json) : r.steps_result_json,
        errorMessage: r.error_message,
        createdAt: r.created_at,
        completedAt: r.completed_at
      };
    }
  } catch (e) {}

  return null;
}

/**
 * List recent workflow runs
 */
export async function listWorkflowRuns(limit = 20) {
  try {
    const [rows] = await dbQuery(
      `SELECT id, workflow_id AS workflowId, workflow_name AS workflowName, status, current_step_index AS currentStepIndex, total_steps AS totalSteps, error_message AS errorMessage, created_at AS createdAt, completed_at AS completedAt
       FROM workflow_runs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    if (rows && rows.length > 0) return rows;
  } catch (e) {}

  const all = Array.from(inMemoryRuns.values());
  return all.slice(-limit).reverse().map((r) => ({
    id: r.id,
    workflowId: r.workflowId,
    workflowName: r.workflowName,
    status: r.status,
    currentStepIndex: r.currentStepIndex,
    totalSteps: r.totalSteps,
    errorMessage: r.errorMessage,
    createdAt: r.createdAt,
    completedAt: r.completedAt
  }));
}

async function updateRunRecordInDb(runRecord) {
  try {
    await dbQuery(
      `UPDATE workflow_runs 
       SET status = ?, current_step_index = ?, steps_result_json = ?, error_message = ?, completed_at = ?
       WHERE id = ?`,
      [
        runRecord.status,
        runRecord.currentStepIndex,
        JSON.stringify(runRecord.steps),
        runRecord.errorMessage || null,
        runRecord.completedAt || null,
        runRecord.id
      ]
    );
  } catch (e) {}
}

export function clearInMemoryWorkflows() {
  inMemoryRuns.clear();
}

