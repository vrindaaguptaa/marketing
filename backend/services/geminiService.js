import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../utils/AppError.js';
const model = () => {
  if (!process.env.GEMINI_API_KEY) throw new AppError('AI search is not configured.', 503);
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
};
export const extractFilters = async (query) => {
  const prompt = `Extract agency search filters from the user request. Return only valid JSON with keys: technologies (string[]), technology (string[]), services (string[]), location (string|null), country (string|null), state (string|null), companySize (string|null), maxPrice (number|null), minRating (number|null), query (string). Convert Indian lakh/crore budgets to numeric INR. Request: ${query}`;
  const response = await model().generateContent(prompt);
  try { return JSON.parse(response.response.text().replace(/```json|```/g, '').trim()); } catch { throw new AppError('AI returned an invalid search response.', 502); }
};
export const summarizeComparison = async (agencies) => {
  const compact = agencies.map(({ name, services, technologies, pricing, experienceYears, rating, reviewsCount }) => ({ name, services, technologies, pricing, experienceYears, rating, reviewsCount }));
  const response = await model().generateContent(`Provide a concise, neutral comparison of these agencies. Do not rank them or invent facts: ${JSON.stringify(compact)}`);
  return response.response.text();
};
export const explainMatches = async (query, agencies) => {
  const compact = agencies.map(({ name, services, technologies, location, pricing, rating, rankingScore }) => ({ name, services, technologies, location, pricing, rating, rankingScore }));
  const response = await model().generateContent(`For each supplied agency, write one short factual explanation of how it matches this request: "${query}". Do not alter or determine ranking. Data: ${JSON.stringify(compact)}`);
  return response.response.text();
};
export const summarizeReviews = async (agencyName, reviews) => {
  if (!reviews.length) return { pros: [], cons: [], sentiment: 'No Google review data is currently available.', recommendedFor: [] };
  const response = await model().generateContent(`Summarize these Google reviews for ${agencyName}. Return only valid JSON with pros (string[]), cons (string[]), sentiment (string), recommendedFor (string[]). Do not invent facts. Reviews: ${JSON.stringify(reviews.map(({ rating, text }) => ({ rating, text })) )}`);
  try { return JSON.parse(response.response.text().replace(/```json|```/g, '').trim()); } catch { throw new AppError('AI returned an invalid review summary.', 502); }
};
