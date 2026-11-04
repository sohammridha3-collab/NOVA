/**
 * NOVA Backend — Stage 6 Knowledge & Workflows Tools Definition
 * Implements tools for querying indexed documents, managing personal memories,
 * and executing named reusable workflows.
 */

import { answerDocumentQuestion } from '../../knowledge/documentQaService.js';
import {
  createMemory,
  searchMemories,
  deleteMemory,
  listMemories
} from '../../knowledge/memoryService.js';
import {
  listWorkflows,
  runWorkflow,
  proposeWorkflow
} from '../../workflows/workflowEngine.js';

export const queryDocumentKnowledgeTool = {
  name: 'queryDocumentKnowledge',
  description: 'Search personal indexed PDF/TXT/Markdown documents. Returns answers grounded in retrieved passages with filename and page references, and distinguishes document-supported answers from general knowledge.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['query'],
    properties: {
      query: {
        type: 'string',
        description: 'Question or search phrase to look up in personal documents.',
        minLength: 2
      },
      topK: {
        type: 'integer',
        description: 'Maximum number of passage chunks to retrieve (default: 4).',
        minimum: 1,
        maximum: 10
      }
    }
  },
  validate(args = {}) {
    if (!args.query || typeof args.query !== 'string' || args.query.trim().length === 0) {
      return { valid: false, error: "Parameter 'query' is required and must be a non-empty string." };
    }
    return { valid: true };
  },
  async execute(args) {
    const result = await answerDocumentQuestion(args.query.trim(), {
      topK: args.topK || 4
    });
    return result;
  }
};

export const savePersonalMemoryTool = {
  name: 'savePersonalMemory',
  description: 'Explicitly store a user preference, habit, personal fact, or learning goal in persistent memory.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['keyName', 'valueText'],
    properties: {
      keyName: {
        type: 'string',
        description: 'Short identifier or topic of the memory (e.g., "coding_editor", "study_topic").',
        minLength: 1,
        maxLength: 128
      },
      valueText: {
        type: 'string',
        description: 'Detailed memory fact or preference to remember.',
        minLength: 1
      },
      category: {
        type: 'string',
        description: 'Optional category: personal, work, study, preference, fact.',
        enum: ['personal', 'work', 'study', 'preference', 'fact', 'general']
      }
    }
  },
  validate(args = {}) {
    if (!args.keyName || typeof args.keyName !== 'string' || args.keyName.trim().length === 0) {
      return { valid: false, error: "Parameter 'keyName' is required." };
    }
    if (!args.valueText || typeof args.valueText !== 'string' || args.valueText.trim().length === 0) {
      return { valid: false, error: "Parameter 'valueText' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    const record = await createMemory({
      category: args.category || 'general',
      keyName: args.keyName.trim(),
      valueText: args.valueText.trim()
    });
    return {
      memoryId: record.id,
      category: record.category,
      keyName: record.keyName,
      valueText: record.valueText,
      savedAt: record.createdAt
    };
  }
};

export const searchPersonalMemoriesTool = {
  name: 'searchPersonalMemories',
  description: 'Search previously stored explicit user memories, preferences, and personal facts.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['query'],
    properties: {
      query: {
        type: 'string',
        description: 'Search keyword for finding relevant memories.'
      }
    }
  },
  validate(args = {}) {
    if (!args.query || typeof args.query !== 'string') {
      return { valid: false, error: "Parameter 'query' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    const results = await searchMemories(args.query.trim());
    return {
      query: args.query,
      matchCount: results.length,
      memories: results.map((m) => ({
        id: m.id,
        category: m.category,
        keyName: m.keyName,
        valueText: m.valueText,
        updatedAt: m.updatedAt
      }))
    };
  }
};

export const deletePersonalMemoryTool = {
  name: 'deletePersonalMemory',
  description: 'Permanently remove an explicit personal memory by its ID. Consequential operation requiring operator confirmation.',
  requiresConfirmation: true,
  parameters: {
    type: 'object',
    required: ['memoryId'],
    properties: {
      memoryId: {
        type: 'string',
        description: 'The unique ID of the memory to delete.'
      },
      confirmed: {
        type: 'boolean',
        description: 'Must be true to execute deletion.'
      }
    }
  },
  validate(args = {}) {
    if (!args.memoryId || typeof args.memoryId !== 'string' || args.memoryId.trim().length === 0) {
      return { valid: false, error: "Parameter 'memoryId' is required." };
    }
    return { valid: true };
  },
  async execute(args, options = {}) {
    if (!options.confirmed && !args.confirmed) {
      const err = new Error('Confirmation required: deleting a personal memory is permanent.');
      err.code = 'CONFIRMATION_REQUIRED';
      err.statusCode = 409;
      throw err;
    }
    const result = await deleteMemory(args.memoryId.trim());
    return result;
  }
};

export const listWorkflowsTool = {
  name: 'listWorkflows',
  description: 'List all available built-in and custom workflows (e.g. "Start study mode", "Start coding mode").',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {}
  },
  validate() {
    return { valid: true };
  },
  async execute() {
    const workflows = await listWorkflows();
    return {
      workflowCount: workflows.length,
      workflows: workflows.map((w) => ({
        id: w.id,
        name: w.name,
        description: w.description,
        isBuiltin: w.isBuiltin,
        stepCount: w.stepCount
      }))
    };
  }
};

export const runWorkflowTool = {
  name: 'runWorkflow',
  description: 'Execute a named workflow by name or ID (such as "Start study mode" or "Start coding mode"). Executes sequentially and stops safely on failure.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['workflowName'],
    properties: {
      workflowName: {
        type: 'string',
        description: 'Name or ID of the workflow to run (e.g. "Start study mode", "start_study_mode", "Start coding mode").'
      },
      params: {
        type: 'object',
        description: 'Optional execution parameters (e.g. subject, durationMinutes, project).'
      },
      proposeOnly: {
        type: 'boolean',
        description: 'If true, returns proposed steps without executing them.'
      }
    }
  },
  validate(args = {}) {
    if (!args.workflowName || typeof args.workflowName !== 'string' || args.workflowName.trim().length === 0) {
      return { valid: false, error: "Parameter 'workflowName' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    if (args.proposeOnly) {
      return await proposeWorkflow(args.workflowName.trim(), args.params || {});
    }
    return await runWorkflow(args.workflowName.trim(), args.params || {});
  }
};

