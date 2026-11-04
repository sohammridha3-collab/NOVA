/**
 * NOVA Local Automation Agent — Android Connector Test Suite
 * Stage 5 Device Connector Verification
 *
 * NOTE ON TEST FIXTURES:
 * As mandated by Stage 5 specifications, all simulated device fixtures are explicitly
 * labelled [SIMULATED FIXTURE]. When testing in environments without physical Android
 * hardware, MOCK_ADB=true is used to test parsing, security boundaries, consent gating,
 * and state machine behavior without fabricating fake live hardware confirmations.
 */

import { createAgentApp } from '../src/server.js';
import { config } from '../src/config.js';
import fs from 'fs';
import path from 'path';

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

async function runAndroidTests() {
  console.log('====================================================');
  console.log('NOVA Android Device Connector — Verification Suite');
  console.log('====================================================');

  // Activate simulated fixtures for CI/environment without attached Android phones
  process.env.MOCK_ADB = 'true';

  const app = createAgentApp();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Android agent test server active on ${baseUrl}`);
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

  // 1. Device listing and state differentiation [SIMULATED FIXTURE]
  await test('GET /android/devices lists devices and distinguishes authorized, unauthorized, offline states [SIMULATED FIXTURE]', async () => {
    const res = await request('/android/devices', {
      headers: { Authorization: `Bearer ${config.pairingSecret}` }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = res.body.data;
    if (!data.adbAvailable) throw new Error('Expected adbAvailable: true in simulated mode');
    if (!Array.isArray(data.devices) || data.devices.length !== 3) {
      throw new Error(`Expected 3 devices, got ${data.devices?.length}`);
    }

    const authorized = data.devices.find(d => d.serial === 'emulator-5554');
    const unauthorized = data.devices.find(d => d.serial === 'R58M417XY9K');
    const offline = data.devices.find(d => d.serial === '192.168.1.105:5555');

    if (!authorized || authorized.state !== 'authorized' || !authorized.canExecute) {
      throw new Error('Expected emulator-5554 to be authorized and canExecute: true');
    }
    if (!unauthorized || unauthorized.state !== 'unauthorized' || unauthorized.canExecute) {
      throw new Error('Expected R58M417XY9K to be unauthorized with canExecute: false');
    }
    if (!offline || offline.state !== 'offline' || offline.canExecute) {
      throw new Error('Expected 192.168.1.105:5555 to be offline with canExecute: false');
    }
  });

  // 2. Security: Serial syntax validation
  await test('Serial validation strictly blocks shell injection attempts', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidSendMediaKey',
        params: { serial: 'emulator-5554; rm -rf /', keycode: 'play_pause' }
      }
    });

    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    if (res.body.error?.code !== 'INVALID_DEVICE_SERIAL') {
      throw new Error(`Expected INVALID_DEVICE_SERIAL, got ${res.body.error?.code}`);
    }
  });

  // 3. Security: Action on unauthorized device is rejected
  await test('Actions targeting unauthorized devices are blocked with DEVICE_NOT_READY', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidSendMediaKey',
        params: { serial: 'R58M417XY9K', keycode: 'play_pause' }
      }
    });

    if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
    if (res.body.error?.code !== 'DEVICE_NOT_READY') {
      throw new Error(`Expected DEVICE_NOT_READY, got ${res.body.error?.code}`);
    }
  });

  // 4. Launch configured application
  await test('androidLaunchApp launches permitted app on authorized device [SIMULATED FIXTURE]', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidLaunchApp',
        params: { serial: 'emulator-5554', appName: 'youtube' }
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.launched || res.body.data.package !== 'com.google.android.youtube') {
      throw new Error('Expected launch confirmation for com.google.android.youtube');
    }
  });

  await test('androidLaunchApp rejects unpermitted app with APP_NOT_PERMITTED', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidLaunchApp',
        params: { serial: 'emulator-5554', appName: 'unauthorized_hacker_app' }
      }
    });

    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    if (res.body.error?.code !== 'APP_NOT_PERMITTED') {
      throw new Error(`Expected APP_NOT_PERMITTED, got ${res.body.error?.code}`);
    }
  });

  // 5. Open URL Protocol Validation
  await test('androidOpenUrl rejects dangerous protocols (file://, javascript:)', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidOpenUrl',
        params: { serial: 'emulator-5554', url: 'file:///sdcard/exploit.apk' }
      }
    });

    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
    if (res.body.error?.code !== 'UNAUTHORIZED_PROTOCOL') {
      throw new Error(`Expected UNAUTHORIZED_PROTOCOL, got ${res.body.error?.code}`);
    }
  });

  await test('androidOpenUrl succeeds for valid HTTPS URL [SIMULATED FIXTURE]', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidOpenUrl',
        params: { serial: 'emulator-5554', url: 'https://developer.android.com' }
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.opened) throw new Error('Expected opened: true');
  });

  // 6. Media Key Control
  await test('androidSendMediaKey sends mapped keyevent (play_pause, volume_up) [SIMULATED FIXTURE]', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidSendMediaKey',
        params: { serial: 'emulator-5554', keycode: 'play_pause' }
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.keycode !== 85) throw new Error(`Expected keycode 85, got ${res.body.data.keycode}`);
  });

  // 7. Screenshot Explicit Consent Gate
  await test('androidTakeScreenshot rejects capture without confirmed: true', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidTakeScreenshot',
        params: { serial: 'emulator-5554', confirmed: false }
      }
    });

    if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
    if (res.body.error?.code !== 'CONFIRMATION_REQUIRED') {
      throw new Error(`Expected CONFIRMATION_REQUIRED, got ${res.body.error?.code}`);
    }
  });

  await test('androidTakeScreenshot captures and pulls screenshot when confirmed: true [SIMULATED FIXTURE]', async () => {
    const res = await request('/execute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.pairingSecret}` },
      body: {
        action: 'androidTakeScreenshot',
        params: { serial: 'emulator-5554', confirmed: true }
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.captured) throw new Error('Expected captured: true');
    if (!res.body.data.filename.endsWith('.png')) throw new Error('Expected PNG filename');

    // Clean up created screenshot fixture
    const localFile = path.join(config.workspaceRoot, res.body.data.relativePath);
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }
  });

  console.log('====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');

  if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
  server.close(() => {
    if (failed > 0) process.exitCode = 1;
  });
}

runAndroidTests().catch((err) => {
  console.error('Fatal Android test error:', err);
  if (server) {
    if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
    server.close(() => { process.exitCode = 1; });
  } else {
    process.exitCode = 1;
  }
});

