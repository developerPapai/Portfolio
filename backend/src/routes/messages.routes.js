import express from 'express';
const router = express.Router();
import { createMessage, getMessages, markRead, deleteMessage } from '../controllers/messages.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a contact message (public)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/', createMessage);
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteMessage);

export default router;
