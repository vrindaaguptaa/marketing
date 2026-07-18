import mongoose from 'mongoose';
const bookmarkSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true } }, { timestamps: true });
bookmarkSchema.index({ user: 1, agency: 1 }, { unique: true });
export default mongoose.model('Bookmark', bookmarkSchema);
