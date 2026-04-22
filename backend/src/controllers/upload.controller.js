import { uploadToCloudinary } from '../config/cloudinary.js';

// POST /api/upload
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const isPdf = req.file.mimetype === 'application/pdf';
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: isPdf ? 'raw' : 'image',
      folder: isPdf ? 'portfolio/resumes' : 'portfolio/images',
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (err) {
    next(err);
  }
};

export { uploadFile };
