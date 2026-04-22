import Message from '../models/Message.model.js';

// POST /api/messages  (public contact form)
const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const newMessage = await Message.create({
      name, email, subject, message,
      ip: req.ip,
    });
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) { next(err); }
};

// GET /api/messages  (admin)
const getMessages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.read !== undefined) filter.read = req.query.read === 'true';
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ read: false });
    res.json({ success: true, count: messages.length, unreadCount, data: messages });
  } catch (err) { next(err); }
};

// PATCH /api/messages/:id/read  (admin)
const markRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: !!(req.body.read ?? true) },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (err) { next(err); }
};

// DELETE /api/messages/:id  (admin)
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};

export { createMessage, getMessages, markRead, deleteMessage };
