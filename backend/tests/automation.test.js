/**
 * NOVA Backend — Stage 4 Local Automation Integration Test Suite
 * Covers:
 * 1. Tool Registry registration & schemas for Stage 4 tools
 * 2. Shell execution prohibition
 * 3. Authenticated Agent connectivity via AutomationService
 * 4. Genuine OS telemetry retrieval
 * 5. Workspace note creation and search
 * 6. File deletion confirmation policy & execution
 * 7. Chat controller integration with local automation intent matching
 * 8. Cancellation notice metadata delivery
 */

import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';
import { toolRegistry } from '../src/tools/registry.js';
import { createAgentApp } from '../../agent/src/server.js';
import { automationService } from '../src/automation/automationService.js';
import { ActionService } from '../src/services/actionService.js';

let backendServer;
let backendBaseUrl;
let agentServer;
let agentBaseUrl;

async function requestBackend(path, options = {}) {
  const url = `${backendBaseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = await res.text();
  }

  return { status: res.status, body, headers: res.headers };
}

async function runAutomationTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Stage 4 Automation Test Suite');
  console.log('====================================================');

  // 1. Start agent test instance
  const agentApp = createAgentApp();
  await new Promise((resolve) => {
    agentServer = agentApp.listen(0, '127.0.0.1', () => {
      const port = agentServer.address().port;
      agentBaseUrl = `http://127.0.0.1:${port}`;
      console.log(`Agent test instance active on ${agentBaseUrl}`);
      config.automation.agentUrl = agentBaseUrl;
      automationService.baseUrl = agentBaseUrl;
      resolve();
    });
  });

  // 2. Start backend test instance
  const backendApp = createApp();
  await new Promise((resolve) => {
    backendServer = backendApp.listen(0, () => {
      const port = backendServer.address().port;
      backendBaseUrl = `http://localhost:${port}`;
      console.log(`Backend test instance active on ${backendBaseUrl}`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // 1. Tool Registry Verification
  await test('Stage 4 automation tools are registered in toolRegistry', async () => {
    const requiredTools = [
      'getOperatingSystemInfo',
      'openConfiguredApp',
      'searchWorkspaceFiles',
      'openWorkspaceFile',
      'createWorkspaceNote',
      'deleteWorkspaceFile',
      'openWebUrl'
    ];

    for (const toolName of requiredTools) {
      if (!toolRegistry.has(toolName)) {
        throw new Error(`Tool '${toolName}' is not registered in ToolRegistry`);
      }
    }
  });

  // 2. Shell Execution Ban Check
  await test('ToolRegistry strictly prohibits arbitrary shell executions', async () => {
    try {
      await toolRegistry.executeTool('powershell', { cmd: 'dir' });
      throw new Error('Expected shell execution to throw');
    } catch (err) {
      if (err.code !== 'SHELL_EXECUTION_FORBIDDEN') {
        throw new Error(`Expected SHELL_EXECUTION_FORBIDDEN, got ${err.code}`);
      }
    }
  });

  // 3. Confirmation Policy on Destructive Automation Tools
  await test('deleteWorkspaceFile enforces requiresConfirmation: true', async () => {
    const tool = toolRegistry.get('deleteWorkspaceFile');
    if (!tool.requiresConfirmation) {
      throw new Error('deleteWorkspaceFile must have requiresConfirmation: true');
    }

    try {
      await toolRegistry.executeTool('deleteWorkspaceFile', { filePath: 'notes/test.md' }, { confirmed: false });
      throw new Error('Expected unconfirmed deleteWorkspaceFile to throw');
    } catch (err) {
      if (err.code !== 'ACTION_AWAITING_CONFIRMATION') {
        throw new Error(`Expected ACTION_AWAITING_CONFIRMATION, got ${err.code}`);
      }
    }
  });

  // 4. Backend Automation Status & Capabilities Endpoints
  await test('GET /api/automation/status reports agent status and platform info', async () => {
    const res = await requestBackend('/api/automation/status');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.online) throw new Error('Expected agent to be reported online');
    if (res.body.data.service !== 'nova-local-automation-agent') {
      throw new Error(`Expected service name nova-local-automation-agent, got ${res.body.data.service}`);
    }
  });

  await test('GET /api/automation/capabilities reports available capabilities and app whitelist', async () => {
    const res = await requestBackend('/api/automation/capabilities');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const caps = res.body.data.capabilities;
    if (!Array.isArray(caps) || !caps.includes('openApp') || !caps.includes('getOsInfo')) {
      throw new Error('Missing expected capabilities in list');
    }
    const apps = res.body.data.allowedApps;
    if (!Array.isArray(apps) || apps.length < 5) {
      throw new Error('Expected allowedApps list with at least 5 apps');
    }
  });

  // 5. OS Telemetry Execution via Tool
  await test('getOperatingSystemInfo returns genuine measurements', async () => {
    const result = await toolRegistry.executeTool('getOperatingSystemInfo', {});
    if (!result.hostname || !result.osType || !result.memory?.totalBytes) {
      throw new Error('Invalid OS telemetry payload');
    }
    if (typeof result.uptimeSeconds !== 'number' || result.uptimeSeconds < 0) {
      throw new Error('Invalid uptime measurement');
    }
  });

  // 6. Dedicated Workspace Note Creation & Search
  const testFilename = 'integration-test-note.md';
  await test('createWorkspaceNote creates note in workspace/notes', async () => {
    const result = await toolRegistry.executeTool('createWorkspaceNote', {
      filename: testFilename,
      content: '# Integration Test\nVerified Stage 4 pipeline.'
    });
    if (result.filename !== testFilename) throw new Error(`Expected filename ${testFilename}, got ${result.filename}`);
    if (!result.created) throw new Error(`Expected created: true, got ${result.created}`);
  });

  await test('searchWorkspaceFiles locates created test note', async () => {
    const result = await toolRegistry.executeTool('searchWorkspaceFiles', {
      query: 'integration-test'
    });
    if (result.totalFound < 1) throw new Error('Expected to find created test note');
    const found = result.candidates.find(c => c.name === testFilename || c.relativePath.includes(testFilename));
    if (!found) throw new Error('Created note not in candidate list');
  });

  // 7. Destructive Action Confirmation Lifecycle
  await test('deleteWorkspaceFile deletes note when confirmed: true', async () => {
    const result = await toolRegistry.executeTool('deleteWorkspaceFile', {
      filePath: `notes/${testFilename}`,
      confirmed: true
    }, { confirmed: true });
    if (!result.deleted) throw new Error('Expected deleted: true');
  });

  // 8. Chat Controller Integration Turn
  let testSessionId;
  await test('POST /api/chat with "system info" returns structured OS action', async () => {
    const res = await requestBackend('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        message: 'system info'
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    testSessionId = res.body.data.sessionId;
    const actions = res.body.data.actions;
    if (!Array.isArray(actions) || actions.length === 0) {
      throw new Error('Expected at least one action returned');
    }
    const osAction = actions.find(a => a.toolName === 'getOperatingSystemInfo');
    if (!osAction) throw new Error('Expected getOperatingSystemInfo action in actions list');
    if (osAction.status !== 'succeeded') {
      throw new Error(`Expected action status succeeded, got ${osAction.status}`);
    }
    if (!res.body.data.message.content.includes('Host System Telemetry')) {
      throw new Error('Expected assistant message to contain telemetry description');
    }
  });

  // 9. Chat Controller Destructive Action Proposal & Cancellation Notice
  await test('POST /api/chat with delete request generates awaiting_confirmation action', async () => {
    const res = await requestBackend('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        sessionId: testSessionId,
        message: 'delete workspace file notes/obsolete.md'
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const actions = res.body.data.actions;
    const delAction = actions.find(a => a.toolName === 'deleteWorkspaceFile');
    if (!delAction) throw new Error('Expected deleteWorkspaceFile action');
    if (delAction.status !== 'awaiting_confirmation') {
      throw new Error(`Expected status awaiting_confirmation, got ${delAction.status}`);
    }
    if (!delAction.confirmationToken) {
      throw new Error('Expected cryptographic confirmationToken to be generated');
    }

    // Cancel the action and check cancel response
    const cancelRes = await requestBackend(`/api/actions/${delAction.id}/cancel`, {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: { reason: 'Operator cancelled test action' }
    });
    if (cancelRes.status !== 200) throw new Error(`Expected 200, got ${cancelRes.status}`);
    if (cancelRes.body.data.status !== 'cancelled') {
      throw new Error(`Expected status cancelled, got ${cancelRes.body.data.status}`);
    }
  });

  console.log('====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');

  if (typeof agentServer.closeAllConnections === 'function') agentServer.closeAllConnections();
  if (typeof backendServer.closeAllConnections === 'function') backendServer.closeAllConnections();

  agentServer.close(() => {
    backendServer.close(() => {
      if (failed > 0) process.exitCode = 1;
    });
  });
}

runAutomationTests().catch((err) => {
  console.error('Fatal automation test error:', err);
  if (agentServer) agentServer.close();
  if (backendServer) backendServer.close();
  process.exitCode = 1;
});
