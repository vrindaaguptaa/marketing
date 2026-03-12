export type Service = 'SEO' | 'PPC' | 'Social Media' | 'Content' | 'Email' | 'Web Design' | 'Analytics';

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
}

export interface Analytics {
  totalAgencies: number;
  avgRating: number;
  locationsCount: number;
  serviceBreakdown: Record<Service, number>;
}

export interface FilterState {
  services: Service[];
  states: string[];
  minRating: number;
  sortBy: 'rating' | 'name' | 'reviewed';
}
