import { Review } from '@/lib/types';
import { ReviewCard } from './review-card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { StarRating } from './star-rating';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName: string;
  reviews: Review[];
  rating: number;
}

export function ReviewsModal({
  isOpen,
  onClose,
  agencyName,
  reviews,
  rating,
}: ReviewsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('recent');
  const itemsPerPage = 10;

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === 'helpful') {
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === 'rating') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    // 'recent' is default order
    return sorted;
  }, [reviews, sortBy]);

  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentReviews = sortedReviews.slice(startIdx, endIdx);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6">
        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Reviews for {agencyName}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {sortedReviews.length} verified reviews
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>

          {/* Rating Summary */}
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {rating.toFixed(1)}
                </p>
              </div>
              <div>
                <StarRating rating={rating} size="lg" showLabel={false} />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Based on {sortedReviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Sort by:
            </span>
            <div className="flex gap-2">
              {(['recent', 'helpful', 'rating'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {option === 'helpful'
                    ? 'Most Helpful'
                    : option === 'rating'
                    ? 'Highest Rated'
                    : 'Recent'}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} compact={false} />
            ))}
          </div>

          {/* Pagination */}
          <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 px-4">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum =
                      totalPages <= 5
                        ? i + 1
                        : Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
