import express from 'express';
const router = express.Router();
import { logVisit, logClick, getStats } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.post('/visit', logVisit);
router.post('/click', logClick);
router.get('/stats', protect, getStats);

export default router;
