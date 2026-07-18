import crypto from 'crypto';
import Agency from '../models/Agency.js';
import SearchCache from '../models/SearchCache.js';
import RankingCache from '../models/RankingCache.js';
import { calculateScore } from './rankingService.js';

const CACHE_MS = 24 * 60 * 60 * 1000;
const hash = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const includes = (values = [], query = '') => values.some((item) => String(item).toLowerCase().includes(String(query).toLowerCase()));
const fuzzyMatch = (agency, query) => {
  const terms = String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = [agency.name, agency.description, agency.location?.city, agency.location?.state, agency.location?.country, ...(agency.services || []), ...(agency.technologies || [])].join(' ').toLowerCase();
  return terms.every((term) => haystack.includes(term) || [...haystack].some((_, index) => haystack.slice(index, index + term.length - 1) === term.slice(0, -1)));
};

export const searchStoredAgencies = async ({ query = '', filters = {}, page = 1, limit = 24, weights = {} }) => {
  const cacheKey = hash({ query: query.toLowerCase(), filters, weights }); const now = new Date();
  const cache = await SearchCache.findOne({ cacheKey, expiresAt: { $gt: now } }).populate('agencies');
  let agencies = cache?.agencies?.filter(Boolean);
  if (!agencies?.length) {
    const mongoFilter = { isPublished: true };
    if (filters.services?.length) mongoFilter.services = { $in: filters.services };
    if (filters.technologies?.length) mongoFilter.technologies = { $in: filters.technologies };
    if (filters.country) mongoFilter['location.country'] = new RegExp(filters.country, 'i');
    if (filters.state) mongoFilter['location.state'] = new RegExp(filters.state, 'i');
    if (filters.minRating) mongoFilter.rating = { $gte: Number(filters.minRating) };
    agencies = (await Agency.find(mongoFilter)).filter((agency) => fuzzyMatch(agency, query));
    await SearchCache.findOneAndUpdate({ cacheKey }, { query, filters, agencies: agencies.map((agency) => agency._id), expiresAt: new Date(now.getTime() + CACHE_MS) }, { upsert: true, setDefaultsOnInsert: true });
  }
  agencies = agencies.filter((agency) => (!filters.state || String(agency.location?.state || '').toLowerCase() === String(filters.state).toLowerCase()) && (!filters.country || String(agency.location?.country || '').toLowerCase() === String(filters.country).toLowerCase()) && (!filters.minRating || agency.rating >= Number(filters.minRating)));
  const ranked = agencies.map((agency) => ({ agency, ...calculateScore(agency, { ...filters, ...weights }) })).sort((a, b) => b.score - a.score);
  const rankingKey = hash({ ids: ranked.map((item) => String(item.agency._id)), weights, filters });
  await RankingCache.findOneAndUpdate({ cacheKey: rankingKey }, { agencyIds: ranked.map((item) => item.agency._id), weights, expiresAt: new Date(now.getTime() + CACHE_MS) }, { upsert: true, setDefaultsOnInsert: true });
  const total = ranked.length; const start = (Math.max(1, page) - 1) * limit;
  return { total, agencies: ranked.slice(start, start + limit).map(({ agency, score, factors }) => ({ ...(agency.toObject?.() || agency), rankingScore: score, rankingFactors: factors })) };
};

export const purgeExpiredCaches = async () => { const now = new Date(); const [search, ranking] = await Promise.all([SearchCache.deleteMany({ expiresAt: { $lte: now } }), RankingCache.deleteMany({ expiresAt: { $lte: now } })]); return { search: search.deletedCount, ranking: ranking.deletedCount }; };

export const autocompleteAgencies = async (term) => {
  if (!term?.trim()) return [];
  const expression = new RegExp(term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return Agency.find({ isPublished: true, $or: [{ name: expression }, { technologies: expression }, { services: expression }, { 'location.city': expression }] }).select('name logo location technologies services').limit(8).lean();
};
