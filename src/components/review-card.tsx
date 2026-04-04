// import type { Review } from "@/lib/types";

// interface ReviewCardProps {
//   review: Review;
//   compact?: boolean;
// }

// export function ReviewCard({ review, compact = false }: ReviewCardProps) {
//   return (
//     <div
//       className={`p-4 border rounded-lg bg-white dark:bg-slate-800 ${
//         compact ? "max-w-md" : "max-w-lg"
//       }`}
//     >
//       <div className="flex items-center gap-3 mb-2">
//         <span className="text-2xl">{review.avatar}</span>
//         <div>
//           <p className="font-semibold">{review.author}</p>
//           <p className="text-sm text-slate-500">{review.role}</p>
//         </div>
//       </div>

//       {/* Star rating */}
//       <div className="flex mb-2">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <span
//             key={i}
//             className={i < review.rating ? "text-yellow-500" : "text-slate-300"}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       <p className="text-slate-700 dark:text-slate-300 text-sm italic">
//         “{review.text}”
//       </p>

//       <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
//         <span>{review.rating}★</span>
//         <span>·</span>
//         <span>{review.date}</span>
//       </div>

//       {/* Optional: verified badge */}
//       {review.verified && (
//         <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
//           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Verified
//         </div>
//       )}
//     </div>
//   );
// }
import { Review } from '@/lib/types';
import { StarRating } from './star-rating';
import { ThumbsUp, CheckCircle } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  compact?: boolean;
}

export function ReviewCard({ review, compact = false }: ReviewCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6">
      {/* Header with Avatar and Author Info */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex gap-3 items-start flex-1">
          <div className="text-3xl md:text-4xl flex-shrink-0">{review.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                  {review.author}
                </p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {review.role}
                </p>
              </div>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
        <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
          {review.date}
        </span>
      </div>

      {/* Star Rating */}
      <div className="mb-3">
        <StarRating rating={review.rating} size="sm" showLabel={false} />
      </div>

      {/* Review Text */}
      <p className={`text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4 ${
        compact ? 'line-clamp-2' : ''
      }`}>
        {review.text}
      </p>

      {/* Helpful Count */}
      <button className="flex items-center gap-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
        <ThumbsUp className="h-4 w-4" />
        <span>Helpful ({review.helpfulCount})</span>
      </button>
    </div>
  );
}
