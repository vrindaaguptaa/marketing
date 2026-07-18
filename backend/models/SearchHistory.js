import mongoose from 'mongoose';
const searchHistorySchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, query: { type: String, trim: true }, filters: { type: mongoose.Schema.Types.Mixed, default: {} }, resultCount: { type: Number, default: 0 } }, { timestamps: true });
searchHistorySchema.index({ user: 1, createdAt: -1 });
export default mongoose.model('SearchHistory', searchHistorySchema);
