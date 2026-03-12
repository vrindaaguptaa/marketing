import { Star, ExternalLink, Mail } from 'lucide-react';
import { Agency } from '@/lib/types';
import { SERVICE_COLORS } from '@/lib/mock-data';
import { useState } from 'react';

interface AgencyCardProps {
  agency: Agency;
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(agency.rating)
          ? 'fill-amber-400 text-amber-400'
          : 'text-slate-300 dark:text-slate-600'
      }`}
    />
  ));

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 h-full flex flex-col"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl">{agency.logo}</div>
          {agency.badge && (
            <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
              {agency.badge}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {agency.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {agency.location}
        </p>
      </div>

      {/* Body */}
      <div className="flex-grow p-6">
        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {agency.description}
        </p>

        {/* Services */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Services:
          </p>
          <div className="flex flex-wrap gap-2">
            {agency.services.slice(0, isExpanded ? agency.services.length : 3).map((service) => (
              <span
                key={service}
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border transition-all ${SERVICE_COLORS[service]}`}
              >
                {service}
              </span>
            ))}
            {!isExpanded && agency.services.length > 3 && (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                +{agency.services.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">{stars}</div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {agency.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({agency.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Footer - Buttons */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex gap-3">
          <a
            href={agency.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-md"
          >
            <span>View Profile</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 font-semibold rounded-lg transition-all">
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}
