import mongoose from 'mongoose';

const rankingCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true, index: true },
  agencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  weights: { type: mongoose.Schema.Types.Mixed, default: {} },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

export default mongoose.model('RankingCache', rankingCacheSchema);
