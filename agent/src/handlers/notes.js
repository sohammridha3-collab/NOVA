/**
 * NOVA Local Automation Agent — Workspace Notes Handler
 * Creates notes inside the dedicated workspace notes directory.
 * Overwrites require explicit operator confirmation.
 */

import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import { validateCanonicalPath, SecurityError } from '../security.js';

export async function createWorkspaceNote({ filename, content, overwrite = false, confirmed = false }) {
  if (!filename || typeof filename !== 'string' || filename.trim().length === 0) {
    throw new SecurityError("Parameter 'filename' is required.", 'INVALID_ARGUMENT', 400);
  }
  if (content === undefined || content === null || typeof content !== 'string') {
    throw new SecurityError("Parameter 'content' must be a string.", 'INVALID_ARGUMENT', 400);
  }

  // Ensure notes subfolder inside workspace
  const notesDir = path.join(config.workspaceRoot, 'notes');
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  // Sanitize filename
  let cleanName = path.basename(filename.trim());
  if (!path.extname(cleanName)) {
    cleanName += '.md';
  }

  const targetPath = validateCanonicalPath(path.join(notesDir, cleanName), notesDir);
  const fileExists = fs.existsSync(targetPath);

  if (fileExists && !overwrite) {
    throw new Error(`File '${cleanName}' already exists. Specify overwrite=true to replace it.`);
  }

  // Overwriting an existing file is destructive and requires operator confirmation
  if (fileExists && overwrite && confirmed !== true) {
    throw new SecurityError(
      `Confirmation Required: Overwriting existing file '${cleanName}' requires operator confirmation.`,
      'CONFIRMATION_REQUIRED',
      409
    );
  }

  fs.writeFileSync(targetPath, content, 'utf8');
  const stats = fs.statSync(targetPath);

  return {
    created: true,
    filename: cleanName,
    relativePath: path.relative(config.workspaceRoot, targetPath),
    sizeBytes: stats.size,
    isOverwrite: fileExists,
    updatedAt: stats.mtime.toISOString(),
    message: `Note '${cleanName}' saved in NOVA workspace.`
  };
}

