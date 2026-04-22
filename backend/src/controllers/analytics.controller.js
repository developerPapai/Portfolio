import Visitor from '../models/Visitor.model.js';

// Helper to get basic device info from User Agent
const parseUA = (ua) => {
  const info = {
    browser: 'Unknown',
    os: 'Unknown',
    device: 'desktop'
  };

  if (!ua) return info;

  // Simple Browser detection
  if (ua.includes('Firefox')) info.browser = 'Firefox';
  else if (ua.includes('Chrome')) info.browser = 'Chrome';
  else if (ua.includes('Safari')) info.browser = 'Safari';
  else if (ua.includes('Edge')) info.browser = 'Edge';

  // Simple OS detection
  if (ua.includes('Windows')) info.os = 'Windows';
  else if (ua.includes('Mac OS')) info.os = 'macOS';
  else if (ua.includes('Android')) info.os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) info.os = 'iOS';
  else if (ua.includes('Linux')) info.os = 'Linux';

  // Simple Device type
  if (ua.includes('Mobi')) info.device = 'mobile';
  if (ua.includes('Tablet') || ua.includes('iPad')) info.device = 'tablet';

  return info;
};

// POST /api/analytics/visit
export const logVisit = async (req, res, next) => {
  try {
    const { sessionId, path } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID is required' });

    const ua = req.headers['user-agent'];
    const uaInfo = parseUA(ua);
    
    let visitor = await Visitor.findOne({ sessionId });

    if (visitor) {
      // Update existing session
      visitor.pageViews.push({ path });
      visitor.lastSeen = new Date();
      await visitor.save();
    } else {
      // Create new session
      visitor = await Visitor.create({
        sessionId,
        ip: req.ip,
        userAgent: ua,
        ...uaInfo,
        pageViews: [{ path }]
      });
    }

    res.json({ success: true, visitorId: visitor._id });
  } catch (err) { next(err); }
};

// POST /api/analytics/click
export const logClick = async (req, res, next) => {
  try {
    const { sessionId, clickData } = req.body;
    if (!sessionId || !clickData) return res.status(400).json({ success: false, message: 'Data missing' });

    const visitor = await Visitor.findOne({ sessionId });
    if (!visitor) return res.status(404).json({ success: false, message: 'Session not found' });

    visitor.clicks.push(clickData);
    await visitor.save();

    res.json({ success: true });
  } catch (err) { next(err); }
};

// GET /api/analytics/stats (Admin)
export const getStats = async (req, res, next) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const totalViews = await Visitor.aggregate([
      { $project: { viewsCount: { $size: "$pageViews" } } },
      { $group: { _id: null, total: { $sum: "$viewsCount" } } }
    ]);

    const deviceStats = await Visitor.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]);

    const browserStats = await Visitor.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } }
    ]);

    const topPages = await Visitor.aggregate([
      { $unwind: "$pageViews" },
      { $group: { _id: "$pageViews.path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalVisitors,
        totalPageViews: totalViews[0]?.total || 0,
        deviceStats,
        browserStats,
        topPages
      }
    });
  } catch (err) { next(err); }
};
