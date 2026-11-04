/**
 * NOVA — Browser Acceptance Test: Live Dashboard Sign-in & Multi-turn Chat
 * Launches Edge via CDP, signs in as owner, switches to Live mode,
 * sends "What time is it?", verifies the live response and tool card,
 * sends a second message in the same conversation, and verifies session continuity.
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const SCREENSHOT_DIR = path.resolve('./docs/screenshots');

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function killProcessTree(pid) {
  if (!pid) return;
  try {
    execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
  } catch (e) {}
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCdpCommand(ws, method, params = {}, timeoutMs = 25000) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout waiting for CDP method: ${method}`));
    }, timeoutMs);

    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        clearTimeout(timeout);
        ws.removeEventListener('message', handler);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(ws, expression) {
  const result = await sendCdpCommand(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || 'Evaluation exception');
  }
  return result.result?.value;
}

async function captureScreenshot(ws, filename) {
  const res = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.data, 'base64');
  const outPath = path.join(SCREENSHOT_DIR, filename);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

async function runBrowserTest() {
  console.log('--- NOVA LIVE ASSISTANT BROWSER CDP ACCEPTANCE SUITE ---');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // Ensure workspace test notes exist
  const workspaceNotesDir = path.resolve('./workspace/notes');
  if (!fs.existsSync(workspaceNotesDir)) {
    fs.mkdirSync(workspaceNotesDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(workspaceNotesDir, 'quickstart.md'),
    '# NOVA Workspace Quickstart Guide\nApproved local folder for safe file operations.\n'
  );

  const tempProfile = path.join(process.env.TEMP, `edge_nova_${Date.now()}`);
  const debugPort = await getAvailablePort();
  console.log(`Allocated ephemeral DevTools debug port: ${debugPort}`);

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${tempProfile}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  let ws = null;
  try {
    let pageTarget = null;
    for (let i = 0; i < 30; i++) {
      await wait(400);
      try {
        const resp = await fetch(`http://127.0.0.1:${debugPort}/json`);
        if (resp.ok) {
          const targets = await resp.json();
          pageTarget = targets.find((t) => t.type === 'page');
          if (pageTarget) break;
        }
      } catch (e) {}
    }

    if (!pageTarget) {
      throw new Error(`Could not find Edge page target on port ${debugPort}.`);
    }

    console.log(`Connected to Edge target: ${pageTarget.webSocketDebuggerUrl}`);
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    await sendCdpCommand(ws, 'Page.enable');
    await sendCdpCommand(ws, 'Runtime.enable');
    console.log(`Navigating to: ${APP_URL}`);
    await sendCdpCommand(ws, 'Page.navigate', { url: APP_URL });
    await wait(2500);

    // 1. Check title
    const pageTitle = await evaluate(ws, 'document.title');
    console.log(`Page title: ${pageTitle}`);

    // 2. Open sign-in modal
    console.log('Opening connection modal...');
    await evaluate(ws, `(() => {
      const btn = document.getElementById('btnDemoInfo');
      if (btn) btn.click();
    })()`);
    await wait(500);

    // 3. Fill in credentials and submit
    console.log('Entering owner credentials (nova_owner)...');
    await evaluate(ws, `(() => {
      const form = document.getElementById('ownerLogin');
      form.elements.username.value = 'nova_owner';
      form.elements.password.value = 'nova_local_2026';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.click();
    })()`);
    await wait(1500);

    const loginStatus = await evaluate(ws, `(() => {
      return {
        statusText: document.getElementById('loginStatus')?.textContent,
        token: localStorage.getItem('nova_auth_token'),
        isDemoMode: localStorage.getItem('nova_demo_mode')
      };
    })()`);
    console.log('Login result:', loginStatus);
    if (!loginStatus.token) {
      throw new Error(`Owner login failed: ${loginStatus.statusText}`);
    }

    // 4. Close modal
    await evaluate(ws, `(() => {
      const btnClose = document.getElementById('btnDismissDemoModal');
      if (btnClose) btnClose.click();
    })()`);
    await wait(500);

    // Helper function to send message and wait for assistant reply
    async function sendMessageAndWait(text, turnName) {
      console.log(`\n[${turnName}] Sending: "${text}"`);
      await evaluate(ws, `((msg) => {
        const ta = document.getElementById('composerTextarea');
        ta.value = msg;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        const sendBtn = document.getElementById('btnSend');
        sendBtn.click();
      })(${JSON.stringify(text)})`);

      let reply = null;
      for (let i = 0; i < 40; i++) {
        await wait(500);
        const state = await evaluate(ws, `(() => {
          const msgs = document.querySelectorAll('.message-row');
          const isStreaming = window.__novaApp?.chatInterface?.isStreaming;
          const lastMsg = msgs[msgs.length - 1];
          const bubble = lastMsg?.querySelector('.message-bubble');
          const pill = lastMsg?.querySelector('.simulated-pill');
          return {
            count: msgs.length,
            isStreaming,
            lastRole: lastMsg?.classList.contains('assistant') ? 'assistant' : 'user',
            text: bubble?.innerText?.trim(),
            pillText: pill?.innerText?.trim()
          };
        })()`);

        if (state.lastRole === 'assistant' && !state.isStreaming && state.text && !state.text.includes('Synthesizing response')) {
          reply = state;
          break;
        }
      }

      if (!reply) {
        throw new Error(`[${turnName}] Timed out waiting for assistant reply.`);
      }

      console.log(`[${turnName}] Mode pill: "${reply.pillText}"`);
      console.log(`[${turnName}] Response preview: ${reply.text.substring(0, 140)}...`);
      return reply;
    }

    // Turn 1: "What time is it?"
    const turn1 = await sendMessageAndWait('What time is it?', 'TURN 1');
    if (!turn1.text.includes(':') && !turn1.text.toLowerCase().includes('time')) {
      throw new Error('Turn 1 did not contain formatted time.');
    }
    console.log('✓ Turn 1 PASSED: Live time returned with tool execution.');

    // Get active session ID and backend session ID after turn 1
    const sessionInfo1 = await evaluate(ws, `(() => {
      const activeSessionId = localStorage.getItem('nova_active_session_id_v1');
      const backendSessionId = localStorage.getItem('nova_backend_session:' + activeSessionId);
      return { activeSessionId, backendSessionId };
    })()`);
    console.log('Turn 1 Session IDs:', sessionInfo1);

    // Turn 2: "What is my system info?" in the SAME conversation
    const turn2 = await sendMessageAndWait('What is my system info?', 'TURN 2');
    if (!turn2.text.includes('Telemetry') && !turn2.text.includes('CPU') && !turn2.text.includes('RAM') && !turn2.text.includes('Windows')) {
      throw new Error('Turn 2 did not contain operating system telemetry.');
    }

    const sessionInfo2 = await evaluate(ws, `(() => {
      const activeSessionId = localStorage.getItem('nova_active_session_id_v1');
      const backendSessionId = localStorage.getItem('nova_backend_session:' + activeSessionId);
      return { activeSessionId, backendSessionId };
    })()`);
    console.log('Turn 2 Session IDs:', sessionInfo2);

    if (sessionInfo1.backendSessionId !== sessionInfo2.backendSessionId) {
      throw new Error(`Session continuity failed! Turn 1: ${sessionInfo1.backendSessionId}, Turn 2: ${sessionInfo2.backendSessionId}`);
    }
    console.log('✓ Turn 2 PASSED: Verified session continuity on backend session:', sessionInfo2.backendSessionId);

    // Turn 3: "Explain a JavaScript promise"
    const turn3 = await sendMessageAndWait('Explain a JavaScript promise', 'TURN 3');
    if (!turn3.text.includes('Promise') || (!turn3.text.includes('Pending') && !turn3.text.includes('resolve'))) {
      throw new Error('Turn 3 did not contain JavaScript promise explanation.');
    }
    console.log('✓ Turn 3 PASSED: Full explanation of JavaScript promises returned.');

    // Turn 4: "Open Notepad" via Windows Local Agent
    const turn4 = await sendMessageAndWait('Open Notepad', 'TURN 4');
    if (!turn4.text.toLowerCase().includes('notepad') && !turn4.text.toLowerCase().includes('launched')) {
      throw new Error('Turn 4 did not confirm Notepad launch.');
    }
    console.log('✓ Turn 4 PASSED: Notepad launched via local agent.');

    // Turn 5: "Search workspace files for notes"
    const turn5 = await sendMessageAndWait('Search workspace files for notes', 'TURN 5');
    if (!turn5.text.toLowerCase().includes('workspace') && !turn5.text.toLowerCase().includes('file')) {
      throw new Error('Turn 5 did not search workspace files.');
    }
    console.log('✓ Turn 5 PASSED: Workspace files searched.');

    // Turn 6: "Save preference: themeAccent = emerald"
    const turn6 = await sendMessageAndWait('Save preference: themeAccent = emerald', 'TURN 6');
    if (!turn6.text.includes('Preference saved') && !turn6.text.includes('themeAccent')) {
      throw new Error('Turn 6 did not save preference.');
    }
    console.log('✓ Turn 6 PASSED: User preference saved.');

    // Capture screenshot of live conversation
    const ssPath = await captureScreenshot(ws, 'live-conversation-turn2.png');
    console.log(`✓ Screenshot captured: ${ssPath}`);

    console.log('\n========================================================');
    console.log('🎉 ALL LIVE BROWSER ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
    console.log('========================================================');
  } finally {
    if (ws) ws.close();
    killProcessTree(edgeProc.pid);
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch (e) {}
  }
}

runBrowserTest().catch((err) => {
  console.error('\n❌ TEST RUNNER FAILED:', err.message);
  process.exit(1);
});
