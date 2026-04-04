export type Service = 'SEO' | 'PPC' | 'Social Media' | 'Content' | 'Email' | 'Web Design' | 'Analytics';

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
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
  description: string;
  badge?: string;
  reviews: Review[];
}

export interface Analytics {
  totalAgencies: number;
  avgRating: number;
  locationsCount: number;
  serviceBreakdown: Record<Service, number>;
  totalReviews: number;
}

export interface FilterState {
  services: Service[];
  states: string[];
  minRating: number;
  minReviews: number;
  sortBy: 'rating' | 'name' | 'reviewed';
}

