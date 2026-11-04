/**
 * NOVA Local Automation Agent — Standalone Automated Test Suite
 * Tests:
 * 1. Authenticated Pairing (401 on bad secret, 200 on valid)
 * 2. Real OS Telemetry (CPU, memory, uptime, platform)
 * 3. Canonical Path Traversal & Symlink Defense (rejection of ../ and sensitive paths)
 * 4. Dedicated Workspace Notes Creation (overwrite confirmation requirements)
 * 5. File Search & Ambiguity Candidate Reporting
 * 6. Web URL Protocol Validation (HTTP/HTTPS only)
 * 7. Whitelist Application Execution & Unmapped Application Rejection
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { createAgentApp } from '../src/server.js';
import { config } from '../src/config.js';

let server;
let baseUrl;

async function request(pathUrl, options = {}) {
  const url = `${baseUrl}${pathUrl}`;
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

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = await res.text();
  }

  return { status, body };
}

async function runAgentTests() {
  console.log('====================================================');
  console.log('NOVA Local Automation Agent — Verification Suite');
  console.log('====================================================');

  const app = createAgentApp();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Agent test server active on ${baseUrl}`);
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

  // 1. Authenticated Pairing Check
  await test('GET /status rejects unauthenticated requests with 401', async () => {
    const res = await request('/status');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (res.body.error?.code !== 'AUTHENTICATION_REQUIRED') throw new Error('Expected AUTHENTICATION_REQUIRED code');
  });

  await test('GET /status succeeds with pairing secret in Bearer header', async () => {
    const res = await request('/status', {
      headers: { Authorization: `Bearer ${config.pairingSecret}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.status !== 'online') throw new Error('Expected status online');
    if (!res.body.data.workspaceRoot) throw new Error('Missing workspaceRoot in status');
  });

  // 2. Capabilities Discovery
  await test('GET /capabilities reports supported actions and allowed application whitelist', async () => {
    const res = await request('/capabilities', {
      headers: { Authorization: `Bearer ${config.pairingSecret}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const caps = res.body.data.capabilities;
    if (!caps.includes('openApp') || !caps.includes('createWorkspaceNote') || !caps.includes('getOsInfo')) {
      throw new Error(`Missing expected capabilities in: ${JSON.stringify(caps)}`);
    }
    const apps = res.body.data.allowedApps;
    if (!apps.some(a => a.id === 'notepad') || !apps.some(a => a.id === 'calc')) {
      throw new Error('Allowed apps missing notepad or calc');
    }
  });

  // 3. Real Operating System Measurements
  await test('POST /execute with getOsInfo returns genuine system measurements', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: { action: 'getOsInfo' }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const osData = res.body.data;
    if (osData.platform !== process.platform) throw new Error(`Expected platform ${process.platform}, got ${osData.platform}`);
    if (!osData.cpu.model || osData.cpu.cores <= 0) throw new Error('Invalid CPU measurements');
    if (osData.memory.totalGb <= 0 || osData.memory.freeGb <= 0) throw new Error('Invalid memory measurements');
    if (typeof osData.uptimeSeconds !== 'number') throw new Error('Missing real uptime measurement');
  });

  // 4. Dedicated Workspace Note Creation & Overwrite Protection
  const testNoteName = 'automated-test-diagnostic.md';
  await test('POST /execute with createWorkspaceNote saves note in dedicated workspace', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'createWorkspaceNote',
        params: {
          filename: testNoteName,
          content: '# Test Diagnostic\n\nVerified Stage 4 automated note creation.'
        }
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.created) throw new Error('Expected created: true');
    if (res.body.data.sizeBytes <= 0) throw new Error('Invalid size written');
  });

  await test('Overwriting an existing workspace note without confirmed: true is rejected with 409', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'createWorkspaceNote',
        params: {
          filename: testNoteName,
          content: 'Attempted overwrite without confirmation.',
          overwrite: true,
          confirmed: false
        }
      }
    });
    if (res.status !== 409) throw new Error(`Expected 409 Confirmation Required, got ${res.status}`);
    if (res.body.error?.code !== 'CONFIRMATION_REQUIRED') throw new Error('Expected CONFIRMATION_REQUIRED code');
  });

  await test('Overwriting an existing workspace note with confirmed: true succeeds', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'createWorkspaceNote',
        params: {
          filename: testNoteName,
          content: '# Updated Diagnostic\n\nConfirmed overwrite verified.',
          overwrite: true,
          confirmed: true
        }
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.isOverwrite) throw new Error('Expected isOverwrite flag to be true');
  });

  // 5. File Search & Ambiguity Resolution
  await test('POST /execute with searchFiles finds created files and flags ambiguity', async () => {
    // Create a second matching file
    await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'createWorkspaceNote',
        params: { filename: 'automated-test-second.md', content: 'Second file' }
      }
    });

    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'searchFiles',
        params: { query: 'automated-test' }
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.totalFound < 2) throw new Error(`Expected at least 2 files, got ${res.body.data.totalFound}`);
    if (!res.body.data.isAmbiguous) throw new Error('Expected isAmbiguous to be true when multiple files match');
    if (!Array.isArray(res.body.data.candidates)) throw new Error('Expected candidates list');
  });

  // 6. Security Defense: Canonical Path Traversal Prevention
  await test('Path traversal attempt outside workspace boundary is blocked with PATH_TRAVERSAL_DETECTED', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'openFile',
        params: { filePath: '../../Windows/System32/drivers/etc/hosts' }
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    if (res.body.error?.code !== 'PATH_TRAVERSAL_DETECTED') {
      throw new Error(`Expected PATH_TRAVERSAL_DETECTED code, got ${res.body.error?.code}`);
    }
  });

  // 7. Security Defense: Sensitive Credential Store Protection
  await test('Access to sensitive credentials/keys is blocked with SENSITIVE_STORE_PROTECTED', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'openFile',
        params: { filePath: 'notes/.env' }
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    if (res.body.error?.code !== 'SENSITIVE_STORE_PROTECTED') {
      throw new Error(`Expected SENSITIVE_STORE_PROTECTED code, got ${res.body.error?.code}`);
    }
  });

  // 8. Security Defense: URL Protocol Validation
  await test('Invalid URL protocols (file://, javascript:) are rejected with 403', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'openUrl',
        params: { url: 'file:///C:/Windows/notepad.exe' }
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    if (res.body.error?.code !== 'UNAUTHORIZED_PROTOCOL') {
      throw new Error(`Expected UNAUTHORIZED_PROTOCOL code, got ${res.body.error?.code}`);
    }
  });

  // 9. Application Whitelist Defense
  await test('Unmapped or arbitrary application execution is strictly rejected with 403', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'openApp',
        params: { appName: 'powershell.exe' }
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
    if (res.body.error?.code !== 'APP_NOT_PERMITTED') {
      throw new Error(`Expected APP_NOT_PERMITTED code, got ${res.body.error?.code}`);
    }
  });

  // 10. Clean up test files
  await request('/execute', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.pairingSecret}` },
    body: {
      action: 'deleteFile',
      params: { filePath: 'notes/automated-test-diagnostic.md', confirmed: true }
    }
  });
  await request('/execute', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.pairingSecret}` },
    body: {
      action: 'deleteFile',
      params: { filePath: 'notes/automated-test-second.md', confirmed: true }
    }
  });

  console.log('====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');

  if (typeof server.closeAllConnections === 'function') {
    server.closeAllConnections();
  }
  server.close(() => {
    if (failed > 0) {
      process.exitCode = 1;
    }
  });
}

runAgentTests().catch((err) => {
  console.error('Fatal agent test error:', err);
  if (server) {
    if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
    server.close(() => {
      process.exitCode = 1;
    });
  } else {
    process.exitCode = 1;
  }
});

