
import { ExternalLink, Mail,PenTool } from 'lucide-react';
import { Agency } from '@/lib/types';
import { SERVICE_COLORS } from '@/lib/mock-data';
import { useState } from 'react';
import { StarRating } from './star-rating';
import { ReviewsModal } from './reviews-modal';
import { ReviewCard } from './review-card';
import { ReviewSubmissionModal } from './review-submission-modal';

interface AgencyCardProps {
  agency: Agency;
  onReviewSubmitted?: () =>void;
}

export function AgencyCard({ agency, onReviewSubmitted}: AgencyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const topReviews = agency.reviews.slice(0, 2);

  return (
    <>
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
          <div className="mb-6">
            <StarRating rating={agency.rating} count={agency.reviewCount} size="md" />
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Customer Reviews:
            </p>
            <div className="space-y-2 mb-3">
              {topReviews.map((review) => (
                <div key={review.id} className="bg-slate-50 dark:bg-slate-900/50 rounded p-2.5">
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="text-sm">{review.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {review.author}
                        </p>
                        <StarRating rating={review.rating} size="sm" showLabel={false} />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowReviewsModal(true)}
              className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors"
            >
              Read All Reviews ({agency.reviews.length}) →
            </button>
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/50 space-y-3">
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
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all hover:shadow-md"
          >
            <PenTool className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        agencyName={agency.name}
        reviews={agency.reviews}
        rating={agency.rating}
      />
      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        agencyName={agency.name}
        agencyId={agency.id}
        onSubmitSuccess={onReviewSubmitted}
      />
    </>
  );
}
