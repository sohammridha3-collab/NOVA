/**
 * NOVA Backend — Notes Routes
 */

import { Router } from 'express';
import { NotesController } from '../controllers/notesController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, NotesController.searchNotes);
router.post('/', requireAuth, NotesController.createNote);
router.delete('/:id', requireAuth, NotesController.deleteNote);

export default router;

