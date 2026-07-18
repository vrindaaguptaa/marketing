import Agency from '../models/Agency.js';
import Bookmark from '../models/Bookmark.js';

// The stored score is intentionally context-free. Search applies the same factor
// model with request-specific service, technology, and location matches on top.
export const RANKING_WEIGHTS = {
  reputation: 0.30, serviceMatch: 0.20, technologyMatch: 0.10, portfolioQuality: 0.10,
  companyMaturity: 0.10, profileCompleteness: 0.10, userEngagement: 0.05, recentActivity: 0.05,
};
const clamp = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const overlap = (available = [], requested = []) => {
  if (!requested?.length) return 0.5;
  const normalized = available.map((item) => String(item).toLowerCase());
  return clamp(requested.filter((item) => normalized.some((value) => value.includes(String(item).toLowerCase()))).length / requested.length);
};

export const calculateScore = (agency, context = {}) => {
  const requestedServices = context.services || context.requestedServices || [];
  const requestedTechnologies = context.technologies || context.requestedTechnologies || [];
  const updatedAt = agency.updatedAt ? new Date(agency.updatedAt).getTime() : 0;
  const profileFields = [agency.description, agency.websiteVerified || agency.verifiedWebsite, agency.logo, agency.services?.length, agency.technologies?.length, agency.pricing?.min, agency.portfolioLinks?.length, agency.location?.city];
  const factors = {
    reputation: clamp((((agency.rating || 0) / 5) * 0.7) + (Math.log10((agency.reviewsCount || 0) + 1) / 3) * 0.3),
    serviceMatch: overlap(agency.services, requestedServices),
    technologyMatch: overlap(agency.technologies, requestedTechnologies),
    portfolioQuality: clamp((agency.portfolioLinks?.length || 0) / 6),
    companyMaturity: clamp((agency.yearsInBusiness || agency.experienceYears || 0) / 20),
    profileCompleteness: clamp(profileFields.filter(Boolean).length / profileFields.length),
    userEngagement: clamp(Math.log10((agency.bookmarkCount || 0) + (agency.reviewsCount || 0) + 1) / 3),
    recentActivity: updatedAt ? clamp(1 - ((Date.now() - updatedAt) / (365 * 24 * 60 * 60 * 1000))) : 0,
  };
  const score = Object.entries(RANKING_WEIGHTS).reduce((total, [key, weight]) => total + factors[key] * weight, 0);
  return { score: Number((score * 100).toFixed(2)), factors };
};

export const recommendationReasons = (agency, context = {}) => {
  const { factors } = calculateScore(agency, context);
  const labels = [
    ['serviceMatch', 'Matches your requested services'], ['technologyMatch', 'Strong technology fit'],
    ['portfolioQuality', 'Published portfolio experience'], ['reputation', 'Strong client reputation'],
    ['companyMaturity', 'Established agency experience'], ['profileCompleteness', 'Complete and verified profile'],
  ];
  return labels.filter(([key]) => factors[key] >= 0.65).slice(0, 3).map(([, label]) => label);
};

export const refreshAgencyRanking = async (agencyId) => {
  const [agency, bookmarkCount] = await Promise.all([Agency.findById(agencyId).lean(), Bookmark.countDocuments({ agency: agencyId })]);
  if (!agency) return null;
  const ranking = calculateScore({ ...agency, bookmarkCount });
  await Agency.updateOne({ _id: agencyId }, { $set: { rankingScore: ranking.score, rankingFactors: ranking.factors } });
  return ranking;
};

export const refreshRankings = async () => {
  const [agencies, bookmarkCounts] = await Promise.all([Agency.find().lean(), Bookmark.aggregate([{ $group: { _id: '$agency', count: { $sum: 1 } } }])]);
  const counts = new Map(bookmarkCounts.map((item) => [String(item._id), item.count]));
  if (agencies.length) await Agency.bulkWrite(agencies.map((agency) => {
    const ranking = calculateScore({ ...agency, bookmarkCount: counts.get(String(agency._id)) || 0 });
    return { updateOne: { filter: { _id: agency._id }, update: { $set: { rankingScore: ranking.score, rankingFactors: ranking.factors } } } };
  }), { ordered: false });
  return agencies.length;
};
