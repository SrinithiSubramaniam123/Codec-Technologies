import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9_]{3,20}$/ },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  displayName: { type: String, trim: true, maxlength: 40 },
  bio: { type: String, default: '', maxlength: 160 },
  avatar: { type: String, default: '' },
}, { timestamps: true });
schema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
  next();
});
schema.methods.matches = function (pw) { return bcrypt.compare(pw, this.password); };
export const brief = (u) => ({ id: String(u._id), username: u.username, displayName: u.displayName || u.username, avatar: u.avatar || '' });
export default mongoose.model('User', schema);
