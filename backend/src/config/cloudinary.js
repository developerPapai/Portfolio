import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we stream to Cloudinary manually
const multerMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WebP images and PDF resumes are allowed'));
    }
    cb(null, true);
  },
});

/**
 * Upload a buffer to Cloudinary via upload_stream (Cloudinary v2 compatible)
 * @param {Buffer} buffer
 * @param {Object} options  – Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'portfolio',
      resource_type: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      ...options,
    };
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

/**
 * Delete a file from Cloudinary by public_id
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export { cloudinary, multerMemory, uploadToCloudinary, deleteFromCloudinary };
