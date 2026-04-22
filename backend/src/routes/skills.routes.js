import express from 'express';
const router = express.Router();
import { getSkills, getAllSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skills.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/skills:
 *   get:
 *     tags: [Skills]
 *     summary: Get all visible skills (public)
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get('/', getSkills);
router.get('/all', protect, getAllSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;    
