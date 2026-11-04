/**
 * NOVA Local Automation Agent — Web URL Launcher Handler
 * Validates HTTP/HTTPS protocol strictly and launches in default system browser.
 */

import { spawn } from 'child_process';
import { validateWebUrl } from '../security.js';

export async function openUrl({ url }) {
  const safeUrl = validateWebUrl(url);

  try {
    // rundll32.exe url.dll,FileProtocolHandler <url> safely invokes the default web browser on Windows
    const child = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', safeUrl], {
      detached: true,
      stdio: 'ignore',
      shell: false
    });

    child.unref();

    return {
      opened: true,
      url: safeUrl,
      pid: child.pid || null,
      message: `Launched browser navigation to: ${safeUrl}`
    };
  } catch (err) {
    throw new Error(`Failed to open URL in browser: ${err.message}`);
  }
}

