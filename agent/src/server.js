/**
 * NOVA Local Automation Agent — HTTP Server Entry Point
 * Binds strictly to 127.0.0.1:3002
 * Enforces authenticated pairing, capability discovery, and safe action execution.
 */

import http from 'http';
import { config } from './config.js';
import { SecurityError } from './security.js';
import { openApp } from './handlers/apps.js';
import { searchFiles, openFile, deleteFile } from './handlers/files.js';
import { createWorkspaceNote } from './handlers/notes.js';
import { openUrl } from './handlers/url.js';
import { getOsInfo } from './handlers/osInfo.js';
import {
  listAndroidDevices,
  launchAndroidApp,
  openAndroidUrl,
  sendAndroidMediaKey,
  takeAndroidScreenshot
} from './handlers/android.js';

export function createAgentApp() {
  return http.createServer(async (req, res) => {
    const startTime = Date.now();

    // Helper to send standard JSON response
    const sendJson = (status, payload) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Agent-Version': '1.0.0'
      });
      res.end(JSON.stringify(payload));
    };

    // Helper to read JSON request body
    const readBody = async () => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
          if (body.length > 5 * 1024 * 1024) {
            reject(new SecurityError('Payload exceeded 5MB limit', 'PAYLOAD_TOO_LARGE', 413));
          }
        });
        req.on('end', () => {
          if (!body) return resolve({});
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new SecurityError('Malformed JSON payload', 'MALFORMED_JSON', 400));
          }
        });
        req.on('error', reject);
      });
    };

    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = url.pathname;

    try {
      // 1. Authenticated Pairing Verification
      const authHeader = req.headers['authorization'];
      const secretHeader = req.headers['x-agent-secret'];
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : secretHeader;

      if (!token || token !== config.pairingSecret) {
        return sendJson(401, {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Invalid or missing agent pairing secret.'
          }
        });
      }

      // 2. Route Dispatch
      // GET /status
      if (req.method === 'GET' && pathname === '/status') {
        return sendJson(200, {
          success: true,
          data: {
            status: 'online',
            service: 'nova-local-automation-agent',
            version: '1.0.0',
            host: config.host,
            port: config.port,
            workspaceRoot: config.workspaceRoot,
            uptimeSeconds: Math.round(process.uptime()),
            platform: process.platform
          }
        });
      }

      // GET /capabilities
      if (req.method === 'GET' && pathname === '/capabilities') {
        return sendJson(200, {
          success: true,
          data: {
            capabilities: [
              'openApp',
              'searchFiles',
              'openFile',
              'createWorkspaceNote',
              'deleteFile',
              'openUrl',
              'getOsInfo',
              'androidListDevices',
              'androidLaunchApp',
              'androidOpenUrl',
              'androidSendMediaKey',
              'androidTakeScreenshot'
            ],
            allowedApps: Object.values(config.allowedApps).map(a => ({
              id: a.id,
              name: a.name,
              description: a.description,
              acceptsFile: a.acceptsFileArg
            })),
            androidConfig: {
              allowedApps: config.android.allowedApps,
              mediaKeys: Object.keys(config.android.mediaKeycodes)
            },
            workspaceRoot: config.workspaceRoot,
            cancellationNotice: 'Cancellation does not undo completed operating-system side effects.'
          }
        });
      }

      // GET /android/devices
      if (req.method === 'GET' && pathname === '/android/devices') {
        const result = await listAndroidDevices();
        return sendJson(200, {
          success: true,
          data: result
        });
      }

      // POST /execute
      if (req.method === 'POST' && pathname === '/execute') {
        const body = await readBody();
        const { action, params = {} } = body;

        if (!action || typeof action !== 'string') {
          return sendJson(400, {
            success: false,
            error: { code: 'INVALID_ACTION', message: "Field 'action' is required." }
          });
        }

        let result;
        switch (action) {
          case 'openApp':
            result = await openApp(params);
            break;
          case 'searchFiles':
            result = await searchFiles(params);
            break;
          case 'openFile':
            result = await openFile(params);
            break;
          case 'createWorkspaceNote':
            result = await createWorkspaceNote(params);
            break;
          case 'deleteFile':
            result = await deleteFile(params);
            break;
          case 'openUrl':
            result = await openUrl(params);
            break;
          case 'getOsInfo':
            result = getOsInfo();
            break;
          case 'androidListDevices':
            result = await listAndroidDevices();
            break;
          case 'androidLaunchApp':
            result = await launchAndroidApp(params);
            break;
          case 'androidOpenUrl':
            result = await openAndroidUrl(params);
            break;
          case 'androidSendMediaKey':
            result = await sendAndroidMediaKey(params);
            break;
          case 'androidTakeScreenshot':
            result = await takeAndroidScreenshot(params);
            break;
          default:
            return sendJson(400, {
              success: false,
              error: {
                code: 'UNKNOWN_ACTION',
                message: `Unknown automation action '${action}'. Supported: openApp, searchFiles, openFile, createWorkspaceNote, deleteFile, openUrl, getOsInfo, androidListDevices, androidLaunchApp, androidOpenUrl, androidSendMediaKey, androidTakeScreenshot`
              }
            });
        }

        const durationMs = Date.now() - startTime;
        return sendJson(200, {
          success: true,
          data: result,
          meta: {
            action,
            executionTimeMs: durationMs,
            cancellationNotice: 'Cancellation of an action may not undo operating system side-effects already completed.',
            timestamp: new Date().toISOString()
          }
        });
      }

      // 404 Route Not Found
      return sendJson(404, {
        success: false,
        error: { code: 'NOT_FOUND', message: `Cannot ${req.method} ${pathname}` }
      });

    } catch (err) {
      const statusCode = err.statusCode || 500;
      return sendJson(statusCode, {
        success: false,
        error: {
          code: err.code || 'AGENT_ERROR',
          message: err.message,
          isAmbiguous: !!err.isAmbiguous,
          candidates: err.candidates || null
        }
      });
    }
  });
}

// Start server if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = createAgentApp();
  server.listen(config.port, config.host, () => {
    console.log('========================================================');
    console.log(`🤖 NOVA Local Automation Agent v1.0.0 Online`);
    console.log(`📡 URL: http://${config.host}:${config.port}`);
    console.log(`📁 Workspace Root: ${config.workspaceRoot}`);
    console.log(`🔒 Authenticated Pairing: Active`);
    console.log('========================================================');
  });

  const shutdown = () => {
    console.log('\nShutting down Local Automation Agent...');
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

