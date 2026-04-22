import express from 'express';
const router = express.Router();
import {
  getProjects, getAllProjects, getProject,
  createProject, updateProject, deleteProject, toggleVisibility
} from '../controllers/projects.controller.js';
import { protect } from '../middleware/auth.middleware.js';

/** 
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all visible projects (public)
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [frontend, backend, fullstack, mobile, other] }
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', getProjects);
router.get('/all', protect, getAllProjects);
router.get('/:id', getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/toggle', protect, toggleVisibility);

export default router;
