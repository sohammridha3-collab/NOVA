/**
 * NOVA Backend — Voice Controller
 * Handles audio uploads, validation, language parameter dispatch,
 * and speech worker status probes.
 */

import { getSpeechProvider } from '../voice/speechProvider.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const VoiceController = {
  /**
   * POST /api/voice/transcribe
   * Receives recorded audio blob, converts and transcribes via faster-whisper.
   */
  async transcribe(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(
          res,
          "No audio file received. Ensure 'audio' field is provided in multipart form data.",
          400,
          'MISSING_AUDIO_FILE'
        );
      }

      const language = req.body?.language || req.query?.language || 'auto';
      const provider = getSpeechProvider();

      const result = await provider.transcribe({
        buffer: req.file.buffer,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        language
      });

      return successResponse(res, {
        text: result.text,
        isSilent: result.isSilent,
        language: result.language,
        languageProbability: result.languageProbability,
        duration: result.duration,
        confidence: result.confidence,
        segments: result.segments
      });

    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/voice/status
   * Probes faster-whisper worker readiness, ffmpeg, and language options.
   */
  async getStatus(req, res, next) {
    try {
      const provider = getSpeechProvider();
      const status = await provider.getStatus();
      return successResponse(res, status);
    } catch (err) {
      next(err);
    }
  }
};

