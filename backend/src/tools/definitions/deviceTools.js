/**
 * NOVA Backend — Stage 5 Device Connectors Tools Definitions
 * Implements Android (via Local Automation Agent ADB) & Home Assistant connectors.
 *
 * Security:
 * - Structured device serials & parameters
 * - Phone lock-screen PIN bypass strictly forbidden
 * - Taking a screenshot requires explicit user consent (requiresConfirmation: true)
 * - Capability gating on Home Assistant (no invented TV capabilities)
 * - Ambiguity detection & candidate reporting
 */

import { automationService } from '../../automation/automationService.js';
import { homeAssistantService } from '../../services/homeAssistantService.js';

// ==============================================================================
// 1. Android Device Tools (Dispatched through Local Agent)
// ==============================================================================

export const androidListDevicesTool = {
  name: 'androidListDevices',
  description: 'List all connected Android devices, distinguishing authorized, unauthorized (pending RSA prompt), and offline states.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {}
  },
  validate() {
    return { valid: true };
  },
  async execute() {
    return await automationService.execute('androidListDevices', {});
  }
};

export const androidLaunchAppTool = {
  name: 'androidLaunchApp',
  description: 'Launch a pre-configured Android application (e.g. youtube, spotify, chrome, settings, maps) on an authorized Android device.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {
      serial: {
        type: 'string',
        description: 'Optional device serial identifier. If omitted and only one authorized device exists, it will be automatically selected.'
      },
      appName: {
        type: 'string',
        enum: ['youtube', 'spotify', 'chrome', 'settings', 'maps', 'camera'],
        description: 'Name of the configured Android application to launch.'
      },
      packageName: {
        type: 'string',
        description: 'Alternative explicit Android package identifier.'
      }
    }
  },
  validate(args = {}) {
    if (!args.appName && !args.packageName) {
      return { valid: false, error: "Either 'appName' or 'packageName' must be specified." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('androidLaunchApp', {
      serial: args.serial,
      appName: args.appName,
      packageName: args.packageName
    });
  }
};

export const androidOpenUrlTool = {
  name: 'androidOpenUrl',
  description: 'Safely launch a validated HTTP or HTTPS web URL in the default browser on an authorized Android device.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['url'],
    properties: {
      serial: {
        type: 'string',
        description: 'Optional device serial identifier.'
      },
      url: {
        type: 'string',
        description: 'HTTP or HTTPS web URL to open.'
      }
    }
  },
  validate(args = {}) {
    if (!args.url || typeof args.url !== 'string') {
      return { valid: false, error: "Parameter 'url' is required." };
    }
    try {
      const parsed = new URL(args.url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: `Invalid protocol '${parsed.protocol}'. Only http: and https: are allowed.` };
      }
    } catch (e) {
      return { valid: false, error: `Malformed URL: ${e.message}` };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('androidOpenUrl', {
      serial: args.serial,
      url: args.url.trim()
    });
  }
};

export const androidSendMediaKeyTool = {
  name: 'androidSendMediaKey',
  description: 'Transmit a media or navigation keyevent (e.g. play_pause, volume_up, volume_down, mute, home) to an authorized Android device.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['keycode'],
    properties: {
      serial: {
        type: 'string',
        description: 'Optional device serial identifier.'
      },
      keycode: {
        type: 'string',
        enum: ['play_pause', 'play', 'pause', 'next', 'previous', 'volume_up', 'volume_down', 'mute', 'home', 'back'],
        description: 'Media or navigation keyevent identifier.'
      }
    }
  },
  validate(args = {}) {
    if (!args.keycode || typeof args.keycode !== 'string') {
      return { valid: false, error: "Parameter 'keycode' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('androidSendMediaKey', {
      serial: args.serial,
      keycode: args.keycode
    });
  }
};

export const androidTakeScreenshotTool = {
  name: 'androidTakeScreenshot',
  description: 'Capture a screenshot of an authorized Android device with explicit operator consent. Saves PNG image in dedicated NOVA workspace.',
  requiresConfirmation: true, // EXPLICIT OPERATOR CONSENT REQUIRED
  parameters: {
    type: 'object',
    properties: {
      serial: {
        type: 'string',
        description: 'Optional device serial identifier.'
      },
      confirmed: {
        type: 'boolean',
        description: 'Explicit confirmation from operator to capture screen.'
      }
    }
  },
  validate() {
    return { valid: true };
  },
  async execute(args) {
    return await automationService.execute('androidTakeScreenshot', {
      serial: args.serial,
      confirmed: true
    });
  }
};

// ==============================================================================
// 2. Home Assistant Smart Home Tools
// ==============================================================================

export const hassListEntitiesTool = {
  name: 'hassListEntities',
  description: 'Discover connected Home Assistant smart home devices (media players, TVs, lights, and switches) and their capabilities.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        enum: ['media_player', 'light', 'switch'],
        description: 'Optional filter by device domain.'
      }
    }
  },
  validate() {
    return { valid: true };
  },
  async execute(args = {}) {
    return await homeAssistantService.listEntities(args.domain);
  }
};

export const hassGetEntityStateTool = {
  name: 'hassGetEntityState',
  description: 'Query the genuine real-time state and attributes of a Home Assistant smart home device.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['entityId'],
    properties: {
      entityId: {
        type: 'string',
        description: 'The Home Assistant entity identifier (e.g. "media_player.living_room_tv" or "light.living_room_lights").'
      }
    }
  },
  validate(args = {}) {
    if (!args.entityId || typeof args.entityId !== 'string') {
      return { valid: false, error: "Parameter 'entityId' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await homeAssistantService.getEntityState(args.entityId.trim());
  }
};

export const hassControlMediaTool = {
  name: 'hassControlMedia',
  description: 'Control a Home Assistant TV or media player (power, volume, mute, playback) with capability validation.',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['action'],
    properties: {
      entityId: {
        type: 'string',
        description: 'Specific entity ID of the media player (e.g. "media_player.living_room_tv").'
      },
      query: {
        type: 'string',
        description: 'Device name query if exact entity ID is not known (e.g. "living room tv" or "bedroom tv").'
      },
      action: {
        type: 'string',
        enum: ['turn_on', 'turn_off', 'volume_set', 'volume_mute', 'play', 'pause', 'play_pause'],
        description: 'Media action to perform.'
      },
      value: {
        type: 'number',
        description: 'Target volume percentage (0 to 100) or mute state boolean.'
      }
    }
  },
  validate(args = {}) {
    if (!args.action || typeof args.action !== 'string') {
      return { valid: false, error: "Parameter 'action' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await homeAssistantService.controlMedia({
      entityId: args.entityId,
      query: args.query,
      action: args.action,
      value: args.value
    });
  }
};

export const hassControlSwitchOrLightTool = {
  name: 'hassControlSwitchOrLight',
  description: 'Control a Home Assistant light or smart plug (turn on, turn off, toggle, or set brightness).',
  requiresConfirmation: false,
  parameters: {
    type: 'object',
    required: ['action'],
    properties: {
      entityId: {
        type: 'string',
        description: 'Specific entity ID (e.g. "light.living_room_lights" or "switch.smart_plug_desk").'
      },
      query: {
        type: 'string',
        description: 'Device name search query (e.g. "desk light" or "smart plug").'
      },
      action: {
        type: 'string',
        enum: ['turn_on', 'turn_off', 'toggle'],
        description: 'Action to execute.'
      },
      brightness: {
        type: 'number',
        description: 'Optional brightness percentage (0 to 100) for lights.'
      }
    }
  },
  validate(args = {}) {
    if (!args.action || typeof args.action !== 'string') {
      return { valid: false, error: "Parameter 'action' is required." };
    }
    return { valid: true };
  },
  async execute(args) {
    return await homeAssistantService.controlSwitchOrLight({
      entityId: args.entityId,
      query: args.query,
      action: args.action,
      brightness: args.brightness
    });
  }
};

