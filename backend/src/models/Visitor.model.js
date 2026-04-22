import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  elementId: String,
  elementClass: String,
  text: String,
  path: String,
  timestamp: { type: Date, default: Date.now }
});

const visitorSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    ip: String,
    userAgent: String,
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown'
    },
    browser: String,
    os: String,
    location: {
      country: String,
      city: String,
      region: String
    },
    pageViews: [{
      path: String,
      timestamp: { type: Date, default: Date.now }
    }],
    clicks: [clickSchema],
    firstVisit: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Index for quick analytics queries
visitorSchema.index({ sessionId: 1 });
visitorSchema.index({ createdAt: -1 });

export default mongoose.model('Visitor', visitorSchema);
