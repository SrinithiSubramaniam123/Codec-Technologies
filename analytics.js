import { Router } from 'express';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import { protect } from '../lib/auth.js';
const r = Router();
r.use(protect);

const key = (d) => new Date(d).toISOString().slice(0, 10);

r.get('/', async (req, res) => {
  const me = req.user._id, DAYS = 14;
  const start = new Date(); start.setUTCHours(0, 0, 0, 0); start.setUTCDate(start.getUTCDate() - (DAYS - 1));
  const series = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(start); d.setUTCDate(d.getUTCDate() + i);
    return { date: key(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }), posts: 0, likes: 0, comments: 0, followers: 0 };
  });
  const at = new Map(series.map((s) => [s.date, s]));

  const [posts, newFollowers, followers, following] = await Promise.all([
    Post.find({ author: me }).select('text likes comments createdAt').lean(),
    Follow.find({ following: me, createdAt: { $gte: start } }).select('createdAt').lean(),
    Follow.countDocuments({ following: me }), Follow.countDocuments({ follower: me }),
  ]);
  let likes = 0, comments = 0;
  for (const p of posts) {
    likes += p.likes.length; comments += p.comments.length;
    at.get(key(p.createdAt)) && at.get(key(p.createdAt)).posts++;
    p.likes.forEach((l) => at.get(key(l.at)) && at.get(key(l.at)).likes++);
    p.comments.forEach((c) => at.get(key(c.at)) && at.get(key(c.at)).comments++);
  }
  newFollowers.forEach((f) => at.get(key(f.createdAt)) && at.get(key(f.createdAt)).followers++);

  const sum = (arr, f) => arr.reduce((s, x) => s + x[f], 0);
  const prev = series.slice(0, 7), last = series.slice(7);
  const trend = (f) => { const a = sum(prev, f), b = sum(last, f); return a === 0 ? (b > 0 ? 100 : 0) : Math.round(((b - a) / a) * 100); };
  const top = posts.map((p) => ({ id: String(p._id), text: p.text || 'Photo or video post', likes: p.likes.length, comments: p.comments.length, createdAt: p.createdAt }))
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments)).slice(0, 5);

  res.json({
    totals: { posts: posts.length, likes, comments, followers, following, perPost: posts.length ? +((likes + comments) / posts.length).toFixed(1) : 0 },
    trends: { likes: trend('likes'), comments: trend('comments'), followers: trend('followers'), posts: trend('posts') },
    series, top,
  });
});
export default r;
