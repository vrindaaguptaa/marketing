import { X, Loader } from 'lucide-react';
import { useState } from 'react';
import { InteractiveStarRating } from './interactive-star-rating';
import { SERVICES } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { submitReview } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName: string;
  agencyId: string;
  onSubmitSuccess?: () => void;
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  agencyName,
  agencyId,
  onSubmitSuccess,
}: ReviewSubmissionModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (title.trim().length < 3) newErrors.title = 'Please add a short review title';

    if (comment.trim().length < 20) {
      newErrors.comment = 'Review must be at least 20 characters';
    }

    if (comment.length > 500) {
      newErrors.comment = 'Review must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // POST to /api/reviews/{agencyId}
  //     const apiResponse = await fetch(`/api/reviews/${agencyId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         rating,
  //         comment: comment.trim(),
  //         reviewer_name: reviewerName.trim() || undefined,
  //         services: selectedServices,
  //       }),
  //     });

  //     if (!apiResponse.ok) {
  //       const errorData = await apiResponse.json();
  //       throw new Error(errorData.error || 'Failed to submit review');
  //     }

  //     const response = await apiResponse.json();

  //     if (response.success) {
  //       toast({
  //         title: 'Review Submitted',
  //         description: response.message,
  //         duration: 4000,
  //       });

  //       // Reset form
  //       setRating(0);
  //       setComment('');
  //       setReviewerName('');
  //       setSelectedServices([]);
  //       setErrors({});

  //       // Close modal and trigger parent refresh
  //       onClose();
  //       onSubmitSuccess?.();
  //     }
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to submit review. Please try again.',
  //       variant: 'destructive',
  //       duration: 4000,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) { onClose(); navigate('/login', { state: { from: window.location.pathname } }); return; }

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await submitReview(agencyId, { rating, title: title.trim(), text: comment.trim(), services: selectedServices });
    if (response.success) {
      toast({
        title: "Review Submitted",
        description: response.message || 'Review submitted for moderation.',
        duration: 4000,
      });

      // Reset form
      setRating(0);
      setComment("");
      setTitle("");
      setReviewerName("");
      setSelectedServices([]);
      setErrors({});

      // Close modal and trigger parent refresh
      onClose();
      onSubmitSuccess?.();
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
      variant: "destructive",
      duration: 4000,
    });
  } finally {
    setIsSubmitting(false);
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
                Write a Review
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Share your experience with {agencyName}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Rating
              </label>
              <InteractiveStarRating
                value={rating}
                onChange={setRating}
                size="lg"
              />
              {errors.rating && (
                <p className="text-sm text-red-600 mt-2">{errors.rating}</p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review-title" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Review title</label>
              <input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Summarize your experience" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this agency... (minimum 20 characters)"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                rows={5}
              />
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  comment.length > 500
                    ? 'text-red-600'
                    : comment.length < 20
                    ? 'text-slate-500'
                    : 'text-green-600'
                }`}>
                  {comment.length}/500 characters
                </p>
                {comment.length < 20 && comment.length > 0 && (
                  <p className="text-xs text-slate-500">Min. 20 characters needed</p>
                )}
              </div>
              {errors.comment && (
                <p className="text-sm text-red-600 mt-2">{errors.comment}</p>
              )}
            </div>

            {/* Services Used */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Services Used (optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SERVICES.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices([...selectedServices, service]);
                        } else {
                          setSelectedServices(selectedServices.filter(s => s !== service));
                        }
                      }}
                      disabled={isSubmitting}
                      className="w-4 h-4 text-primary rounded cursor-pointer disabled:opacity-50"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-900 dark:text-blue-300">
                ✓ Your review will be moderated before appearing publicly. <br/>
                ✓ We verify that reviews come from real customers. <br/>
                ✓ Please be honest and constructive in your feedback.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || title.trim().length < 3 || comment.length < 20}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span>✏️</span>
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
