// Redis-backed notification + presence store.
// Falls back to in-memory if Redis isn't running so the app still works in development.
import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';

const bus = new EventEmitter();
let redis = null;
let sub = null;
const mem = { notifs: new Map(), unread: new Map(), presence: new Map() };

export const storeMode = () => (redis ? 'redis' : 'memory');

export async function initStore(onNotification) {
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  const make = () => new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1, retryStrategy: () => null });
  try {
    redis = make(); sub = make();
    redis.on('error', () => {}); sub.on('error', () => {});
    await redis.connect(); await sub.connect();
    await sub.subscribe('notifications');
    sub.on('message', (_ch, raw) => { const { userId, notification } = JSON.parse(raw); onNotification(userId, notification); });
    console.log('Redis connected: notifications and presence use Redis');
  } catch {
    redis?.disconnect(); sub?.disconnect(); redis = sub = null;
    bus.on('notifications', ({ userId, notification }) => onNotification(userId, notification));
    console.warn('Redis not reachable: using in-memory notifications (start Redis to persist them)');
  }
}

export async function pushNotification(userId, data) {
  userId = String(userId);
  const n = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  if (redis) {
    await redis.multi()
      .lpush(`notif:${userId}`, JSON.stringify(n)).ltrim(`notif:${userId}`, 0, 49).incr(`notif:unread:${userId}`)
      .exec();
    await redis.publish('notifications', JSON.stringify({ userId, notification: n }));
  } else {
    const list = mem.notifs.get(userId) || [];
    mem.notifs.set(userId, [n, ...list].slice(0, 50));
    mem.unread.set(userId, (mem.unread.get(userId) || 0) + 1);
    bus.emit('notifications', { userId, notification: n });
  }
  return n;
}

export async function listNotifications(userId) {
  userId = String(userId);
  if (redis) {
    const [items, unread] = await Promise.all([redis.lrange(`notif:${userId}`, 0, 49), redis.get(`notif:unread:${userId}`)]);
    return { items: items.map((i) => JSON.parse(i)), unread: +unread || 0 };
  }
  return { items: mem.notifs.get(userId) || [], unread: mem.unread.get(userId) || 0 };
}

export async function markAllRead(userId) {
  userId = String(userId);
  if (redis) await redis.set(`notif:unread:${userId}`, 0); else mem.unread.set(userId, 0);
}

// Presence: count of open sockets per user
export async function presenceChange(userId, delta) {
  userId = String(userId);
  if (redis) { const n = await redis.hincrby('presence', userId, delta); if (n <= 0) await redis.hdel('presence', userId); return Math.max(n, 0); }
  const n = Math.max((mem.presence.get(userId) || 0) + delta, 0);
  n ? mem.presence.set(userId, n) : mem.presence.delete(userId);
  return n;
}
export async function onlineIds() {
  if (redis) return Object.keys(await redis.hgetall('presence'));
  return [...mem.presence.keys()];
}
export async function isOnline(userId) { return (await onlineIds()).includes(String(userId)); }
