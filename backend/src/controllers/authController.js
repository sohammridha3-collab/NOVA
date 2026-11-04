/**
 * NOVA Backend — Auth Controller
 */

import { loginOwner } from '../services/authService.js';
import { formatSuccess, formatError } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await loginOwner(username, password);

    if (result.authenticated) {
      return res.status(200).json(
        formatSuccess(
          {
            token: result.token,
            user: result.user
          },
          req
        )
      );
    }

    return res.status(401).json(
      formatError(
        'INVALID_CREDENTIALS',
        result.message || 'Invalid username or password.',
        null,
        req
      )
    );
  } catch (err) {
    next(err);
  }
}

export function getMe(req, res) {
  res.status(200).json(
    formatSuccess(
      {
        user: req.user
      },
      req
    )
  );
}

