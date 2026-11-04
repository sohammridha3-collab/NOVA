/**
 * NOVA Backend — Local Automation Tools Definitions
 * Connects the AI model and tool registry to the local Windows automation agent.
 *
 * Enforces:
 * - Application whitelist (no shell execution)
 * - Canonical workspace containment & symlink defense
 * - Destructive action confirmation (file overwrite / delete)
 * - Safe URL validation
 * - Real OS telemetry
 */

import { automationService } from '../../automation/automationService.js';

export const getOperatingSystemInfoTool = {
  name: 'getOperatingSystemInfo',
  description: 'Report real hardware and operating system telemetry for this Windows host, including platform, architecture, CPU specifications, memory usage, and system uptime.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {}
  },
  validate() {
    return { valid: true };
  },
  async execute() {
    return await automationService.execute('getOsInfo', {});
  }
};

export const openConfiguredAppTool = {
  name: 'openConfiguredApp',
  description: 'Open a pre-approved Windows application from the allowed whitelist (notepad, calc, explorer, paint, edge), optionally targeting a safe workspace file.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['appName'],
    properties: {
      appName: {
        type: 'string',
        enum: ['notepad', 'calc', 'calculator', 'explorer', 'paint', 'edge'],
        description: 'Whitelist application identifier to open.'
      },
      filePath: {
        type: 'string',
        description: 'Optional path of a workspace file to open with the application.'
      }
    }
  },
  validate(args = {}) {
    if (!args.appName || typeof args.appName !== 'string') {
      return { valid: false, error: "Parameter 'appName' is required." };
    }
    const allowed = ['notepad', 'calc', 'calculator', 'explorer', 'paint', 'edge'];
    if (!allowed.includes(args.appName.toLowerCase().trim())) {
      return { valid: false, error: `Application '${args.appName}' is not permitted. Allowed: ${allowed.join(', ')}` };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('openApp', {
      appName: args.appName.toLowerCase().trim(),
      filePath: args.filePath
    });
  }
};

export const searchWorkspaceFilesTool = {
  name: 'searchWorkspaceFiles',
  description: 'Search for files inside the dedicated NOVA workspace. Returns candidate matches and flags ambiguity if multiple matches are found.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['query'],
    properties: {
      query: {
        type: 'string',
        description: 'File name pattern or search text.'
      },
      subfolder: {
        type: 'string',
        description: 'Optional subfolder within workspace to restrict the search (e.g. "notes").'
      }
    }
  },
  validate(args = {}) {
    if (!args.query || typeof args.query !== 'string' || args.query.trim().length === 0) {
      return { valid: false, error: "Parameter 'query' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('searchFiles', {
      query: args.query.trim(),
      subfolder: args.subfolder
    });
  }
};

export const openWorkspaceFileTool = {
  name: 'openWorkspaceFile',
  description: 'Open a verified file inside the dedicated NOVA workspace using the Windows default file handler.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['filePath'],
    properties: {
      filePath: {
        type: 'string',
        description: 'Relative path of the file within the workspace (e.g. "notes/meeting.md").'
      }
    }
  },
  validate(args = {}) {
    if (!args.filePath || typeof args.filePath !== 'string' || args.filePath.trim().length === 0) {
      return { valid: false, error: "Parameter 'filePath' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('openFile', {
      filePath: args.filePath.trim()
    });
  }
};

export const createWorkspaceNoteTool = {
  name: 'createWorkspaceNote',
  description: 'Create or update a markdown note inside the dedicated NOVA workspace notes directory (workspace/notes). Overwriting requires confirmed: true.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['filename', 'content'],
    properties: {
      filename: {
        type: 'string',
        description: 'Note filename ending in .md or .txt (e.g. "project-brief.md").'
      },
      content: {
        type: 'string',
        description: 'Content of the note to write.'
      },
      overwrite: {
        type: 'boolean',
        description: 'Whether to allow overwriting if the file already exists.'
      },
      confirmed: {
        type: 'boolean',
        description: 'Explicit confirmation when overwriting an existing file.'
      }
    }
  },
  validate(args = {}) {
    if (!args.filename || typeof args.filename !== 'string' || args.filename.trim().length === 0) {
      return { valid: false, error: "Parameter 'filename' is required." };
    }
    if (typeof args.content !== 'string') {
      return { valid: false, error: "Parameter 'content' must be a string." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('createWorkspaceNote', {
      filename: args.filename.trim(),
      content: args.content,
      overwrite: !!args.overwrite,
      confirmed: !!args.confirmed
    });
  }
};

export const deleteWorkspaceFileTool = {
  name: 'deleteWorkspaceFile',
  description: 'Permanently delete a file within the NOVA workspace. Destructive operation that strictly requires operator confirmation.',
  requiresConfirmation: true,
  parameters: {
    type: 'object',
    required: ['filePath'],
    properties: {
      filePath: {
        type: 'string',
        description: 'Relative path of the workspace file to permanently delete.'
      },
      confirmed: {
        type: 'boolean',
        description: 'Explicit confirmation flag.'
      }
    }
  },
  validate(args = {}) {
    if (!args.filePath || typeof args.filePath !== 'string' || args.filePath.trim().length === 0) {
      return { valid: false, error: "Parameter 'filePath' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('deleteFile', {
      filePath: args.filePath.trim(),
      confirmed: true
    });
  }
};

export const openWebUrlTool = {
  name: 'openWebUrl',
  description: 'Safely open a validated HTTP or HTTPS URL in the default web browser.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['url'],
    properties: {
      url: {
        type: 'string',
        description: 'HTTP or HTTPS web address to navigate to.'
      }
    }
  },
  validate(args = {}) {
    if (!args.url || typeof args.url !== 'string') {
      return { valid: false, error: "Parameter 'url' is required." };
    }
    try {
      const parsed = new URL(args.url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: `Invalid protocol '${parsed.protocol}'. Only http: and https: are allowed.` };
      }
    } catch (e) {
      return { valid: false, error: `Malformed URL: ${e.message}` };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('openUrl', {
      url: args.url.trim()
    });
  }
};

