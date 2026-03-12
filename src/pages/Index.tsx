import { useState, useMemo, useEffect } from 'react';
import { HeroSection } from '@/components/hero-section';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { AgencyCard } from '@/components/agency-card';
import { Filters } from '@/components/filters';
import { Footer } from '@/components/footer';
import { mockAgencies, mockAnalytics } from '@/lib/mock-data';
import { FilterState, Agency } from '@/lib/types';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    services: [],
    states: [],
    minRating: 0,
    sortBy: 'rating',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [pageSize, setPageSize] = useState(9);

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search from hero section
  const handleHeroSearch = (services: string[], query: string) => {
    setSelectedServices(services);
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      services: services as any,
    }));
    // Scroll to agencies section
    setTimeout(() => {
      document.getElementById('agencies-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filter and sort agencies
  const filteredAgencies = useMemo(() => {
    let result = [...mockAgencies];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(agency =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by services
    if (filters.services.length > 0) {
      result = result.filter(agency =>
        filters.services.some(service => agency.services.includes(service as any))
      );
    }

    // Filter by states
    if (filters.states.length > 0) {
      result = result.filter(agency => filters.states.includes(agency.state));
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      result = result.filter(agency => agency.rating >= filters.minRating);
    }

    // Sort
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'reviewed') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, filters]);

  const displayedAgencies = filteredAgencies.slice(0, pageSize);
  const hasMore = pageSize < filteredAgencies.length;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <HeroSection onSearch={handleHeroSearch} />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard data={mockAnalytics} />

      {/* Agencies Section */}
      <section id="agencies-section" className="w-full bg-slate-50 dark:bg-slate-900 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Featured Agencies
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {filteredAgencies.length === 0
                ? 'No agencies match your filters. Try adjusting your search.'
                : `Showing ${displayedAgencies.length} of ${filteredAgencies.length} agencies`}
            </p>
          </div>

          {/* Content Layout */}
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            {!isMobile && (
              <div className="flex-shrink-0">
                <Filters
                  filters={filters}
                  onChange={setFilters}
                  isDesktop={true}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filters Dropdown */}
              {isMobile && (
                <Filters
                  filters={filters}
                  onChange={setFilters}
                  isDesktop={false}
                />
              )}

              {/* Agencies Grid */}
              {filteredAgencies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedAgencies.map((agency) => (
                      <AgencyCard key={agency.id} agency={agency} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setPageSize(prev => prev + 9)}
                        className="px-8 py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        Load More Agencies
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    No agencies found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        services: [],
                        states: [],
                        minRating: 0,
                        sortBy: 'rating',
                      });
                      setSearchQuery('');
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Clear filters and try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-primary to-blue-700 text-white py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner with a Top Agency?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Connect with our verified network of marketing agencies today and scale your business.
          </p>
          <button className="bg-white text-primary hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
