/**
 * NOVA Backend — Stage 5 Real Device Connectors Test Suite
 * Covers:
 * 1. Tool Registry registration for Android & Home Assistant tools
 * 2. Explicit User Consent gate for Android Screenshots (requiresConfirmation: true)
 * 3. Android device state machine (authorized, unauthorized, offline) [SIMULATED FIXTURE]
 * 4. Home Assistant entity discovery & supported features bitmask evaluation
 * 5. Rejection of unsupported operations on TVs (no invented capabilities)
 * 6. Honest handling of 'unavailable' devices
 * 7. Ambiguity detection and candidate reporting
 * 8. Chat controller turn execution
 */

import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';
import { toolRegistry } from '../src/tools/registry.js';
import { createAgentApp } from '../../agent/src/server.js';
import { automationService } from '../src/automation/automationService.js';
import { homeAssistantService } from '../src/services/homeAssistantService.js';

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

async function runDeviceTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Stage 5 Device Connectors Test Suite');
  console.log('====================================================');

  // Set mock flags for test fixtures
  process.env.MOCK_ADB = 'true';
  process.env.MOCK_HASS = 'true';

  // 1. Start agent test instance
  const agentApp = createAgentApp();
  await new Promise((resolve) => {
    agentServer = agentApp.listen(0, '127.0.0.1', () => {
      const port = agentServer.address().port;
      agentBaseUrl = `http://127.0.0.1:${port}`;
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

  // 1. Tool Registry Check
  await test('Stage 5 tools are registered in toolRegistry with typed schemas', async () => {
    const tools = [
      'androidListDevices',
      'androidLaunchApp',
      'androidOpenUrl',
      'androidSendMediaKey',
      'androidTakeScreenshot',
      'hassListEntities',
      'hassGetEntityState',
      'hassControlMedia',
      'hassControlSwitchOrLight'
    ];

    for (const t of tools) {
      if (!toolRegistry.has(t)) {
        throw new Error(`Tool '${t}' is missing from ToolRegistry`);
      }
    }
  });

  // 2. Consent Policy on Android Screenshot
  await test('androidTakeScreenshot requires operator confirmation (requiresConfirmation: true)', async () => {
    const tool = toolRegistry.get('androidTakeScreenshot');
    if (!tool.requiresConfirmation) {
      throw new Error('Expected androidTakeScreenshot to have requiresConfirmation: true');
    }

    try {
      await toolRegistry.executeTool('androidTakeScreenshot', { serial: 'emulator-5554' }, { confirmed: false });
      throw new Error('Expected unconfirmed screenshot to throw');
    } catch (err) {
      if (err.code !== 'ACTION_AWAITING_CONFIRMATION') {
        throw new Error(`Expected ACTION_AWAITING_CONFIRMATION, got ${err.code}`);
      }
    }
  });

  // 3. Device Summary Endpoint
  await test('GET /api/devices/summary returns unified device telemetry [SIMULATED FIXTURE]', async () => {
    const res = await requestBackend('/api/devices/summary');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = res.body.data;
    if (!data.android?.agentOnline) throw new Error('Expected Android agent to be reported online');
    if (!data.homeAssistant?.online) throw new Error('Expected Home Assistant to be reported online');
    if (!data.homeAssistant.isSimulatedFixture) {
      throw new Error('Expected isSimulatedFixture: true in test environment');
    }
  });

  // 4. Android Device Listing
  await test('GET /api/devices/android returns connected devices with state metadata [SIMULATED FIXTURE]', async () => {
    const res = await requestBackend('/api/devices/android');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const devs = res.body.data.devices;
    if (!Array.isArray(devs) || devs.length < 3) {
      throw new Error(`Expected at least 3 devices, got ${devs?.length}`);
    }
    const authorized = devs.find(d => d.state === 'authorized');
    if (!authorized) throw new Error('Expected at least one authorized device');
  });

  // 5. Home Assistant Entity Discovery & Capabilities
  await test('hassListEntities parses media player capabilities bitmask correctly [SIMULATED FIXTURE]', async () => {
    const entities = await homeAssistantService.listEntities();
    const livingTv = entities.mediaPlayers.find(m => m.entityId === 'media_player.living_room_tv');
    const bedroomTv = entities.mediaPlayers.find(m => m.entityId === 'media_player.bedroom_tv');

    if (!livingTv || !bedroomTv) throw new Error('Expected living room and bedroom TVs in fixture');
    if (!livingTv.capabilities.supportsVolumeSet) {
      throw new Error('Expected Living Room TV to support volume set');
    }
    if (bedroomTv.capabilities.supportsVolumeSet) {
      throw new Error('Expected Bedroom TV NOT to support direct volume set');
    }
  });

  // 6. Home Assistant Capability Protection (No Invented TV Capabilities)
  await test('Setting exact volume on Bedroom TV is rejected with CAPABILITY_NOT_SUPPORTED', async () => {
    try {
      await homeAssistantService.controlMedia({
        entityId: 'media_player.bedroom_tv',
        action: 'volume_set',
        value: 50
      });
      throw new Error('Expected unsupported volume_set to throw');
    } catch (err) {
      if (err.code !== 'CAPABILITY_NOT_SUPPORTED') {
        throw new Error(`Expected CAPABILITY_NOT_SUPPORTED, got ${err.code}`);
      }
    }
  });

  // 7. Home Assistant Honest Handling of Unavailable Devices
  await test('Commands to unavailable Kitchen Speaker are rejected with DEVICE_UNAVAILABLE', async () => {
    try {
      await homeAssistantService.controlMedia({
        entityId: 'media_player.kitchen_speaker',
        action: 'play'
      });
      throw new Error('Expected unavailable device command to throw');
    } catch (err) {
      if (err.code !== 'DEVICE_UNAVAILABLE') {
        throw new Error(`Expected DEVICE_UNAVAILABLE, got ${err.code}`);
      }
    }
  });

  // 8. Ambiguity Resolution on Multiple TV Matches
  await test('Unqualified query "tv" triggers AMBIGUOUS_DEVICE_TARGET with candidate list', async () => {
    try {
      await homeAssistantService.controlMedia({
        query: 'tv',
        action: 'turn_on'
      });
      throw new Error('Expected ambiguous query to throw');
    } catch (err) {
      if (!err.isAmbiguous || err.code !== 'AMBIGUOUS_DEVICE_TARGET') {
        throw new Error(`Expected AMBIGUOUS_DEVICE_TARGET, got ${err.code}`);
      }
      if (!Array.isArray(err.candidates) || err.candidates.length < 2) {
        throw new Error('Expected multiple candidates in ambiguous error');
      }
    }
  });

  // 9. Successful Media Player Control
  await test('Valid media action on Living Room TV succeeds [SIMULATED FIXTURE]', async () => {
    const result = await homeAssistantService.controlMedia({
      entityId: 'media_player.living_room_tv',
      action: 'volume_set',
      value: 30
    });
    if (!result.success || !result.isSimulatedFixture) {
      throw new Error('Expected success with isSimulatedFixture: true');
    }
  });

  // 10. Chat Integration Turn: List Android Devices
  await test('POST /api/chat with "list android devices" returns structured action', async () => {
    const res = await requestBackend('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        message: 'list android devices'
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const actions = res.body.data.actions;
    const act = actions.find(a => a.toolName === 'androidListDevices');
    if (!act || act.status !== 'succeeded') {
      throw new Error('Expected succeeded androidListDevices action');
    }
  });

  // 11. Chat Integration Turn: Screenshot Consent Gate
  await test('POST /api/chat with "screenshot phone" generates awaiting_confirmation action', async () => {
    const res = await requestBackend('/api/chat', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: {
        message: 'take screenshot on phone'
      }
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const actions = res.body.data.actions;
    const act = actions.find(a => a.toolName === 'androidTakeScreenshot');
    if (!act || act.status !== 'awaiting_confirmation') {
      throw new Error('Expected awaiting_confirmation androidTakeScreenshot action');
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

runDeviceTests().catch((err) => {
  console.error('Fatal device test error:', err);
  if (agentServer) agentServer.close();
  if (backendServer) backendServer.close();
  process.exitCode = 1;
});

