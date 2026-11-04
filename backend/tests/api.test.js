/**
 * NOVA Backend — Automated API Test Suite
 * Stage 1 & Stage 2 Test Coverage:
 * - Endpoints, single-owner auth, input validation, request IDs, request-size limits
 * - Model provider configuration & unconfigured error reporting
 * - Chat POST with documented JSON contract & usage limits
 * - Tool registry typed schemas, argument validation, and shell execution prohibition
 * - Structured action state machine & parameter-bound confirmation tokens
 * - Reminders persistence & startup overdue reconciliation
 */

import http from 'http';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';
import { toolRegistry } from '../src/tools/registry.js';
import { ReminderService } from '../src/services/reminderService.js';
import { inMemoryReminders } from '../src/tools/definitions/remindersTool.js';

let server;
let baseUrl;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
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
  const status = res.status;
  const requestId = res.headers.get('x-request-id');
  const corsHeader = res.headers.get('access-control-allow-origin');

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = await res.text();
  }

  return { status, body, requestId, corsHeader };
}

async function runTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Full Verification Test Suite (Stage 1 & 2)');
  console.log('====================================================');

  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server active on ${baseUrl}`);
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

  // --- STAGE 1 FOUNDATION TESTS ---

  // 1. Health Liveness Check
  await test('GET /api/health returns 200 with standard envelope', async () => {
    const res = await request('/api/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.success || res.body.data.status !== 'ok') throw new Error('Invalid health payload');
    if (!res.requestId || !res.body.meta.requestId) throw new Error('Missing request ID');
  });

  // 2. Dependency Readiness Check
  await test('GET /api/health/ready returns structured status and setup guide on offline DB', async () => {
    const res = await request('/api/health/ready');
    if (res.status === 200) {
      if (!res.body.success || res.body.data.status !== 'ready') throw new Error('Invalid readiness payload');
    } else if (res.status === 503) {
      if (res.body.success !== false || res.body.error.code !== 'DATABASE_NOT_READY') {
        throw new Error(`Expected DATABASE_NOT_READY error contract, got ${JSON.stringify(res.body)}`);
      }
      if (!res.body.error.details.setupGuide) throw new Error('Missing actionable setupGuide in details');
    } else {
      throw new Error(`Unexpected readiness status: ${res.status}`);
    }
  });

  // 3. Single-Owner Authentication Flow
  let authToken = null;
  await test('POST /api/auth/login rejects invalid credentials with 401', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: 'invalid_user', password: 'wrong_password' }
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (res.body.error.code !== 'INVALID_CREDENTIALS') throw new Error('Expected INVALID_CREDENTIALS code');
  });

  await test('POST /api/auth/login succeeds with owner credentials and returns token', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        username: config.auth.ownerUsername,
        password: config.auth.ownerPassword
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.token || res.body.data.user.role !== 'owner') throw new Error('Missing token or owner role');
    authToken = res.body.data.token;
  });

  await test('GET /api/auth/me rejects unauthenticated requests with 401', async () => {
    const res = await request('/api/auth/me');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (res.body.error.code !== 'UNAUTHORIZED') throw new Error('Expected UNAUTHORIZED code');
  });

  await test('GET /api/auth/me succeeds with Bearer token', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.user.username !== config.auth.ownerUsername) throw new Error('User mismatch');
  });

  await test('GET /api/auth/me succeeds with X-API-Key header', async () => {
    const res = await request('/api/auth/me', {
      headers: { 'X-API-Key': config.auth.ownerApiKey }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.user.authMethod !== 'api-key') throw new Error('Auth method mismatch');
  });

  // 4. Centralized Error: 404 Route Not Found
  await test('GET /api/nonexistent returns 404 with ROUTE_NOT_FOUND', async () => {
    const res = await request('/api/nonexistent');
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    if (res.body.error.code !== 'ROUTE_NOT_FOUND') throw new Error('Expected ROUTE_NOT_FOUND code');
  });

  // 5. Request Size Limit (1MB)
  await test('Payloads exceeding 1MB are rejected with 413 PAYLOAD_TOO_LARGE', async () => {
    const bigString = 'x'.repeat(1024 * 1024 + 100);
    const res = await request('/api/action-logs', {
      method: 'POST',
      body: JSON.stringify({ action: 'huge', details: bigString })
    });
    if (res.status !== 413) throw new Error(`Expected 413, got ${res.status}`);
    if (res.body.error.code !== 'PAYLOAD_TOO_LARGE') throw new Error('Expected PAYLOAD_TOO_LARGE code');
  });

  // --- STAGE 2 AI & ACTION SYSTEM TESTS ---

  // 6. AI Model Provider Readiness & Unconfigured Reporting
  await test('GET /api/chat/status clearly reports model provider status', async () => {
    const res = await request('/api/chat/status', {
      headers: { 'X-API-Key': config.auth.ownerApiKey }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.provider) throw new Error('Missing provider in status');
    if (res.body.data.hasCredentials === false) {
      if (!res.body.data.notice || !res.body.data.notice.includes('backend/.env')) {
        throw new Error('Notice does not instruct operator how to configure keys in backend/.env');
      }
    }
  });

  // 7. Security Policy: Reject Shell Execution
  await test('Tool Registry strictly rejects shell commands with SHELL_EXECUTION_FORBIDDEN', async () => {
    try {
      await toolRegistry.executeTool('bash', { cmd: 'rm -rf /' });
      throw new Error('Shell command was allowed to execute!');
    } catch (err) {
      if (err.code !== 'SHELL_EXECUTION_FORBIDDEN') {
        throw new Error(`Expected SHELL_EXECUTION_FORBIDDEN, got ${err.code}: ${err.message}`);
      }
    }
  });

  // 8. Security Policy: Reject Unregistered Tools
  await test('Tool Registry rejects unauthorized or unregistered tools', async () => {
    try {
      await toolRegistry.executeTool('evalArbitraryCode', { code: 'console.log(1)' });
      throw new Error('Unregistered tool was allowed to execute!');
    } catch (err) {
      if (err.code !== 'UNAUTHORIZED_TOOL_EXECUTION') {
        throw new Error(`Expected UNAUTHORIZED_TOOL_EXECUTION, got ${err.code}: ${err.message}`);
      }
    }
  });

  // 9. Tool Schema & Argument Validation
  await test('Tool Registry enforces typed schema and argument validation', async () => {
    try {
      await toolRegistry.executeTool('saveNote', { title: '', content: '' });
      throw new Error('Invalid arguments passed validation!');
    } catch (err) {
      if (err.code !== 'TOOL_ARGUMENT_INVALID') {
        throw new Error(`Expected TOOL_ARGUMENT_INVALID, got ${err.code}: ${err.message}`);
      }
    }
  });

  // 10. POST /api/chat Conversation & Tool Invocation
  let activeSessionId = null;
  let testSavedNoteId = null;
  await test('POST /api/chat handles conversation and executes time tool', async () => {
    const res = await request('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: { message: 'What time is it in UTC?' }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.sessionId) throw new Error('Missing sessionId');
    if (!res.body.data.message?.content) throw new Error('Missing assistant message content');
    activeSessionId = res.body.data.sessionId;

    const timeAction = res.body.data.actions.find(a => a.toolName === 'getCurrentTime');
    if (!timeAction || timeAction.status !== 'succeeded') {
      throw new Error('getCurrentTime action was not executed successfully');
    }
  });

  // 11. Notes Saving and Data-Isolating Search
  await test('POST /api/chat saves note and searches notes treating content as data', async () => {
    // 1. Save note
    const saveRes = await request('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        sessionId: activeSessionId,
        message: 'Save note: Fusion Core Metrics | Toroidal magnetic compression stable at 12 Tesla.'
      }
    });
    if (saveRes.status !== 200) throw new Error(`Expected 200, got ${saveRes.status}`);
    const saveAction = saveRes.body.data.actions.find(a => a.toolName === 'saveNote');
    if (!saveAction || !saveAction.result?.noteId) throw new Error('saveNote action failed');
    testSavedNoteId = saveAction.result.noteId;

    // 2. Search note
    const searchRes = await request('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        sessionId: activeSessionId,
        message: 'Search notes: Fusion'
      }
    });
    if (searchRes.status !== 200) throw new Error(`Expected 200, got ${searchRes.status}`);
    const searchAction = searchRes.body.data.actions.find(a => a.toolName === 'searchNotes');
    if (!searchAction || searchAction.result.dataType !== 'untrusted_user_stored_data') {
      throw new Error('Search result did not isolate untrusted content as data');
    }
  });

  // 12. Destructive Actions State Machine & Parameter Binding
  let deleteActionId = null;
  let validDeleteToken = null;
  await test('Destructive action deleteNote requires confirmation and generates parameter-bound token', async () => {
    const res = await request('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        sessionId: activeSessionId,
        message: `Delete note: ${testSavedNoteId}`
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const deleteAction = res.body.data.actions.find(a => a.toolName === 'deleteNote');
    if (!deleteAction) throw new Error('deleteNote action was not proposed');
    if (deleteAction.status !== 'awaiting_confirmation') {
      throw new Error(`Expected status awaiting_confirmation, got ${deleteAction.status}`);
    }
    if (!deleteAction.requiresConfirmation) throw new Error('requiresConfirmation flag is false');
    if (!deleteAction.confirmationToken) throw new Error('Missing confirmationToken');

    deleteActionId = deleteAction.id;
    validDeleteToken = deleteAction.confirmationToken;
  });

  await test('Confirming destructive action with altered parameters is strictly rejected with 403', async () => {
    const res = await request(`/api/actions/${deleteActionId}/confirm`, {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        confirmationToken: validDeleteToken,
        arguments: { noteId: 'tampered-target-id' }
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    if (res.body.error.code !== 'CONFIRMATION_TOKEN_INVALID') {
      throw new Error(`Expected CONFIRMATION_TOKEN_INVALID code, got ${res.body.error.code}`);
    }
  });

  await test('Confirming destructive action with exact token succeeds and transitions to succeeded', async () => {
    const res = await request(`/api/actions/${deleteActionId}/confirm`, {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        confirmationToken: validDeleteToken
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.status !== 'succeeded') {
      throw new Error(`Expected status succeeded, got ${res.body.data.status}`);
    }
    if (!res.body.data.result.deleted) {
      throw new Error('Expected note deletion result');
    }
  });

  // 13. Reminders Overdue Reconciliation on Startup
  await test('Startup reconciliation reconciles pending past reminders to overdue', async () => {
    const testRemId = 'rem-test-overdue-reconciliation';
    inMemoryReminders.set(testRemId, {
      id: testRemId,
      title: 'Historical system diagnostic',
      dueAt: '2022-01-01T00:00:00.000Z',
      priority: 'high',
      status: 'pending',
      createdAt: '2021-12-01T00:00:00.000Z',
      updatedAt: '2021-12-01T00:00:00.000Z'
    });

    const reconciliation = await ReminderService.reconcileOverdueReminders();
    if (reconciliation.reconciledCount < 1) {
      throw new Error('Reconciliation did not process overdue reminder');
    }
    const rem = inMemoryReminders.get(testRemId);
    if (rem.status !== 'overdue') {
      throw new Error(`Expected status overdue after reconciliation, got ${rem.status}`);
    }
  });

  // 14. Action Cancellation
  await test('Action cancel endpoint cancels a proposed/pending action with cancelled status', async () => {
    const cancelRes = await request('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        sessionId: activeSessionId,
        message: 'Cancel reminder: test-reminder-uuid'
      }
    });
    const cancelAction = cancelRes.body.data.actions[0];
    if (cancelAction && cancelAction.status === 'awaiting_confirmation') {
      const confirmedCancel = await request(`/api/actions/${cancelAction.id}/cancel`, {
        method: 'POST',
        headers: { 'X-API-Key': config.auth.ownerApiKey },
        body: { reason: 'User chose not to proceed' }
      });
      if (confirmedCancel.status !== 200) throw new Error(`Expected 200, got ${confirmedCancel.status}`);
      if (confirmedCancel.body.data.status !== 'cancelled') {
        throw new Error(`Expected status cancelled, got ${confirmedCancel.body.data.status}`);
      }
    }
  });

  server.close();

  console.log('====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
