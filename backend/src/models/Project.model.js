import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    longDescription: { type: String },
    techStack: [{ type: String, trim: true }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    imageUrl: { type: String },
    imagePublicId: { type: String }, // Cloudinary public_id for deletion
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'mobile', 'other'],
      default: 'fullstack',
    },
  },
  { timestamps: true }
);

// Sort by order by default
projectSchema.index({ order: 1 });

export default mongoose.model('Project', projectSchema);
