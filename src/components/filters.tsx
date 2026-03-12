import { ChevronDown, Filter, X } from 'lucide-react';
import { SERVICES, US_STATES } from '@/lib/mock-data';
import { FilterState, Service } from '@/lib/types';
import { useState } from 'react';

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isDesktop?: boolean;
}

export function Filters({ filters, onChange, isDesktop = true }: FiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('services');
  const [isOpen, setIsOpen] = useState(isDesktop);

  const handleServiceChange = (service: Service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onChange({ ...filters, services: newServices });
  };

  const handleStateChange = (state: string) => {
    const newStates = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    onChange({ ...filters, states: newStates });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleSortChange = (sortBy: 'rating' | 'name' | 'reviewed') => {
    onChange({ ...filters, sortBy });
  };

  const resetFilters = () => {
    onChange({
      services: [],
      states: [],
      minRating: 0,
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
            <span>Filters {filters.services.length + filters.states.length > 0 && `(${filters.services.length + filters.states.length})`}</span>
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
              onStateChange={handleStateChange}
              onRatingChange={handleRatingChange}
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
        {(filters.services.length > 0 || filters.states.length > 0) && (
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
          onStateChange={handleStateChange}
          onRatingChange={handleRatingChange}
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
  onStateChange: (state: string) => void;
  onRatingChange: (rating: number) => void;
  onSortChange: (sortBy: 'rating' | 'name' | 'reviewed') => void;
  onReset: () => void;
}

function FiltersContent({
  filters,
  expandedSection,
  onExpandChange,
  onServiceChange,
  onStateChange,
  onRatingChange,
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

      {/* Top States */}
      <FilterSection title="Top States" id="states">
        <div className="space-y-2">
          {['CA', 'NY', 'TX', 'FL', 'IL'].map((state) => (
            <label key={state} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.states.includes(state)}
                onChange={() => onStateChange(state)}
                className="w-4 h-4 text-primary cursor-pointer rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{state}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );
}
