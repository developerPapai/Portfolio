import Skill from '../models/Skill.model.js';

// GET /api/skills
const getSkills = async (req, res, next) => {
  try {
    const filter = { visible: true };
    if (req.query.category) filter.category = req.query.category;
    const skills = await Skill.find(filter).sort({ category: 1, order: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (err) { next(err); }
};

// GET /api/skills/all (admin)
const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (err) { next(err); }
};

// POST /api/skills
const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) { next(err); }
};

// PUT /api/skills/:id
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: skill });
  } catch (err) { next(err); }
};

// DELETE /api/skills/:id
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) { next(err); }
};

export { getSkills, getAllSkills, createSkill, updateSkill, deleteSkill };
