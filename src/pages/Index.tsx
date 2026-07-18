import { useState, useEffect } from "react";
import { Grid2X2, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSection } from "@/components/hero-section";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { AgencyCard } from "@/components/agency-card";
import { Filters } from "@/components/filters";
import { Footer } from "@/components/footer";
import { FilterState, Agency, Analytics } from "@/lib/types";
import { getAgencies, getAnalytics } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    services: [],
    countries: [], cities: [],
    minRating: 0,
    minReviews: 0,
    sortBy: "rating",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [pageSize, setPageSize] = useState(9);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalAgencies: 0, avgRating: 0, serviceBreakdown: {} as Analytics['serviceBreakdown'], totalReviews: 0 });
  const [totalAgencies, setTotalAgencies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const loadData = async () => {
    const params = new URLSearchParams({ limit: String(pageSize), sort: filters.sortBy });
    if (searchQuery) params.set('q', searchQuery);
    if (filters.services.length) params.set('services', filters.services.join(','));
    if (filters.countries.length) params.set('country', filters.countries.join(','));
    if (filters.cities.length) params.set('city', filters.cities.join(','));
    if (filters.minRating) params.set('minRating', String(filters.minRating));
    if (filters.minReviews) params.set('minReviews', String(filters.minReviews));
    setIsLoading(true);
    try {
      const [agencyResponse, analyticsResponse] = await Promise.all([getAgencies(params), getAnalytics()]);
      setAgencies(agencyResponse.data); setTotalAgencies(agencyResponse.pagination?.total || 0); setAnalytics(analyticsResponse.data);
    } finally { setIsLoading(false); }
  };

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { loadData().catch(() => { setAgencies([]); setTotalAgencies(0); }); }, [searchQuery, filters, pageSize]);

  // Handle search from hero section
  const handleHeroSearch = (services: string[], query: string) => {
    setSelectedServices(services);
    setSearchQuery(query);
    setFilters((prev) => ({
      ...prev,
      services: services as any,
    }));
    // Scroll to agencies section
    setTimeout(() => {
      document.getElementById("agencies-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const displayedAgencies = agencies;
  const hasMore = displayedAgencies.length < totalAgencies;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950">
      <HeroSection onSearch={handleHeroSearch} totalAgencies={analytics.totalAgencies} />
      {user && <section className="mx-auto max-w-7xl px-4 pt-5"><div className="flex h-[88px] items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-r from-blue-50/90 via-white to-violet-50/90 px-5 shadow-sm backdrop-blur dark:border-slate-700 dark:from-blue-950/50 dark:via-slate-900 dark:to-violet-950/40"><div className="min-w-0"><p className="text-sm font-bold text-primary">👋 Welcome back, {user.name}</p><p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">Continue where you left off · Recommended · Saved · Recently viewed</p></div><div className="hidden shrink-0 gap-2 sm:flex"><Link to="/bookmarks" className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold shadow-sm dark:bg-slate-900">Saved</Link><Link to="/dashboard" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Dashboard</Link></div></div></section>}

      {/* Analytics Dashboard */}
      <AnalyticsDashboard data={analytics} />

      {/* Agencies Section */}
      <section id="agencies-section" className="w-full bg-slate-50 dark:bg-slate-900 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Featured Agencies
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {totalAgencies === 0
                ? "No agencies match your filters. Try adjusting your search."
                : `Showing ${displayedAgencies.length} of ${totalAgencies} agencies`}
            </p>
            </div>
            <div className="flex rounded-xl border bg-white p-1 shadow-sm dark:bg-slate-800"><button onClick={() => setView('grid')} aria-label="Grid view" className={`rounded-lg p-2 ${view === 'grid' ? 'bg-primary text-white' : 'text-slate-500'}`}><Grid2X2 className="h-4" /></button><button onClick={() => setView('list')} aria-label="List view" className={`rounded-lg p-2 ${view === 'list' ? 'bg-primary text-white' : 'text-slate-500'}`}><List className="h-4" /></button></div>
          </div>

          {/* Content Layout */}
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            {!isMobile && (
              <div className="flex-shrink-0">
                <Filters countries={analytics.countries} cities={analytics.cities}
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
                <Filters countries={analytics.countries} cities={analytics.cities}
                  filters={filters}
                  onChange={setFilters}
                  isDesktop={false}
                />
              )}

              {/* Agencies Grid */}
              {isLoading ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[440px] animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"><div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-700" /><div className="mt-5 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" /><div className="mt-3 h-4 w-full rounded bg-slate-100 dark:bg-slate-700" /><div className="mt-2 h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-700" /><div className="mt-8 h-10 rounded bg-slate-100 dark:bg-slate-700" /></div>)}</div> : totalAgencies > 0 ? (
                <>
                  <div className={`${view === 'grid' ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'} mb-8`}>
                    {displayedAgencies.map((agency) => (
                      <AgencyCard key={agency.id} agency={agency} view={view}
                      onReviewSubmitted={() => {
                          loadData();
                        }}
                        />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setPageSize((prev) => prev + 9)}
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
                        countries: [], cities: [],
                        minRating: 0,
                        minReviews: 0,
                        sortBy: "rating",
                      });
                      setSearchQuery("");
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
