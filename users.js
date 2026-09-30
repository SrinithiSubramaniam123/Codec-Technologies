import { Router } from 'express';
import User, { brief } from '../models/User.js';
import Follow from '../models/Follow.js';
import Post from '../models/Post.js';
import { protect } from '../lib/auth.js';
import { upload } from '../lib/upload.js';
import { pushNotification } from '../lib/store.js';
const r = Router();
r.use(protect);

r.get('/suggestions', async (req, res) => {
  const following = (await Follow.find({ follower: req.user._id }).select('following')).map((f) => f.following);
  const users = await User.aggregate([{ $match: { _id: { $nin: [...following, req.user._id] } } }, { $sample: { size: 5 } }]);
  res.json(users.map(brief));
});

r.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!q) return res.json([]);
  const users = await User.find({ $or: [{ username: new RegExp(q, 'i') }, { displayName: new RegExp(q, 'i') }] }).limit(8);
  res.json(users.map(brief));
});

r.put('/me', upload.single('avatar'), async (req, res) => {
  const { displayName, bio } = req.body;
  if (displayName !== undefined) req.user.displayName = displayName.slice(0, 40);
  if (bio !== undefined) req.user.bio = bio.slice(0, 160);
  if (req.file) req.user.avatar = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ user: { ...brief(req.user), email: req.user.email, bio: req.user.bio } });
});

r.get('/:username', async (req, res) => {
  const u = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!u) return res.status(404).json({ message: 'That profile doesn’t exist.' });
  const [followers, following, posts, isFollowing] = await Promise.all([
    Follow.countDocuments({ following: u._id }), Follow.countDocuments({ follower: u._id }),
    Post.countDocuments({ author: u._id }), Follow.exists({ follower: req.user._id, following: u._id }),
  ]);
  res.json({ user: { ...brief(u), bio: u.bio, joined: u.createdAt }, followers, following, posts, isFollowing: !!isFollowing });
});

r.post('/:id/follow', async (req, res) => {
  if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You can’t follow yourself.' });
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found.' });
  const existing = await Follow.findOneAndDelete({ follower: req.user._id, following: target._id });
  if (!existing) {
    await Follow.create({ follower: req.user._id, following: target._id });
    await pushNotification(target._id, { type: 'follow', from: brief(req.user) });
  }
  res.json({ isFollowing: !existing, followers: await Follow.countDocuments({ following: target._id }) });
});
export default r;
