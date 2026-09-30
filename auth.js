import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const verify = (t) => jwt.verify(t, process.env.JWT_SECRET);
export async function protect(req, res, next) {
  const h = req.headers.authorization || '';
  try {
    if (!h.startsWith('Bearer ')) throw new Error();
    req.user = await User.findById(verify(h.slice(7)).id);
    if (!req.user) throw new Error();
    next();
  } catch { res.status(401).json({ message: 'Please sign in to continue.' }); }
}
