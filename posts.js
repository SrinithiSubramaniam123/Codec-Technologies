import { Router } from 'express';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import { brief } from '../models/User.js';
import { protect } from '../lib/auth.js';
import { upload, mediaType } from '../lib/upload.js';
import { pushNotification } from '../lib/store.js';
const r = Router();
r.use(protect);

const populate = (q) => q.populate('author', 'username displayName avatar').populate('comments.user', 'username displayName avatar');
const shape = (p, me) => ({
  id: String(p._id), text: p.text, media: p.media, createdAt: p.createdAt, author: brief(p.author),
  likeCount: p.likes.length, likedByMe: p.likes.some((l) => String(l.user) === String(me)),
  comments: p.comments.map((c) => ({ id: String(c._id), text: c.text, at: c.at, user: brief(c.user) })),
});
const snippet = (t) => (t || '').slice(0, 60);

r.get('/feed', async (req, res) => {
  const ids = (await Follow.find({ follower: req.user._id }).select('following')).map((f) => f.following);
  const q = { author: { $in: [...ids, req.user._id] }, ...(req.query.before && { createdAt: { $lt: new Date(req.query.before) } }) };
  const posts = await populate(Post.find(q).sort('-createdAt').limit(10));
  res.json(posts.map((p) => shape(p, req.user._id)));
});

r.get('/user/:id', async (req, res) => {
  const q = { author: req.params.id, ...(req.query.before && { createdAt: { $lt: new Date(req.query.before) } }) };
  res.json((await populate(Post.find(q).sort('-createdAt').limit(10))).map((p) => shape(p, req.user._id)));
});

r.post('/', upload.array('media', 4), async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text && !req.files?.length) return res.status(400).json({ message: 'Write something or add a photo or video.' });
  const post = await Post.create({
    author: req.user._id, text,
    media: (req.files || []).map((f) => ({ url: `/uploads/${f.filename}`, type: mediaType(f) })),
  });
  res.status(201).json(shape(await populate(Post.findById(post._id)), req.user._id));
});

r.post('/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const i = post.likes.findIndex((l) => String(l.user) === String(req.user._id));
  if (i >= 0) post.likes.splice(i, 1);
  else {
    post.likes.push({ user: req.user._id });
    if (String(post.author) !== String(req.user._id))
      await pushNotification(post.author, { type: 'like', from: brief(req.user), postId: String(post._id), text: snippet(post.text) });
  }
  await post.save();
  res.json({ likeCount: post.likes.length, likedByMe: i < 0 });
});

r.post('/:id/comments', async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Write a comment first.' });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  if (String(post.author) !== String(req.user._id))
    await pushNotification(post.author, { type: 'comment', from: brief(req.user), postId: String(post._id), text: snippet(text) });
  const c = post.comments[post.comments.length - 1];
  res.status(201).json({ id: String(c._id), text: c.text, at: c.at, user: brief(req.user) });
});

r.delete('/:id', async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  post ? res.json({ ok: true }) : res.status(404).json({ message: 'Post not found.' });
});
export default r;
