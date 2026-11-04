/**
 * NOVA Backend — Device Controller
 * Stage 5: Real Device Connectors for Android & Home Assistant
 */

import { automationService } from '../automation/automationService.js';
import { homeAssistantService } from '../services/homeAssistantService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const DeviceController = {
  /**
   * GET /api/devices/summary
   * Unified summary of all device connector subsystems
   */
  async getSummary(req, res) {
    try {
      const [agentStatus, hassStatus] = await Promise.all([
        automationService.getStatus().catch(e => ({ online: false, error: e.message })),
        homeAssistantService.getStatus().catch(e => ({ online: false, error: e.message }))
      ]);

      let androidDevices = { adbAvailable: false, totalConnected: 0, devices: [] };
      if (agentStatus.online) {
        androidDevices = await automationService.execute('androidListDevices', {}).catch(() => ({
          adbAvailable: false,
          totalConnected: 0,
          devices: []
        }));
      }

      let hassEntities = { totalCount: 0, mediaPlayers: [], lights: [], switches: [] };
      if (hassStatus.online) {
        hassEntities = await homeAssistantService.listEntities().catch(() => ({
          totalCount: 0,
          mediaPlayers: [],
          lights: [],
          switches: []
        }));
      }

      return successResponse(res, {
        android: {
          agentOnline: agentStatus.online,
          adbAvailable: androidDevices.adbAvailable,
          totalConnected: androidDevices.totalConnected,
          devices: androidDevices.devices || [],
          guidance: androidDevices.guidance || null
        },
        homeAssistant: {
          configured: hassStatus.configured,
          online: hassStatus.online,
          isSimulatedFixture: hassStatus.isSimulatedFixture,
          locationName: hassStatus.locationName,
          version: hassStatus.version,
          entities: hassEntities,
          message: hassStatus.message
        }
      });
    } catch (err) {
      return errorResponse(res, err.message, 500, 'DEVICE_SUMMARY_ERROR');
    }
  },

  /**
   * GET /api/devices/android
   */
  async getAndroidDevices(req, res) {
    try {
      const data = await automationService.execute('androidListDevices', {});
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message, err.statusCode || 500, err.code || 'ANDROID_QUERY_ERROR');
    }
  },

  /**
   * POST /api/devices/android/action
   */
  async executeAndroidAction(req, res, next) {
    try {
      const { action, params = {} } = req.body;
      if (!action || typeof action !== 'string') {
        return errorResponse(res, "Field 'action' is required.", 400, 'INVALID_INPUT');
      }

      const result = await automationService.execute(action, params);
      return successResponse(res, result);
    } catch (err) {
      if (err.isAmbiguous) {
        return errorResponse(res, err.message, 400, 'AMBIGUOUS_DEVICE_TARGET', {
          isAmbiguous: true,
          candidates: err.candidates
        });
      }
      next(err);
    }
  },

  /**
   * GET /api/devices/hass/status
   */
  async getHassStatus(req, res) {
    try {
      const status = await homeAssistantService.getStatus();
      return successResponse(res, status);
    } catch (err) {
      return errorResponse(res, err.message, 500, 'HASS_STATUS_ERROR');
    }
  },

  /**
   * GET /api/devices/hass/entities
   */
  async getHassEntities(req, res) {
    try {
      const { domain } = req.query;
      const entities = await homeAssistantService.listEntities(domain);
      return successResponse(res, entities);
    } catch (err) {
      return errorResponse(res, err.message, 500, 'HASS_ENTITIES_ERROR');
    }
  },

  /**
   * POST /api/devices/hass/media
   */
  async controlHassMedia(req, res, next) {
    try {
      const { entityId, query, action, value } = req.body;
      if (!action) {
        return errorResponse(res, "Field 'action' is required.", 400, 'INVALID_INPUT');
      }

      const result = await homeAssistantService.controlMedia({ entityId, query, action, value });
      return successResponse(res, result);
    } catch (err) {
      if (err.isAmbiguous) {
        return errorResponse(res, err.message, 400, 'AMBIGUOUS_DEVICE_TARGET', {
          isAmbiguous: true,
          candidates: err.candidates
        });
      }
      next(err);
    }
  },

  /**
   * POST /api/devices/hass/light
   */
  async controlHassLight(req, res, next) {
    try {
      const { entityId, query, action, brightness } = req.body;
      if (!action) {
        return errorResponse(res, "Field 'action' is required.", 400, 'INVALID_INPUT');
      }

      const result = await homeAssistantService.controlSwitchOrLight({ entityId, query, action, brightness });
      return successResponse(res, result);
    } catch (err) {
      if (err.isAmbiguous) {
        return errorResponse(res, err.message, 400, 'AMBIGUOUS_DEVICE_TARGET', {
          isAmbiguous: true,
          candidates: err.candidates
        });
      }
      next(err);
    }
  }
};

