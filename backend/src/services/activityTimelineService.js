/**
 * NOVA Backend — Unified Activity Timeline Service
 * Aggregates workflow runs, tool executions, document indexing, and memories
 * into a single audited chronological event timeline with cancel controls.
 */

import { query as dbQuery } from '../database/connection.js';
import { listWorkflowRuns } from '../workflows/workflowEngine.js';
import { listDocuments } from '../knowledge/documentService.js';
import { listMemories } from '../knowledge/memoryService.js';
import { ReminderService } from './reminderService.js';

export async function getActivityTimeline(options = {}) {
  const { limit = 30 } = options;
  const events = [];

  // 1. Fetch Workflow Runs
  try {
    const runs = await listWorkflowRuns(limit);
    for (const run of runs) {
      events.push({
        id: `wf_${run.id}`,
        type: 'workflow',
        title: `Workflow: ${run.workflowName}`,
        status: run.status,
        summary: `Progress: ${run.currentStepIndex || 0}/${run.totalSteps || 0} steps`,
        details: {
          runId: run.id,
          workflowId: run.workflowId,
          errorMessage: run.errorMessage
        },
        timestamp: run.createdAt,
        isCancellable: run.status === 'running' || run.status === 'awaiting_confirmation',
        cancelEndpoint: `/api/workflows/runs/${run.id}/cancel`
      });
    }
  } catch (e) {}

  // 2. Fetch Structured Tool Actions from DB
  try {
    const [actionRows] = await dbQuery(
      `SELECT id, tool_name AS toolName, status, requires_confirmation AS requiresConfirmation, error_message AS errorMessage, created_at AS createdAt
       FROM actions ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    if (actionRows && actionRows.length > 0) {
      for (const act of actionRows) {
        events.push({
          id: `act_${act.id}`,
          type: 'tool_action',
          title: `Action: ${act.toolName}`,
          status: act.status,
          summary: act.requiresConfirmation ? 'Requires operator confirmation' : 'Executed automatically',
          details: {
            actionId: act.id,
            toolName: act.toolName,
            errorMessage: act.errorMessage
          },
          timestamp: act.createdAt,
          isCancellable: act.status === 'proposed' || act.status === 'awaiting_confirmation',
          cancelEndpoint: `/api/actions/${act.id}/cancel`
        });
      }
    }
  } catch (e) {}

  // 3. Fetch Document Indexing Events
  try {
    const docs = await listDocuments();
    for (const doc of docs.slice(0, 10)) {
      events.push({
        id: `doc_${doc.id}`,
        type: 'document_indexed',
        title: `Indexed Document: ${doc.originalName}`,
        status: 'succeeded',
        summary: `${doc.fileType.toUpperCase()} • ${doc.pageCount} page(s) • ${doc.chunkCount} indexed chunks`,
        details: {
          documentId: doc.id,
          fileSize: doc.fileSize
        },
        timestamp: doc.createdAt,
        isCancellable: false
      });
    }
  } catch (e) {}

  // 4. Fetch Memory Events
  try {
    const memories = await listMemories(null, false);
    for (const mem of memories.slice(0, 10)) {
      events.push({
        id: `mem_${mem.id}`,
        type: 'memory_saved',
        title: `Memory: ${mem.keyName}`,
        status: mem.isActive ? 'succeeded' : 'inactive',
        summary: `[${mem.category.toUpperCase()}] ${mem.valueText.length > 60 ? mem.valueText.slice(0, 60) + '...' : mem.valueText}`,
        details: {
          memoryId: mem.id,
          category: mem.category
        },
        timestamp: mem.createdAt,
        isCancellable: false
      });
    }
  } catch (e) {}

  // 5. Fetch Reminders
  try {
    const reminders = await ReminderService.listReminders({ status: 'all', limit: 10 });
    for (const rem of (reminders || [])) {
      events.push({
        id: `rem_${rem.id}`,
        type: 'reminder',
        title: `Reminder: ${rem.title}`,
        status: rem.status,
        summary: `Due: ${new Date(rem.dueAt).toLocaleTimeString()} • Priority: ${String(rem.priority).toUpperCase()}`,
        details: {
          reminderId: rem.id,
          priority: rem.priority
        },
        timestamp: rem.createdAt || rem.dueAt,
        isCancellable: rem.status === 'pending',
        cancelEndpoint: `/api/reminders/${rem.id}`
      });
    }
  } catch (e) {}

  // Sort chronological descending
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return events.slice(0, limit);
}

