/**
 * NOVA Local Automation Agent — Application Launcher Handler
 *
 * Enforces:
 * - Strict whitelist of mapped applications
 * - child_process.spawn with shell: false (Zero shell command execution)
 * - Safe structured arguments
 */

import { spawn } from 'child_process';
import { config } from '../config.js';
import { validateCanonicalPath, SecurityError } from '../security.js';

export async function openApp({ appName, filePath = null }) {
  if (!appName || typeof appName !== 'string') {
    throw new SecurityError("Parameter 'appName' is required.", 'INVALID_ARGUMENT', 400);
  }

  const appKey = appName.toLowerCase().trim();
  const appMapping = config.allowedApps[appKey];

  if (!appMapping) {
    const allowedList = Object.keys(config.allowedApps).join(', ');
    throw new SecurityError(
      `Application '${appName}' is not in the authorized whitelist. Allowed: [${allowedList}]`,
      'APP_NOT_PERMITTED',
      403
    );
  }

  const spawnArgs = [];

  // If a file argument was passed
  if (filePath) {
    if (!appMapping.acceptsFileArg) {
      throw new SecurityError(
        `Application '${appMapping.name}' does not accept file target arguments.`,
        'ARGUMENT_NOT_PERMITTED',
        400
      );
    }
    const safeFilePath = validateCanonicalPath(filePath);
    spawnArgs.push(safeFilePath);
  }

  try {
    // Spawn with shell: false to guarantee immunity from shell injection
    const child = spawn(appMapping.executable, spawnArgs, {
      detached: true,
      stdio: 'ignore',
      shell: false
    });

    child.unref();

    return {
      launched: true,
      appId: appMapping.id,
      name: appMapping.name,
      executable: appMapping.executable,
      targetFile: filePath || null,
      pid: child.pid || null,
      message: `Launched ${appMapping.name}${filePath ? ` with target: ${filePath}` : ''}`
    };
  } catch (err) {
    throw new Error(`Failed to launch application '${appMapping.name}': ${err.message}`);
  }
}

