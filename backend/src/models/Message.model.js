import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    subject: { type: String, trim: true, maxlength: 200 },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 2000,
    },
    read: { type: Boolean, default: false },
    ip: { type: String }, // for spam prevention (optional)
  },
  { timestamps: true }
);

// Index for quick unread count
messageSchema.index({ read: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
