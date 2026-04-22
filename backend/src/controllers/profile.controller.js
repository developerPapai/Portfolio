import Profile from '../models/Profile.model.js';
import { cloudinary } from '../config/cloudinary.js';

// GET /api/profile  (public)
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not set up yet' });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

// PUT /api/profile  (admin)
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      // If new profile image provided, delete old from Cloudinary
      if (req.body.profileImagePublicId && profile.profileImagePublicId &&
          req.body.profileImagePublicId !== profile.profileImagePublicId) {
        await cloudinary.uploader.destroy(profile.profileImagePublicId);
      }
      // If new resume provided, delete old from Cloudinary
      if (req.body.resumePublicId && profile.resumePublicId &&
          req.body.resumePublicId !== profile.resumePublicId) {
        await cloudinary.uploader.destroy(profile.resumePublicId, { resource_type: 'raw' });
      }
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

export { getProfile, updateProfile };
