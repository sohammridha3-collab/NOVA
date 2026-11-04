/**
 * NOVA Backend — Time Tool Definition
 */

export const timeTool = {
  name: 'getCurrentTime',
  description: 'Retrieve the current real-world timestamp, day of the week, and formatted time in the requested or system timezone.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: 'IANA timezone name (e.g. "UTC", "America/New_York", "Asia/Kolkata"). Defaults to system/UTC.'
      }
    }
  },
  validate(args = {}) {
    if (args.timezone && typeof args.timezone !== 'string') {
      return { valid: false, error: "Parameter 'timezone' must be a string." };
    }
    return { valid: true };
  },
  async execute(args = {}) {
    const now = new Date();
    const tz = args.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    let formatted = '';
    try {
      formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        dateStyle: 'full',
        timeStyle: 'long'
      }).format(now);
    } catch (e) {
      formatted = now.toUTCString();
    }

    return {
      iso: now.toISOString(),
      timestampMs: now.getTime(),
      timezone: tz,
      formattedTime: formatted
    };
  }
};

