import { SERVICES } from './constants';

export type Service = (typeof SERVICES)[number];

export interface Review {
  id: string;
  userId?: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  helpfulCount: number;
  verified: boolean;
}
export interface Agency {
  id: string;
  name: string;
  logo: string;
  services: Service[];
  rating: number;
  reviewCount: number;
  location: string;
  state: string;
  url: string;
  websiteVerified?: boolean;
  domain?: string;
  description: string;
  badge?: string;
  reviews: Review[];
  technologies?: string[];
  rankingScore?: number;
  rankingFactors?: Record<string, number>;
  recommendationReasons?: string[];
  pricing?: { min?: number; max?: number; currency?: string };
  experienceYears?: number;
  employees?: number;
  portfolioLinks?: string[];
  socialLinks?: { linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string };
  featuredImage?: string;
}

export interface Analytics {
  totalAgencies: number;
  verifiedAgencies?: number;
  avgRating: number;
  countriesCovered?: number;
  citiesCovered?: number;
  servicesCovered?: number;
  technologiesCovered?: number;
  countries?: string[];
  cities?: Array<{ city: string; country?: string }>;
  serviceBreakdown: Record<Service, number>;
  totalReviews: number;
}

export interface FilterState {
  services: Service[];
  countries: string[];
  cities: string[];
  minRating: number;
  minReviews: number;
  sortBy: 'rating' | 'name' | 'reviewed';
}
