/**
 * NOVA Local Automation Agent — File Operations Handler
 *
 * Enforces:
 * - Canonical directory boundary check
 * - Multiple candidate return on ambiguous search results
 * - Destructive action confirmation requirement (delete)
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { config } from '../config.js';
import { validateCanonicalPath, SecurityError } from '../security.js';

/**
 * Search files inside workspace matching query string
 */
export async function searchFiles({ query, subfolder = '' }) {
  if (!query || typeof query !== 'string') {
    throw new SecurityError("Parameter 'query' is required for file search.", 'INVALID_ARGUMENT', 400);
  }

  const searchRoot = validateCanonicalPath(subfolder || config.workspaceRoot);
  const q = query.toLowerCase().trim();
  const candidates = [];

  function walk(currentDir) {
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (e) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip node_modules, git, hidden files
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (entry.name.toLowerCase().includes(q)) {
          try {
            const stats = fs.statSync(fullPath);
            const relativePath = path.relative(config.workspaceRoot, fullPath);
            candidates.push({
              name: entry.name,
              relativePath,
              absolutePath: fullPath,
              sizeBytes: stats.size,
              lastModified: stats.mtime.toISOString()
            });
          } catch (e) {}
        }
      }
    }
  }

  walk(searchRoot);

  return {
    query: q,
    searchRoot: path.relative(config.workspaceRoot, searchRoot) || 'workspace_root',
    totalFound: candidates.length,
    isAmbiguous: candidates.length > 1,
    candidates
  };
}

/**
 * Open a file with the system default viewer or Notepad
 */
export async function openFile({ filePath }) {
  const safePath = validateCanonicalPath(filePath);

  if (!fs.existsSync(safePath)) {
    throw new Error(`File not found: '${filePath}'`);
  }

  // Launch explorer.exe with the file path
  const child = spawn('explorer.exe', [safePath], {
    detached: true,
    stdio: 'ignore',
    shell: false
  });
  child.unref();

  return {
    opened: true,
    target: path.relative(config.workspaceRoot, safePath),
    absolutePath: safePath
  };
}

/**
 * Delete a file inside the workspace boundary (Destructive — requires confirmed: true)
 */
export async function deleteFile({ filePath, confirmed = false }) {
  const safePath = validateCanonicalPath(filePath);

  if (!fs.existsSync(safePath)) {
    throw new Error(`File '${filePath}' does not exist.`);
  }

  if (confirmed !== true) {
    throw new SecurityError(
      `Confirmation Required: Permanent deletion of file '${path.basename(safePath)}' requires operator confirmation.`,
      'CONFIRMATION_REQUIRED',
      409
    );
  }

  fs.unlinkSync(safePath);

  return {
    deleted: true,
    target: path.relative(config.workspaceRoot, safePath),
    message: `File '${path.basename(safePath)}' was permanently deleted from workspace.`
  };
}

