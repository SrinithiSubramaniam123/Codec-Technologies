import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
schema.index({ follower: 1, following: 1 }, { unique: true });
schema.index({ following: 1, createdAt: 1 });
export default mongoose.model('Follow', schema);
