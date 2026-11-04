/**
 * NOVA Backend — Knowledge & Memories API Routes
 */

import { Router } from 'express';
import multer from 'multer';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDoc,
  queryDocKnowledge,
  getMemories,
  createMem,
  updateMem,
  deleteMem
} from '../controllers/knowledgeController.js';
import { requireAuth } from '../middleware/auth.js';
import { config } from '../config/env.js';

const router = Router();

// Configure Multer for document uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: (config.knowledge.maxFileSizeMb || 25) * 1024 * 1024
  }
});

// All knowledge endpoints require owner authentication
router.use(requireAuth);

// Document Knowledge Endpoints
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/documents', getDocuments);
router.get('/documents/:id', getDocument);
router.delete('/documents/:id', deleteDoc);
router.post('/query', queryDocKnowledge);

// Explicit Memories Endpoints
router.get('/memories', getMemories);
router.post('/memories', createMem);
router.put('/memories/:id', updateMem);
router.delete('/memories/:id', deleteMem);

export default router;
