import mongoose from 'mongoose';
const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true };
const schema = new mongoose.Schema({
  from: ref, to: ref,
  text: { type: String, required: true, maxlength: 1000 },
  readAt: { type: Date, default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });
schema.index({ from: 1, to: 1, createdAt: -1 });
export default mongoose.model('Message', schema);
