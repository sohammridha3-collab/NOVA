/**
 * NOVA Backend — Voice Routes
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { VoiceController } from '../controllers/voiceController.js';
import { requireAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../temp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration with 10MB limit and audio type validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `voice_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
    cb(null, true);
  } else {
    const err = new Error(`Unsupported audio MIME type: ${file.mimetype}`);
    err.code = 'UNSUPPORTED_AUDIO_MIMETYPE';
    err.statusCode = 415;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

const router = Router();

// Routes
router.post('/transcribe', requireAuth, upload.single('audio'), VoiceController.transcribe);
router.get('/status', requireAuth, VoiceController.getStatus);

export default router;

