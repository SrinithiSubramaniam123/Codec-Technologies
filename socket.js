import { Server } from 'socket.io';
import Message from './models/Message.js';
import User, { brief } from './models/User.js';
import { verify } from './lib/auth.js';
import { isOnline, onlineIds, presenceChange, pushNotification } from './lib/store.js';

export function initSocket(server) {
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' } });

  io.use(async (socket, next) => {
    try {
      const { id } = verify(socket.handshake.auth.token);
      const user = await User.findById(id);
      if (!user) throw new Error('no user');
      socket.user = user;
      next();
    } catch { next(new Error('unauthorized')); }
  });

  io.on('connection', async (socket) => {
    const me = String(socket.user._id);
    socket.join(`user:${me}`);
    if ((await presenceChange(me, 1)) === 1) io.emit('presence', { userId: me, online: true });
    socket.emit('presence:list', await onlineIds());

    socket.on('message:send', async ({ to, text } = {}, ack = () => {}) => {
      text = (text || '').trim();
      if (!text || !to) return ack({ ok: false, message: 'Write a message first.' });
      try {
        if (!(await User.exists({ _id: to }))) return ack({ ok: false, message: 'That user no longer exists.' });
        const m = await Message.create({ from: me, to, text });
        const msg = { id: String(m._id), from: me, to: String(to), text: m.text, createdAt: m.createdAt };
        io.to(`user:${to}`).emit('message:new', msg);
        if (!(await isOnline(to))) await pushNotification(to, { type: 'message', from: brief(socket.user), text: text.slice(0, 60) });
        ack({ ok: true, message: msg });
      } catch { ack({ ok: false, message: 'Message failed to send. Try again.' }); }
    });

    socket.on('typing', ({ to } = {}) => to && io.to(`user:${to}`).emit('typing', { from: me }));

    socket.on('disconnect', async () => {
      if ((await presenceChange(me, -1)) === 0) io.emit('presence', { userId: me, online: false });
    });
  });
  return io;
}
