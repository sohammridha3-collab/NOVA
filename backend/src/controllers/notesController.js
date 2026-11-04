/**
 * NOVA Backend — Notes Controller
 */

import { saveNoteTool, searchNotesTool, deleteNoteTool } from '../tools/definitions/notesTool.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const NotesController = {
  async searchNotes(req, res, next) {
    try {
      const { query = '', limit } = req.query;
      const result = await searchNotesTool.execute({ query, limit });
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  async createNote(req, res, next) {
    try {
      const { title, content, tags } = req.body;
      const val = saveNoteTool.validate({ title, content, tags });
      if (!val.valid) {
        return errorResponse(res, val.error, 400, 'INVALID_INPUT');
      }
      const result = await saveNoteTool.execute({ title, content, tags });
      return successResponse(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async deleteNote(req, res, next) {
    try {
      const { id } = req.params;
      const result = await deleteNoteTool.execute({ noteId: id });
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
};

