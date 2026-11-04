/**
 * NOVA Local Automation Agent — Security & Boundary Enforcement
 *
 * Principles:
 * - Canonical directory containment (prevention of .. path traversal)
 * - Symlink resolution checks (realpath must remain within workspace)
 * - Credential store & sensitive file masking
 * - Protocol validation (HTTP/HTTPS only for external URLs)
 * - Prohibition of shell command injection
 */

import path from 'path';
import fs from 'fs';
import { config } from './config.js';

export class SecurityError extends Error {
  constructor(message, code = 'SECURITY_VIOLATION', statusCode = 403) {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Validates that a requested path resides safely within the canonical workspace folder.
 * Resolves symlinks to ensure they do not escape the sandbox.
 * Rejects any paths referencing sensitive credentials or system stores.
 *
 * @param {string} requestedPath - User-provided relative or absolute path
 * @param {string} [baseDir] - Root folder (defaults to config.workspaceRoot)
 * @returns {string} Fully resolved canonical path
 */
export function validateCanonicalPath(requestedPath, baseDir = config.workspaceRoot) {
  if (!requestedPath || typeof requestedPath !== 'string') {
    throw new SecurityError('Invalid file path provided.', 'INVALID_PATH', 400);
  }

  // 1. Resolve canonical base directory
  const rootCanonical = path.resolve(baseDir);

  // 2. Resolve target path
  const targetPath = path.isAbsolute(requestedPath)
    ? path.resolve(requestedPath)
    : path.resolve(rootCanonical, requestedPath);

  // 3. Containment check: targetPath must begin with rootCanonical
  const relative = path.relative(rootCanonical, targetPath);
  const isInside = !relative.startsWith('..') && !path.isAbsolute(relative);

  if (!isInside && targetPath !== rootCanonical) {
    throw new SecurityError(
      `Path Traversal Rejected: Path '${requestedPath}' is outside the authorized workspace boundary.`,
      'PATH_TRAVERSAL_DETECTED',
      403
    );
  }

  // 4. Sensitive credential store exclusion check
  for (const pattern of config.sensitivePatterns) {
    if (pattern.test(targetPath)) {
      throw new SecurityError(
        `Access Denied: Path references a sensitive file, credential store, or protected pattern.`,
        'SENSITIVE_STORE_PROTECTED',
        403
      );
    }
  }

  // 5. Symlink escape check (if file or directory exists on disk)
  if (fs.existsSync(targetPath)) {
    try {
      const realTarget = fs.realpathSync(targetPath);
      const realRelative = path.relative(rootCanonical, realTarget);
      const realInside = !realRelative.startsWith('..') && !path.isAbsolute(realRelative);

      if (!realInside && realTarget !== rootCanonical) {
        throw new SecurityError(
          `Symlink Traversal Rejected: Resolved target escapes authorized boundary.`,
          'SYMLINK_ESCAPE_DETECTED',
          403
        );
      }
    } catch (e) {
      if (e instanceof SecurityError) throw e;
    }
  }

  return targetPath;
}

/**
 * Validates that a URL is strictly an HTTP or HTTPS web URL.
 * Rejects local file protocols (file://), script execution (javascript:), or OS schemas.
 */
export function validateWebUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new SecurityError('URL must be a non-empty string.', 'INVALID_URL', 400);
  }

  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch (err) {
    throw new SecurityError(`Malformed URL: ${rawUrl}`, 'INVALID_URL_SYNTAX', 400);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new SecurityError(
      `Protocol Forbidden: Only HTTP and HTTPS URLs are permitted. Received: '${parsed.protocol}'`,
      'UNAUTHORIZED_PROTOCOL',
      403
    );
  }

  return parsed.toString();
}

