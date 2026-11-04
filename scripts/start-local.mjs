import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const backendRequire = createRequire(new URL('../backend/package.json', import.meta.url));
const children = [];
let closing = false;
let vite;

async function checkPortAvailable(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', (err) => {
      resolve(err.code !== 'EADDRINUSE');
    });
    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });
    tester.listen(Number(port), host);
  });
}

async function stop(code) {
  if (closing) return;
  closing = true;
  process.exitCode = code;
  for (const child of children) child.kill();
  if (vite) await vite.close();
}

function start(name, entry, cwd, env) {
  const child = spawn(process.execPath, [entry], { cwd, env, stdio: 'inherit' });
  children.push(child);
  child.once('error', error => { console.error(`[${name}]`, error.message); void stop(1); });
  child.once('exit', code => {
    if (!closing) { console.error(`[${name}] process stopped (code ${code}). See its output above.`); void stop(code || 1); }
  });
}

process.once('SIGINT', () => void stop(0));
process.once('SIGTERM', () => void stop(0));

try {
  const { createServer } = await import('vite');
  backendRequire.resolve('express');
  const settings = {};
  backendRequire('dotenv').config({ path: path.join(root, 'backend', '.env'), processEnv: settings });
  const backendPort = process.env.PORT || settings.PORT || '3001';
  const frontendPort = 5173;
  const withAgent = process.argv.includes('--agent');
  const agentPort = 3002;

  // Pre-flight port availability checks
  const frontendFree = await checkPortAvailable(frontendPort);
  if (!frontendFree) {
    console.error(`❌ Port collision: Frontend port ${frontendPort} is already in use.`);
    console.error(`   Please stop the process using port ${frontendPort} or free the port before launching NOVA.`);
    process.exit(1);
  }

  const backendFree = await checkPortAvailable(backendPort);
  if (!backendFree) {
    console.error(`❌ Port collision: Backend API port ${backendPort} is already in use.`);
    console.error(`   Please stop the process using port ${backendPort} or change PORT in backend/.env.`);
    process.exit(1);
  }

  if (withAgent) {
    const agentFree = await checkPortAvailable(agentPort);
    if (!agentFree) {
      console.error(`❌ Port collision: Laptop automation agent port ${agentPort} is already in use.`);
      console.error(`   Please stop the process using port ${agentPort} before launching NOVA.`);
      process.exit(1);
    }
  }

  vite = await createServer({ root, server: {
    host: '127.0.0.1', port: frontendPort, strictPort: true,
    proxy: { '/api': { target: 'http://127.0.0.1:' + backendPort, changeOrigin: true } }
  } });
  await vite.listen();
  start('Backend', 'src/server.js', path.join(root, 'backend'), { ...process.env, HOST: '127.0.0.1', PORT: backendPort });
  if (withAgent) {
    const secret = process.env.AUTOMATION_AGENT_SECRET || settings.AUTOMATION_AGENT_SECRET;
    start('Laptop agent', 'src/server.js', path.join(root, 'agent'), {
      ...process.env, AGENT_HOST: '127.0.0.1', ...(secret ? { AGENT_PAIRING_SECRET: secret } : {})
    });
  }
  vite.printUrls();
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port collision: Port ${error.port || 5173} is already in use.`);
  } else {
    console.error(error.message);
  }
  if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
    console.error('Install dependencies from the project root: npm ci, then npm ci --prefix backend');
  }
  await stop(1);
}
