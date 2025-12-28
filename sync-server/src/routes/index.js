import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import { getData, pushData, pullData, deleteData } from '../controllers/syncController.js';
import { authenticateKey } from '../middleware/auth.js';

const router = express.Router();

// Health check endpoint (no auth required)
router.get('/health', getHealth);

// Sync endpoints (authentication required)
router.get('/sync/data', authenticateKey, getData);
router.post('/sync/push', authenticateKey, pushData);
router.post('/sync/pull', authenticateKey, pullData);
router.delete('/sync/data', authenticateKey, deleteData);

export default router;
