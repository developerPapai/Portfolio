import Project from '../models/Project.model.js';
import { cloudinary } from '../config/cloudinary.js';

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const filter = { visible: true };
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.category = req.query.category;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) { next(err); }
};

// GET /api/projects/all  (admin - includes hidden)
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) { next(err); }
};

// GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    // Delete image from Cloudinary if exists
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

// PATCH /api/projects/:id/toggle
const toggleVisibility = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.visible = !project.visible;
    await project.save();
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

export { getProjects, getAllProjects, getProject, createProject, updateProject, deleteProject, toggleVisibility };
