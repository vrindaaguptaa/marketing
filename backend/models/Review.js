import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  authorName: { type: String, required: true, trim: true },
  role: { type: String, default: 'Client' }, avatar: { type: String, default: '👤' },
  rating: { type: Number, required: true, min: 1, max: 5 }, title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  text: { type: String, required: true, minlength: 20, maxlength: 500 },
  services: { type: [String], default: [] }, helpfulCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: true }, status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
}, { timestamps: true });
reviewSchema.index({ agency: 1, status: 1, createdAt: -1 });
reviewSchema.index({ agency: 1, user: 1 }, { unique: true });
export default mongoose.model('Review', reviewSchema);
