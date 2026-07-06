import express from 'express';
import {
  getMyColis,
  getMyColisById,
  getAllColis,
  getColisById,
  createColis,
  updateColisStatus
} from '../controllers/colis.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Client routes
router.get('/mine', getMyColis);
router.get('/mine/:id', getMyColisById);

// Admin routes
router.get('/', requireAdmin, getAllColis);
router.post('/', requireAdmin, createColis);
router.get('/:id', requireAdmin, getColisById);
router.put('/:id/statut', requireAdmin, updateColisStatus);

export default router;
