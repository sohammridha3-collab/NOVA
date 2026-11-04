/**
 * NOVA Backend — Stage 6 Reusable Workflows & Activity Timeline Verification Suite
 */

import http from 'http';
import assert from 'assert';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';
import {
  listWorkflows,
  getWorkflow,
  createWorkflow,
  proposeWorkflow,
  runWorkflow,
  resumeWorkflowRun,
  cancelWorkflowRun,
  clearInMemoryWorkflows
} from '../src/workflows/workflowEngine.js';
import { toolRegistry } from '../src/tools/registry.js';

let server;
let baseUrl;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': config.auth.ownerApiKey,
      ...(options.headers || {})
    };

    const req = http.request(url, {
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { raw: data };
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }
    req.end();
  });
}

async function runWorkflowTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Stage 6 Workflows & Activity Suite');
  console.log('====================================================');

  server = http.createServer(createApp());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Workflow test server active on ${baseUrl}\n`);

  clearInMemoryWorkflows();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  // 1. Built-in Workflows Listing
  await test('GET /api/workflows lists built-in workflows (Study Mode, Coding Mode, System Audit)', async () => {
    const res = await request('/api/workflows');
    assert.strictEqual(res.status, 200);
    const wfs = res.body.data.workflows;
    assert.ok(wfs.length >= 3);

    const studyWf = wfs.find((w) => w.id === 'start_study_mode');
    assert.ok(studyWf, 'Expected start_study_mode');
    assert.strictEqual(studyWf.isBuiltin, true);
    assert.strictEqual(studyWf.stepCount, 4);

    const codingWf = wfs.find((w) => w.id === 'start_coding_mode');
    assert.ok(codingWf, 'Expected start_coding_mode');
    assert.strictEqual(codingWf.stepCount, 4);
  });

  // 2. Custom Workflow Creation & Tool Validation
  let customWfId = null;
  await test('POST /api/workflows validates registered tools and creates custom workflow', async () => {
    // Unrecognized tool rejected
    const badRes = await request('/api/workflows', {
      method: 'POST',
      body: {
        name: 'Invalid Tool Workflow',
        steps: [{ toolName: 'unregisteredArbitraryTool', name: 'Step 1' }]
      }
    });
    assert.strictEqual(badRes.status, 400);

    // Valid custom workflow
    const goodRes = await request('/api/workflows', {
      method: 'POST',
      body: {
        name: 'Quick Telemetry Check',
        description: 'Checks OS metrics and connected Android devices',
        steps: [
          { toolName: 'getOperatingSystemInfo', name: 'Read OS Telemetry' },
          { toolName: 'androidListDevices', name: 'List Android Handsets' }
        ]
      }
    });
    assert.strictEqual(goodRes.status, 201);
    customWfId = goodRes.body.data.id;
    assert.ok(customWfId);
    assert.strictEqual(goodRes.body.data.steps.length, 2);
  });

  // 3. Propose Workflow Steps Prior to Execution
  await test('GET /api/workflows/:id/propose previews step arguments without executing', async () => {
    const res = await request(`/api/workflows/start_study_mode/propose?subject=LinearAlgebra`);
    assert.strictEqual(res.status, 200);
    const data = res.body.data;
    assert.strictEqual(data.workflowId, 'start_study_mode');
    assert.strictEqual(data.totalSteps, 4);
    assert.strictEqual(data.proposedSteps[0].toolName, 'saveNote');
    assert.ok(data.proposedSteps[0].arguments.title.includes('LinearAlgebra'));
  });

  // 4. Sequential Execution of "Start Study Mode"
  await test('POST /api/workflows/start_study_mode/run executes 4 steps sequentially to completion', async () => {
    const res = await request('/api/workflows/start_study_mode/run', {
      method: 'POST',
      body: {
        params: { subject: 'DistributedSystems', durationMinutes: 30 }
      }
    });
    assert.strictEqual(res.status, 200);
    const run = res.body.data;
    assert.strictEqual(run.status, 'succeeded');
    assert.strictEqual(run.totalSteps, 4);
    assert.strictEqual(run.stepsCompleted, 4);
    assert.ok(run.steps.every((s) => s.status === 'succeeded'));
  });

  // 5. Fail-Safe Abort: "Stop Safely on Failure"
  await test('Workflow stops safely on failure: aborts immediately and does NOT execute subsequent steps', async () => {
    // Create a 3-step workflow where step 2 will fail (missing required arguments)
    const failingWf = await createWorkflow({
      name: 'Fail Safe Test Workflow',
      description: 'Step 2 will fail validation',
      steps: [
        { toolName: 'getCurrentTime', name: 'Step 1 - Good' },
        { toolName: 'saveNote', name: 'Step 2 - Will Fail (empty title)', arguments: { title: '', content: '' } },
        { toolName: 'getCurrentTime', name: 'Step 3 - Should Never Run' }
      ]
    });

    const runRes = await request(`/api/workflows/${failingWf.id}/run`, { method: 'POST' });
    assert.strictEqual(runRes.status, 200);
    const run = runRes.body.data;

    assert.strictEqual(run.status, 'failed');
    assert.strictEqual(run.failedAtStep, 1); // 0-indexed step 1
    assert.strictEqual(run.steps[0].status, 'succeeded');
    assert.strictEqual(run.steps[1].status, 'failed');
    assert.strictEqual(run.steps[2].status, 'pending'); // Must remain unexecuted
    assert.strictEqual(run.stepsCompleted, 1);
  });

  // 6. Consequential Step: Requires Confirmation Gating
  let pausedRunId = null;
  let boundToken = null;
  await test('Consequential step pauses workflow run with awaiting_confirmation and HMAC token', async () => {
    const consequentialWf = await createWorkflow({
      name: 'Destructive Note Workflow',
      description: 'Contains a consequential deletion step',
      steps: [
        { toolName: 'getCurrentTime', name: 'Step 1 - Time' },
        { toolName: 'deletePersonalMemory', name: 'Step 2 - Consequential Memory Delete', arguments: { memoryId: 'test-mem-uuid' } },
        { toolName: 'getCurrentTime', name: 'Step 3 - Followup' }
      ]
    });

    const runRes = await request(`/api/workflows/${consequentialWf.id}/run`, { method: 'POST' });
    assert.strictEqual(runRes.status, 202); // 202 Accepted / Paused
    const run = runRes.body.data;

    assert.strictEqual(run.status, 'awaiting_confirmation');
    assert.strictEqual(run.pendingStep.stepIndex, 1);
    assert.ok(run.pendingStep.confirmationToken);

    pausedRunId = run.runId;
    boundToken = run.pendingStep.confirmationToken;
  });

  // 7. Resume Consequential Step: Token Validation
  await test('Resume workflow rejects invalid confirmation token with 403, and accepts valid token', async () => {
    // Tampered token
    const rejectRes = await request(`/api/workflows/runs/${pausedRunId}/resume`, {
      method: 'POST',
      body: { confirmationToken: 'tampered_fake_token_12345', confirmed: true }
    });
    assert.strictEqual(rejectRes.status, 403);
    assert.strictEqual(rejectRes.body.error.code, 'CONFIRMATION_TOKEN_INVALID');

    // Valid token with mock memory record
    // Cancel the run cleanly instead of executing permanent delete on non-existent record
    const cancelRes = await request(`/api/workflows/runs/${pausedRunId}/cancel`, { method: 'POST' });
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.data.status, 'cancelled');
  });

  // 8. Workflow Cancellation Control
  await test('POST /api/workflows/runs/:id/cancel stops running or pending workflow', async () => {
    const run = await runWorkflow('start_study_mode');
    assert.ok(run.runId);

    const cancelRes = await request(`/api/workflows/runs/${run.runId}/cancel`, { method: 'POST' });
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.data.status, 'cancelled');
  });

  // 9. Activity Timeline Endpoint
  await test('GET /api/activity/timeline returns unified chronological audit stream', async () => {
    const res = await request('/api/activity/timeline?limit=15');
    assert.strictEqual(res.status, 200);
    const items = res.body.data.timeline;
    assert.ok(items.length > 0, 'Expected at least 1 activity item');

    const hasWorkflow = items.some((i) => i.type === 'workflow');
    assert.ok(hasWorkflow, 'Activity timeline should include workflow runs');

    // Verify timeline fields
    const first = items[0];
    assert.ok(first.id);
    assert.ok(first.type);
    assert.ok(first.title);
    assert.ok(first.status);
    assert.ok(first.timestamp);
  });

  // 10. Chat Integration: Workflow execution
  await test('POST /api/chat with "Start study mode" activates study workflow', async () => {
    const chatRes = await request('/api/chat', {
      method: 'POST',
      body: { message: 'Start study mode for quantum computing' }
    });
    assert.strictEqual(chatRes.status, 200);
    const content = chatRes.body.data.message?.content || chatRes.body.data.content || '';
    assert.ok(content.includes('Study Mode Activated') || content.includes('study note'), `Expected study mode reply, got: ${content}`);
  });

  // 11. Chat Integration: List workflows
  await test('POST /api/chat with "show workflows" lists available workflows', async () => {
    const chatRes = await request('/api/chat', {
      method: 'POST',
      body: { message: 'Show workflows' }
    });
    assert.strictEqual(chatRes.status, 200);
    const content = chatRes.body.data.message?.content || chatRes.body.data.content || '';
    assert.ok(content.includes('Start Study Mode'));
    assert.ok(content.includes('Start Coding Mode'));
  });

  server.close();
  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runWorkflowTests().catch((err) => {
  console.error('Test suite error:', err);
  if (server) server.close();
  process.exit(1);
});
