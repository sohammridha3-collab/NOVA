/**
 * NOVA Backend — Declarative Input Validation Middleware
 */

import { formatError } from '../utils/response.js';

/**
 * Validates req.body against a field rules specification.
 * @param {object} schema - Map of field names to validation rules
 */
export function validateBody(schema) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json(
        formatError(
          'INVALID_REQUEST_BODY',
          'Request body must be a valid JSON object.',
          null,
          req
        )
      );
    }

    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const val = req.body[field];

      // Required check
      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push({ field, message: `Field '${field}' is required.` });
        continue;
      }

      if (val === undefined || val === null) {
        continue;
      }

      // Type check
      if (rules.type && typeof val !== rules.type) {
        errors.push({ field, message: `Field '${field}' must be of type ${rules.type}.` });
        continue;
      }

      // String length check
      if (typeof val === 'string') {
        if (rules.minLength && val.trim().length < rules.minLength) {
          errors.push({ field, message: `Field '${field}' must be at least ${rules.minLength} characters.` });
        }
        if (rules.maxLength && val.length > rules.maxLength) {
          errors.push({ field, message: `Field '${field}' cannot exceed ${rules.maxLength} characters.` });
        }
      }

      // Enum check
      if (rules.enum && !rules.enum.includes(val)) {
        errors.push({ field, message: `Field '${field}' must be one of: ${rules.enum.join(', ')}.` });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json(
        formatError(
          'VALIDATION_FAILED',
          'One or more submitted fields failed validation.',
          errors,
          req
        )
      );
    }

    next();
  };
}

