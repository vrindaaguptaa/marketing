import mongoose from 'mongoose';

const searchCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true, index: true },
  query: { type: String, required: true },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} },
  agencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

export default mongoose.model('SearchCache', searchCacheSchema);
