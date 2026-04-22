import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'tools', 'other'],
      default: 'other',
    },
    level: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
    },
    icon: { type: String }, // Icon class or SVG string
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

export default mongoose.model('Skill', skillSchema);
