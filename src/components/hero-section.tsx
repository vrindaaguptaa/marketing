import { Search } from 'lucide-react';
import { SERVICES } from '@/lib/mock-data';
import { useState } from 'react';

interface HeroSectionProps {
  onSearch: (services: string[], query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSearch = () => {
    onSearch(selectedServices, searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Headline */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Find Top US{' '}
            <span className="text-primary">Marketing Agencies</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">
            Discover vetted agencies across the United States. Compare ratings, services, and find the perfect fit for your business.
          </p>
        </div>

        {/* Search Bar and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 animate-scale-in">
          {/* Search Input */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Search Agencies
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                id="search"
                type="text"
                placeholder="Search by agency name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Services Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Filter by Services
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all border text-sm ${
                    selectedServices.includes(service)
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Search Agencies
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Browse from <span className="font-bold text-slate-900 dark:text-white">1,250+ agencies</span> across the US
          </p>
        </div>
      </div>
    </section>
  );
}
