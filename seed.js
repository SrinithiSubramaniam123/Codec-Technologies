import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js';
import Follow from './models/Follow.js';
import Message from './models/Message.js';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parley');
await Promise.all([User, Post, Follow, Message].map((m) => m.deleteMany()));

const people = [
  ['ava', 'Ava Chen', 'Product designer. Sketching interfaces and sourdough.'],
  ['milo', 'Milo Brandt', 'Trail runner and amateur photographer.'],
  ['noor', 'Noor Haddad', 'Building a tiny plant shop. Ask me about ferns.'],
  ['dev', 'Dev Patel', 'Backend engineer. Coffee first, deploys second.'],
  ['sana', 'Sana Okafor', 'Writer, reader, occasional cyclist.'],
];
const users = [];
for (const [username, displayName, bio] of people)
  users.push(await User.create({ username, displayName, bio, email: `${username}@parley.test`, password: 'password123' }));

const day = 864e5, rnd = (n) => Math.floor(Math.random() * n);
const lines = [
  'Shipped the new onboarding flow today. Fewer steps, happier users.', 'Sunrise run along the ridge. Worth the 5am alarm.',
  'Repotted the monstera and it already looks relieved.', 'Hot take: good error messages are the best UX feature.',
  'Finished a novel in two days. Now I have a book hangover.', 'Testing a new photo preset. Thoughts?',
  'Small wins: zero flaky tests this week.', 'Weekend project: a tiny weather widget for my desk.',
  'Coffee shop with the best window seat in town, found it.', 'Learning to bake focaccia. Attempt three was the charm.',
];
for (let i = 0; i < 28; i++) {
  const a = users[rnd(users.length)], created = new Date(Date.now() - rnd(14 * day) - rnd(day / 2));
  const others = users.filter((u) => u !== a);
  await Post.create({
    author: a._id, text: lines[rnd(lines.length)], createdAt: created,
    likes: others.filter(() => Math.random() > 0.35).map((u) => ({ user: u._id, at: new Date(created.getTime() + rnd(6 * day)) })).filter((l) => l.at < new Date()),
    comments: others.filter(() => Math.random() > 0.75).map((u) => ({ user: u._id, text: ['Love this!', 'Same here.', 'Great shot.', 'Needed this today.'][rnd(4)], at: new Date(created.getTime() + rnd(3 * day)) })).filter((c) => c.at < new Date()),
  });
}
for (const a of users) for (const b of users)
  if (a !== b && Math.random() > 0.3) await Follow.create({ follower: a._id, following: b._id, createdAt: new Date(Date.now() - rnd(14 * day)) });
await Message.create({ from: users[1]._id, to: users[0]._id, text: 'Hey Ava, loved your onboarding post. Want to swap notes?' });
console.log('Seeded. Sign in with username "ava" (or milo, noor, dev, sana) and password "password123".');
await mongoose.disconnect();
