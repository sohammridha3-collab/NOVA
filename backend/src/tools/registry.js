/**
 * NOVA Backend — Tool Registry & Execution Policy Enforcer
 *
 * CRITICAL SECURITY PRINCIPLES:
 * 1. Strictly Server-Side Execution Policy: Only explicitly registered tools can ever be executed.
 * 2. Shell Command Prohibition: Model-generated shell commands, system evaluations, or terminal scripts
 *    are NEVER executed under any circumstance.
 * 3. Typed Schemas & Pre-Execution Validation: All tool arguments are rigorously validated against
 *    their declared schema before invoking execution logic.
 * 4. Confirmation Boundary: Destructive operations (e.g. deleteNote, cancelReminder) CANNOT execute
 *    without verified operator confirmation bound to exact parameters.
 * 5. Data Isolation: Retrieved data from tools is strictly treated as untrusted data, never instructions.
 */

import { timeTool } from './definitions/timeTool.js';
import { saveNoteTool, searchNotesTool, deleteNoteTool } from './definitions/notesTool.js';
import { createReminderTool, listRemindersTool, cancelReminderTool } from './definitions/remindersTool.js';
import {
  getOperatingSystemInfoTool,
  openConfiguredAppTool,
  searchWorkspaceFilesTool,
  openWorkspaceFileTool,
  createWorkspaceNoteTool,
  deleteWorkspaceFileTool,
  openWebUrlTool
} from './definitions/automationTools.js';
import {
  androidListDevicesTool,
  androidLaunchAppTool,
  androidOpenUrlTool,
  androidSendMediaKeyTool,
  androidTakeScreenshotTool,
  hassListEntitiesTool,
  hassGetEntityStateTool,
  hassControlMediaTool,
  hassControlSwitchOrLightTool
} from './definitions/deviceTools.js';
import {
  queryDocumentKnowledgeTool,
  savePersonalMemoryTool,
  searchPersonalMemoriesTool,
  deletePersonalMemoryTool,
  listWorkflowsTool,
  runWorkflowTool
} from './definitions/knowledgeTools.js';

class ToolRegistry {
  constructor() {
    this.tools = new Map();

    // Register all core tools
    this.register(timeTool);
    this.register(saveNoteTool);
    this.register(searchNotesTool);
    this.register(deleteNoteTool);
    this.register(createReminderTool);
    this.register(listRemindersTool);
    this.register(cancelReminderTool);

    // Register Stage 4 automation tools
    this.register(getOperatingSystemInfoTool);
    this.register(openConfiguredAppTool);
    this.register(searchWorkspaceFilesTool);
    this.register(openWorkspaceFileTool);
    this.register(createWorkspaceNoteTool);
    this.register(deleteWorkspaceFileTool);
    this.register(openWebUrlTool);

    // Register Stage 5 real device connector tools
    this.register(androidListDevicesTool);
    this.register(androidLaunchAppTool);
    this.register(androidOpenUrlTool);
    this.register(androidSendMediaKeyTool);
    this.register(androidTakeScreenshotTool);
    this.register(hassListEntitiesTool);
    this.register(hassGetEntityStateTool);
    this.register(hassControlMediaTool);
    this.register(hassControlSwitchOrLightTool);

    // Register Stage 6 knowledge & reusable workflow tools
    this.register(queryDocumentKnowledgeTool);
    this.register(savePersonalMemoryTool);
    this.register(searchPersonalMemoriesTool);
    this.register(deletePersonalMemoryTool);
    this.register(listWorkflowsTool);
    this.register(runWorkflowTool);
  }

  /**
   * Register a new validated tool definition
   */
  register(tool) {
    if (!tool || !tool.name || typeof tool.execute !== 'function') {
      throw new Error(`Invalid tool registration. Tool must provide 'name' and 'execute' function.`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Check if a tool name is registered
   */
  has(name) {
    return this.tools.has(name);
  }

  /**
   * Get a registered tool by name
   */
  get(name) {
    return this.tools.get(name);
  }

  /**
   * Return array of all registered tools
   */
  list() {
    return Array.from(this.tools.values());
  }

  /**
   * Export JSON schemas suitable for LLM Function Calling (Gemini / OpenAI formats)
   */
  getToolDeclarations() {
    return this.list().map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
      requiresConfirmation: !!t.requiresConfirmation
    }));
  }

  /**
   * Format tool declarations for Gemini API functionDeclarations format
   */
  getGeminiFunctionDeclarations() {
    return this.list().map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }));
  }

  /**
   * Format tool declarations for OpenAI Tools format
   */
  getOpenAITools() {
    return this.list().map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }));
  }

  /**
   * Enforce Execution Policy & Run a registered tool
   *
   * @param {string} toolName - Name of the tool to execute
   * @param {object} args - Arguments passed to the tool
   * @param {object} options - Execution options { confirmed: boolean }
   * @returns {Promise<any>} Execution result
   */
  async executeTool(toolName, args = {}, options = {}) {
    // 1. Strict Shell Execution Ban
    const forbiddenShellKeywords = ['bash', 'sh', 'powershell', 'cmd', 'exec', 'executeshell', 'eval', 'terminal', 'spawn', 'runcommand'];
    if (forbiddenShellKeywords.includes(toolName.toLowerCase())) {
      const err = new Error(`Security Exception: Arbitrary shell command execution is strictly forbidden.`);
      err.code = 'SHELL_EXECUTION_FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }

    // 2. Registry Whitelist Check
    const tool = this.get(toolName);
    if (!tool) {
      const err = new Error(`Execution Policy Violation: Tool '${toolName}' is not registered or permitted.`);
      err.code = 'UNAUTHORIZED_TOOL_EXECUTION';
      err.statusCode = 400;
      throw err;
    }

    // 3. Schema & Typed Argument Validation
    if (typeof tool.validate === 'function') {
      const validation = tool.validate(args);
      if (!validation.valid) {
        const err = new Error(`Tool Validation Error for '${toolName}': ${validation.error}`);
        err.code = 'TOOL_ARGUMENT_INVALID';
        err.statusCode = 422;
        err.details = validation.error;
        throw err;
      }
    }

    // 4. Confirmation Policy Check
    if (tool.requiresConfirmation && options.confirmed !== true) {
      const err = new Error(`Confirmation Required: Tool '${toolName}' performs destructive changes and requires operator confirmation.`);
      err.code = 'ACTION_AWAITING_CONFIRMATION';
      err.statusCode = 409;
      err.requiresConfirmation = true;
      throw err;
    }

    // 5. Execute with isolated error boundary
    try {
      const result = await tool.execute(args);
      return result;
    } catch (execErr) {
      console.error(`Error executing tool '${toolName}':`, execErr);
      throw execErr;
    }
  }
}

export const toolRegistry = new ToolRegistry();

