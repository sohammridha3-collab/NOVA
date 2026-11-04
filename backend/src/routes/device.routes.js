/**
 * NOVA Backend — Real Device Routes
 * Stage 5 Device Connectors (Android ADB & Home Assistant)
 */

import { Router } from 'express';
import { DeviceController } from '../controllers/deviceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Device discovery & telemetry
router.get('/summary', DeviceController.getSummary);
router.get('/android', DeviceController.getAndroidDevices);
router.get('/hass/status', DeviceController.getHassStatus);
router.get('/hass/entities', DeviceController.getHassEntities);

// Device action executions (protected with authentication)
router.post('/android/action', requireAuth, DeviceController.executeAndroidAction);
router.post('/hass/media', requireAuth, DeviceController.controlHassMedia);
router.post('/hass/light', requireAuth, DeviceController.controlHassLight);

export default router;

