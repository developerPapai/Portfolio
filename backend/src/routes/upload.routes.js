import express from 'express';
const router = express.Router();
import { multerMemory } from '../config/cloudinary.js';
import { uploadFile } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload image or PDF resume to Cloudinary (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Returns Cloudinary secure_url and public_id
 */
router.post('/', protect, multerMemory.single('file'), uploadFile);

export default router;
