import { ChevronDown, Filter, X } from 'lucide-react';
import { SERVICES } from '@/lib/constants';
import { FilterState, Service } from '@/lib/types';
import { useState } from 'react';

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isDesktop?: boolean;
  countries?: string[];
  cities?: Array<{ city: string; country?: string }>;
}

export function Filters({ filters, onChange, isDesktop = true, countries = [], cities = [] }: FiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('services');
  const [isOpen, setIsOpen] = useState(isDesktop);

  const handleServiceChange = (service: Service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onChange({ ...filters, services: newServices });
  };

  const handleCountryChange = (country: string) => {
    const next = filters.countries.includes(country) ? filters.countries.filter((item) => item !== country) : [...filters.countries, country];
    onChange({ ...filters, countries: next, cities: filters.cities.filter((city) => cities.some((item) => item.city === city && (!item.country || next.includes(item.country)))) });
  };
  const handleCityChange = (city: string) => {
    const next = filters.cities.includes(city) ? filters.cities.filter((item) => item !== city) : [...filters.cities, city];
    onChange({ ...filters, cities: next });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };
  const handleReviewsChange = (threshold: number) => {
    onChange({ ...filters, minReviews: filters.minReviews === threshold ? 0 : threshold });
  };

  const handleSortChange = (sortBy: 'rating' | 'name' | 'reviewed') => {
    onChange({ ...filters, sortBy });
  };

  const resetFilters = () => {
    onChange({
      services: [],
      countries: [], cities: [],
      minRating: 0,
      minReviews: 0,
      sortBy: 'rating',
    });
  };

  if (!isDesktop) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span>Filters {filters.services.length + filters.countries.length + filters.cities.length > 0 && `(${filters.services.length + filters.countries.length + filters.cities.length})`}</span>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4 animate-slide-up">
            <FiltersContent
              filters={filters}
              expandedSection={expandedSection}
              onExpandChange={setExpandedSection}
              onServiceChange={handleServiceChange}
              onCountryChange={handleCountryChange} onCityChange={handleCityChange} countries={countries} cities={cities}
              onRatingChange={handleRatingChange}
              onReviewsChange={handleReviewsChange}
              onSortChange={handleSortChange}
              onReset={resetFilters}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-64 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-4 h-fit">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
        {(filters.services.length > 0 || filters.countries.length > 0 || filters.cities.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <FiltersContent
          filters={filters}
          expandedSection={expandedSection}
          onExpandChange={setExpandedSection}
          onServiceChange={handleServiceChange}
          onCountryChange={handleCountryChange} onCityChange={handleCityChange} countries={countries} cities={cities}
          onRatingChange={handleRatingChange}
          onReviewsChange={handleReviewsChange}
          onSortChange={handleSortChange}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
}

interface FiltersContentProps {
  filters: FilterState;
  expandedSection: string | null;
  onExpandChange: (section: string | null) => void;
  onServiceChange: (service: Service) => void;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  countries: string[];
  cities: Array<{ city: string; country?: string }>;
  onRatingChange: (rating: number) => void;
  onReviewsChange: (threshold: number) => void;
  onSortChange: (sortBy: 'rating' | 'name' | 'reviewed') => void;
  onReset: () => void;
}

function FiltersContent({
  filters,
  expandedSection,
  onExpandChange,
  onServiceChange,
  onCountryChange, onCityChange, countries, cities,
  onRatingChange,
  onReviewsChange,
  onSortChange,
}: FiltersContentProps) {
  const FilterSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div>
      <button
        onClick={() => onExpandChange(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between py-2 text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expandedSection === id ? 'rotate-180' : ''}`}
        />
      </button>
      {expandedSection === id && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  return (
    <>
      {/* Sort By */}
      <FilterSection title="Sort By" id="sort">
        <div className="space-y-2">
          {(['rating', 'name', 'reviewed'] as const).map((sortBy) => (
            <label key={sortBy} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === sortBy}
                onChange={() => onSortChange(sortBy)}
                className="w-4 h-4 text-primary cursor-pointer"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                {sortBy === 'reviewed' ? 'Most Reviewed' : `By ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Services */}
      <FilterSection title="Services" id="services">
        <div className="space-y-2">
          {SERVICES.map((service) => (
            <label key={service} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.services.includes(service)}
                onChange={() => onServiceChange(service)}
                className="w-4 h-4 text-primary cursor-pointer rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{service}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection title="Minimum Rating" id="rating">
        <div className="space-y-2">
          {[4, 4.5, 4.7].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => onRatingChange(rating)}
                className="w-4 h-4 text-primary cursor-pointer"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {rating}+ stars
              </span>
            </label>
          ))}
          {filters.minRating > 0 && (
            <button
              onClick={() => onRatingChange(0)}
              className="text-xs font-semibold text-primary hover:underline mt-2"
            >
              Clear
            </button>
          )}
        </div>
      </FilterSection>


      {/* Minimum Reviews */}
      <FilterSection title="Reviews" id="reviews">
        <div className="space-y-2">
          {[10, 50, 100].map((threshold) => (
            <label key={threshold} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="reviews"
                checked={filters.minReviews === threshold}
                onChange={() => onReviewsChange(threshold)}
                className="w-4 h-4 text-primary cursor-pointer"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {threshold}+ reviews
              </span>
            </label>
          ))}
          {filters.minReviews > 0 && (
            <button
              onClick={() => onReviewsChange(filters.minReviews)}
              className="text-xs font-semibold text-primary hover:underline mt-2"
            >
              Clear
            </button>
          )}
        </div>
      </FilterSection>


      
      <FilterSection title="Countries" id="countries">
        <div className="space-y-2">
          {countries.map((country) => (
            <label key={country} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.countries.includes(country)}
                onChange={() => onCountryChange(country)}
                className="w-4 h-4 text-primary cursor-pointer rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{country}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      {filters.countries.length ? <FilterSection title="Cities" id="cities"><div className="space-y-2">{cities.filter((item) => !item.country || filters.countries.includes(item.country)).map((item) => <label key={`${item.country}-${item.city}`} className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={filters.cities.includes(item.city)} onChange={() => onCityChange(item.city)} className="h-4 w-4 rounded text-primary" /><span className="text-sm text-slate-700 dark:text-slate-300">{item.city}</span></label>)}</div></FilterSection> : null}
    </>
  );
}
