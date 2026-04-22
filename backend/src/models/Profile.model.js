import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    location: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true },
    profileImageUrl: { type: String },
    profileImagePublicId: { type: String },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
    heroTagline: { type: String, default: "Building things that live on the internet." },
    heroTaglines: { 
      type: [String], 
      default: [
        'Building things that live on the internet.',
        'Crafting high-performance web applications.',
        'Turning complex problems into elegant solutions.',
        'Full Stack Developer & UI Enthusiast.',
        'Specialized in Angular & Node.js development.',
        'Creating digital experiences with impact.'
      ] 
    },
    availableForWork: { type: Boolean, default: true },
    yearsOfExperience: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
