import { Router } from 'express';
import { protect } from '../lib/auth.js';
import { listNotifications, markAllRead } from '../lib/store.js';
const r = Router();
r.use(protect);
r.get('/', async (req, res) => res.json(await listNotifications(req.user._id)));
r.post('/read', async (req, res) => { await markAllRead(req.user._id); res.json({ ok: true }); });
export default r;
