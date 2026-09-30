import mongoose from 'mongoose';
const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
const schema = new mongoose.Schema({
  author: { ...ref, required: true, index: true },
  text: { type: String, default: '', maxlength: 500 },
  media: [{ url: String, type: { type: String, enum: ['image', 'video'] } }],
  likes: [{ user: ref, at: { type: Date, default: Date.now }, _id: false }],
  comments: [{ user: ref, text: { type: String, maxlength: 300 }, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
schema.index({ createdAt: -1 });
export default mongoose.model('Post', schema);
