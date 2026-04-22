import express from 'express';
const router = express.Router();
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get public profile
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/', getProfile);
router.put('/', protect, updateProfile);

export default router;
