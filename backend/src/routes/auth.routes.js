import express from 'express';
const router = express.Router();
import { login, seed, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token returned
 */
router.post('/login', login);
router.post('/seed', seed);
router.get('/me', protect, getMe);

export default router;
