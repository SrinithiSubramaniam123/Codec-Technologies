import 'dotenv/config';
import http from 'http';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import messages from './routes/messages.js';
import notifications from './routes/notifications.js';
import analytics from './routes/analytics.js';
import { initSocket } from './socket.js';
import { initStore, storeMode } from './lib/store.js';
import { UPLOAD_DIR } from './lib/upload.js';

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const app = express();
const server = http.createServer(app);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (_req, res) => res.json({ ok: true, store: storeMode() }));
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/messages', messages);
app.use('/api/notifications', notifications);
app.use('/api/analytics', analytics);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 400).json({ message: err.message || 'Something went wrong on our side.' });
});

const io = initSocket(server);
await initStore((userId, notification) => io.to(`user:${userId}`).emit('notification', notification));

const port = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parley');
  server.listen(port, () => console.log(`API + sockets ready on http://localhost:${port}`));
} catch (e) { console.error('MongoDB connection failed:', e.message); process.exit(1); }
