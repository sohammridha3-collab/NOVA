/**
 * NOVA Backend — Home Assistant Connector Service
 * Stage 5: Real Device Connector for Home Assistant
 *
 * Implements:
 * - REST & WebSocket API connectivity
 * - Entity & capability discovery (media players, lights, switches)
 * - Supported features bitmask evaluation (never assumes every TV supports every action)
 * - Genuine state querying (identifies 'unavailable' and 'offline' devices)
 * - Ambiguity detection & candidate resolution
 * - Explicitly labelled [SIMULATED FIXTURE] test data when unconfigured or in test mode
 */

import { config } from '../config/env.js';

// Bitmask constants from Home Assistant MediaPlayerEntityFeature
export const MediaPlayerFeatures = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY_MEDIA: 512,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  CLEAR_PLAYLIST: 8192,
  PLAY: 16384
};

// Clearly labelled simulated fixtures for testing without live Home Assistant hardware
const SIMULATED_FIXTURES = [
  {
    entity_id: 'media_player.living_room_tv',
    state: 'playing',
    attributes: {
      friendly_name: 'Living Room TV',
      device_class: 'tv',
      volume_level: 0.42,
      is_volume_muted: false,
      source: 'HDMI 1 (Consoles)',
      media_title: 'Cyberpunk 2077',
      // Supports turn_on, turn_off, volume_set, volume_mute, play, pause, source
      supported_features: 128 | 256 | 4 | 8 | 1 | 16384 | 2048
    }
  },
  {
    entity_id: 'media_player.bedroom_tv',
    state: 'off',
    attributes: {
      friendly_name: 'Bedroom TV',
      device_class: 'tv',
      is_volume_muted: false,
      // Supports turn_on, turn_off, volume_step (NO direct volume_set!)
      supported_features: 128 | 256 | 1024
    }
  },
  {
    entity_id: 'media_player.kitchen_speaker',
    state: 'unavailable',
    attributes: {
      friendly_name: 'Kitchen Audio Speaker',
      device_class: 'speaker',
      supported_features: 4 | 8 | 1 | 16384
    }
  },
  {
    entity_id: 'light.living_room_lights',
    state: 'on',
    attributes: {
      friendly_name: 'Living Room Ambient Light',
      brightness: 204, // 80%
      supported_color_modes: ['brightness', 'hs']
    }
  },
  {
    entity_id: 'switch.smart_plug_desk',
    state: 'off',
    attributes: {
      friendly_name: 'Workstation Smart Plug'
    }
  }
];

class HomeAssistantService {
  constructor() {
    this.baseUrl = config.hass?.baseUrl || '';
    this.token = config.hass?.token || '';
    this.timeoutMs = config.hass?.timeoutMs || 10000;
  }

  isConfigured() {
    return Boolean(this.baseUrl && this.token);
  }

  isSimulatedMode() {
    return process.env.MOCK_HASS === 'true' || !this.isConfigured();
  }

  /**
   * Internal request helper
   */
  async _request(endpoint, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const url = `${cleanBase}${endpoint}`;

    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        const err = new Error(`Home Assistant API returned ${res.status}: ${errorText || res.statusText}`);
        err.statusCode = res.status;
        err.code = 'HASS_API_ERROR';
        throw err;
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Home Assistant request to ${endpoint} timed out after ${this.timeoutMs}ms.`);
        timeoutErr.code = 'HASS_TIMEOUT';
        timeoutErr.statusCode = 504;
        throw timeoutErr;
      }
      throw err;
    }
  }

  /**
   * 1. Get Home Assistant Connection Status
   */
  async getStatus() {
    if (this.isSimulatedMode()) {
      return {
        configured: this.isConfigured(),
        online: true,
        isSimulatedFixture: true,
        version: '2026.3.0 [SIMULATED FIXTURE]',
        locationName: 'Simulated Smart Home [FIXTURE]',
        message: 'Operating with clearly labelled [SIMULATED FIXTURE] data. Configure HASS_BASE_URL and HASS_TOKEN in backend/.env for physical Home Assistant hardware.'
      };
    }

    try {
      const data = await this._request('/api/');
      return {
        configured: true,
        online: true,
        isSimulatedFixture: false,
        version: data.version || 'Connected',
        locationName: data.location_name || 'Home Assistant',
        message: data.message || 'API running.'
      };
    } catch (err) {
      return {
        configured: true,
        online: false,
        isSimulatedFixture: false,
        error: err.message,
        code: err.code || 'HASS_DISCONNECTED'
      };
    }
  }

  /**
   * 2. Discover Entities & Capabilities
   */
  async listEntities(filterDomain = null) {
    let rawStates = [];
    const isSimulated = this.isSimulatedMode();

    if (isSimulated) {
      rawStates = SIMULATED_FIXTURES;
    } else {
      rawStates = await this._request('/api/states');
    }

    const mediaPlayers = [];
    const lights = [];
    const switches = [];

    for (const item of rawStates) {
      const [domain] = item.entity_id.split('.');
      if (filterDomain && domain !== filterDomain) continue;

      const attrs = item.attributes || {};
      const friendlyName = attrs.friendly_name || item.entity_id;
      const isAvailable = item.state !== 'unavailable' && item.state !== 'unknown';

      if (domain === 'media_player') {
        const feats = attrs.supported_features || 0;
        mediaPlayers.push({
          entityId: item.entity_id,
          friendlyName,
          state: item.state,
          isAvailable,
          deviceClass: attrs.device_class || 'tv',
          volumeLevel: typeof attrs.volume_level === 'number' ? Math.round(attrs.volume_level * 100) : null,
          isMuted: Boolean(attrs.is_volume_muted),
          source: attrs.source || null,
          mediaTitle: attrs.media_title || null,
          capabilities: {
            supportsVolumeSet: Boolean(feats & MediaPlayerFeatures.VOLUME_SET),
            supportsVolumeMute: Boolean(feats & MediaPlayerFeatures.VOLUME_MUTE),
            supportsPlay: Boolean(feats & MediaPlayerFeatures.PLAY),
            supportsPause: Boolean(feats & MediaPlayerFeatures.PAUSE),
            supportsTurnOn: Boolean(feats & MediaPlayerFeatures.TURN_ON),
            supportsTurnOff: Boolean(feats & MediaPlayerFeatures.TURN_OFF),
            supportsSelectSource: Boolean(feats & MediaPlayerFeatures.SELECT_SOURCE)
          },
          supportedFeaturesBitmask: feats
        });
      } else if (domain === 'light') {
        lights.push({
          entityId: item.entity_id,
          friendlyName,
          state: item.state,
          isAvailable,
          brightnessPercent: typeof attrs.brightness === 'number' ? Math.round((attrs.brightness / 255) * 100) : null
        });
      } else if (domain === 'switch') {
        switches.push({
          entityId: item.entity_id,
          friendlyName,
          state: item.state,
          isAvailable
        });
      }
    }

    return {
      isSimulatedFixture: isSimulated,
      totalCount: mediaPlayers.length + lights.length + switches.length,
      mediaPlayers,
      lights,
      switches
    };
  }

  /**
   * 3. Query Actual State of an Entity
   */
  async getEntityState(entityId) {
    if (!entityId || typeof entityId !== 'string') {
      const err = new Error("Parameter 'entityId' is required.");
      err.code = 'INVALID_ARGUMENT';
      err.statusCode = 400;
      throw err;
    }

    if (this.isSimulatedMode()) {
      const match = SIMULATED_FIXTURES.find(e => e.entity_id === entityId.trim().toLowerCase());
      if (!match) {
        const err = new Error(`Entity '${entityId}' not found.`);
        err.code = 'ENTITY_NOT_FOUND';
        err.statusCode = 404;
        throw err;
      }
      return {
        ...match,
        isSimulatedFixture: true,
        isAvailable: match.state !== 'unavailable' && match.state !== 'unknown'
      };
    }

    const data = await this._request(`/api/states/${encodeURIComponent(entityId.trim())}`);
    return {
      ...data,
      isSimulatedFixture: false,
      isAvailable: data.state !== 'unavailable' && data.state !== 'unknown'
    };
  }

  /**
   * 4. Resolve Target Entity or Detect Ambiguity
   */
  async resolveTargetEntity({ domain, entityId, query }) {
    const list = await this.listEntities(domain);
    const all = [...list.mediaPlayers, ...list.lights, ...list.switches];

    // If explicit entityId is provided
    if (entityId) {
      const cleanId = entityId.trim().toLowerCase();
      const exact = all.find(e => e.entityId.toLowerCase() === cleanId);
      if (!exact) {
        const err = new Error(`Entity '${entityId}' was not found in Home Assistant.`);
        err.code = 'ENTITY_NOT_FOUND';
        err.statusCode = 404;
        throw err;
      }
      return exact;
    }

    // Match by natural-language query
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      if (all.length === 1) return all[0];
      const err = new Error('No target entity specified.');
      err.code = 'MISSING_TARGET';
      err.statusCode = 400;
      throw err;
    }

    const matches = all.filter(e =>
      e.entityId.toLowerCase().includes(q) ||
      e.friendlyName.toLowerCase().includes(q) ||
      (q.includes('tv') && e.deviceClass === 'tv')
    );

    if (matches.length === 0) {
      const err = new Error(`No ${domain || 'device'} matching '${query}' found.`);
      err.code = 'DEVICE_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    if (matches.length === 1) {
      return matches[0];
    }

    // Multiple devices match -> AMBIGUITY
    const err = new Error(`Multiple matching devices found (${matches.length}) for '${query}'. Please specify which device.`);
    err.code = 'AMBIGUOUS_DEVICE_TARGET';
    err.statusCode = 400;
    err.isAmbiguous = true;
    err.candidates = matches.map(m => ({
      entityId: m.entityId,
      friendlyName: m.friendlyName,
      state: m.state,
      isAvailable: m.isAvailable
    }));
    throw err;
  }

  /**
   * 5. Control TV / Media Player with Strict Capability Check
   */
  async controlMedia({ entityId, query, action, value }) {
    const target = await this.resolveTargetEntity({ domain: 'media_player', entityId, query });

    // Handle unavailable entities honestly
    if (!target.isAvailable) {
      const err = new Error(`Device '${target.friendlyName}' (${target.entityId}) is currently ${target.state}. Command cannot be executed.`);
      err.code = 'DEVICE_UNAVAILABLE';
      err.statusCode = 503;
      throw err;
    }

    let serviceName;
    let serviceData = { entity_id: target.entityId };

    switch (action) {
      case 'turn_on':
        if (!target.capabilities.supportsTurnOn) {
          const err = new Error(`Device '${target.friendlyName}' does not support remote turn_on.`);
          err.code = 'CAPABILITY_NOT_SUPPORTED';
          err.statusCode = 400;
          throw err;
        }
        serviceName = 'turn_on';
        break;

      case 'turn_off':
        if (!target.capabilities.supportsTurnOff) {
          const err = new Error(`Device '${target.friendlyName}' does not support remote turn_off.`);
          err.code = 'CAPABILITY_NOT_SUPPORTED';
          err.statusCode = 400;
          throw err;
        }
        serviceName = 'turn_off';
        break;

      case 'volume_set':
        if (!target.capabilities.supportsVolumeSet) {
          const err = new Error(`Device '${target.friendlyName}' does not support direct volume level setting.`);
          err.code = 'CAPABILITY_NOT_SUPPORTED';
          err.statusCode = 400;
          throw err;
        }
        const level = typeof value === 'number' ? Math.max(0, Math.min(1, value > 1 ? value / 100 : value)) : 0.5;
        serviceName = 'volume_set';
        serviceData.volume_level = level;
        break;

      case 'volume_mute':
        if (!target.capabilities.supportsVolumeMute) {
          const err = new Error(`Device '${target.friendlyName}' does not support mute control.`);
          err.code = 'CAPABILITY_NOT_SUPPORTED';
          err.statusCode = 400;
          throw err;
        }
        serviceName = 'volume_mute';
        serviceData.is_volume_muted = value !== undefined ? Boolean(value) : !target.isMuted;
        break;

      case 'play':
      case 'media_play':
        serviceName = 'media_play';
        break;

      case 'pause':
      case 'media_pause':
        serviceName = 'media_pause';
        break;

      case 'play_pause':
      case 'media_play_pause':
        serviceName = 'media_play_pause';
        break;

      default:
        const err = new Error(`Unknown media action '${action}'. Permitted: turn_on, turn_off, volume_set, volume_mute, play, pause, play_pause`);
        err.code = 'INVALID_ACTION';
        err.statusCode = 400;
        throw err;
    }

    if (this.isSimulatedMode()) {
      return {
        success: true,
        isSimulatedFixture: true,
        action,
        entityId: target.entityId,
        friendlyName: target.friendlyName,
        appliedServiceData: serviceData,
        message: `Action '${action}' dispatched to '${target.friendlyName}' [SIMULATED FIXTURE].`,
        timestamp: new Date().toISOString()
      };
    }

    await this._request(`/api/services/media_player/${serviceName}`, {
      method: 'POST',
      body: serviceData
    });

    return {
      success: true,
      isSimulatedFixture: false,
      action,
      entityId: target.entityId,
      friendlyName: target.friendlyName,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 6. Control Light or Switch
   */
  async controlSwitchOrLight({ entityId, query, action, brightness }) {
    const target = await this.resolveTargetEntity({ entityId, query });

    if (!target.isAvailable) {
      const err = new Error(`Device '${target.friendlyName}' (${target.entityId}) is currently ${target.state}. Command cannot be executed.`);
      err.code = 'DEVICE_UNAVAILABLE';
      err.statusCode = 503;
      throw err;
    }

    const [domain] = target.entityId.split('.');
    if (!['light', 'switch'].includes(domain)) {
      const err = new Error(`Target '${target.entityId}' is not a light or switch.`);
      err.code = 'INVALID_DOMAIN';
      err.statusCode = 400;
      throw err;
    }

    let serviceName = action === 'turn_off' ? 'turn_off' : action === 'toggle' ? 'toggle' : 'turn_on';
    let serviceData = { entity_id: target.entityId };

    if (domain === 'light' && serviceName === 'turn_on' && typeof brightness === 'number') {
      const b255 = Math.max(0, Math.min(255, brightness > 1 && brightness <= 100 ? Math.round((brightness / 100) * 255) : brightness));
      serviceData.brightness = b255;
    }

    if (this.isSimulatedMode()) {
      return {
        success: true,
        isSimulatedFixture: true,
        action: serviceName,
        entityId: target.entityId,
        friendlyName: target.friendlyName,
        appliedServiceData: serviceData,
        message: `Command '${serviceName}' applied to '${target.friendlyName}' [SIMULATED FIXTURE].`,
        timestamp: new Date().toISOString()
      };
    }

    await this._request(`/api/services/${domain}/${serviceName}`, {
      method: 'POST',
      body: serviceData
    });

    return {
      success: true,
      isSimulatedFixture: false,
      action: serviceName,
      entityId: target.entityId,
      friendlyName: target.friendlyName,
      timestamp: new Date().toISOString()
    };
  }
}

export const homeAssistantService = new HomeAssistantService();

