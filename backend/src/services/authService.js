/**
 * NOVA Backend — Authentication Service
 * Handles single-owner local development authentication.
 */

import crypto from 'crypto';
import { config } from '../config/env.js';
import { query } from '../database/connection.js';
import { verifyPassword } from '../database/migrate.js';
import { signAuthToken } from '../middleware/auth.js';

export async function loginOwner(username, password) {
  // 1. Direct configuration match check (for instant local bootstrap)
  if (
    username === config.auth.ownerUsername &&
    password === config.auth.ownerPassword
  ) {
    const token = signAuthToken({
      username: config.auth.ownerUsername,
      role: 'owner'
    });
    return {
      authenticated: true,
      token,
      user: {
        username: config.auth.ownerUsername,
        role: 'owner'
      }
    };
  }

  // 2. Query database for user if database is reachable
  try {
    const [rows] = await query(
      'SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isValid = verifyPassword(password, user.password_hash);
      if (isValid) {
        const token = signAuthToken({
          id: user.id,
          username: user.username,
          role: user.role
        });
        return {
          authenticated: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        };
      }
    }
  } catch (err) {
    // If DB is unreachable, we rely strictly on config credentials above
  }

  return {
    authenticated: false,
    message: 'Invalid owner username or password.'
  };
}

