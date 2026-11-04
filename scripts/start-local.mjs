import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const backendRequire = createRequire(new URL('../backend/package.json', import.meta.url));
const children = [];
let closing = false;
let vite;

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
  child.once('error', error => { console.error(name, error.message); void stop(1); });
  child.once('exit', code => {
    if (!closing) { console.error(name + ' stopped. See its output above.'); void stop(code || 1); }
  });
}

process.once('SIGINT', () => void stop(0));
process.once('SIGTERM', () => void stop(0));

try {
  const { createServer } = await import('vite');
  backendRequire.resolve('express');
  const settings = {};
  backendRequire('dotenv').config({ path: path.join(root, 'backend', '.env'), processEnv: settings });
  const port = process.env.PORT || settings.PORT || '3001';
  vite = await createServer({ root, server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    proxy: { '/api': { target: 'http://127.0.0.1:' + port, changeOrigin: true } }
  } });
  await vite.listen();
  start('Backend', 'src/server.js', path.join(root, 'backend'), { ...process.env, HOST: '127.0.0.1', PORT: port });
  if (process.argv.includes('--agent')) {
    const secret = process.env.AUTOMATION_AGENT_SECRET || settings.AUTOMATION_AGENT_SECRET;
    start('Laptop agent', 'src/server.js', path.join(root, 'agent'), {
      ...process.env, AGENT_HOST: '127.0.0.1', ...(secret ? { AGENT_PAIRING_SECRET: secret } : {})
    });
  }
  vite.printUrls();
} catch (error) {
  console.error(error.message);
  if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
    console.error('Install dependencies from the project root: npm ci, then npm ci --prefix backend');
  }
  await stop(1);
}
