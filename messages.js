import { Router } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User, { brief } from '../models/User.js';
import { protect } from '../lib/auth.js';
const r = Router();
r.use(protect);

r.get('/conversations', async (req, res) => {
  const me = req.user._id;
  const rows = await Message.aggregate([
    { $match: { $or: [{ from: me }, { to: me }] } },
    { $sort: { createdAt: -1 } },
    { $group: {
      _id: { $cond: [{ $eq: ['$from', me] }, '$to', '$from'] }, last: { $first: '$$ROOT' },
      unread: { $sum: { $cond: [{ $and: [{ $eq: ['$to', me] }, { $eq: ['$readAt', null] }] }, 1, 0] } },
    } },
    { $sort: { 'last.createdAt': -1 } },
  ]);
  const users = await User.find({ _id: { $in: rows.map((x) => x._id) } });
  const byId = new Map(users.map((u) => [String(u._id), u]));
  res.json(rows.filter((x) => byId.has(String(x._id))).map((x) => ({
    user: brief(byId.get(String(x._id))), unread: x.unread,
    last: { text: x.last.text, createdAt: x.last.createdAt, mine: String(x.last.from) === String(me) },
  })));
});

r.get('/:userId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.status(400).json({ message: 'Invalid user.' });
  const me = req.user._id, other = req.params.userId;
  const msgs = await Message.find({ $or: [{ from: me, to: other }, { from: other, to: me }] }).sort('-createdAt').limit(100);
  await Message.updateMany({ from: other, to: me, readAt: null }, { readAt: new Date() });
  res.json(msgs.reverse().map((m) => ({ id: String(m._id), from: String(m.from), to: String(m.to), text: m.text, createdAt: m.createdAt })));
});
export default r;
