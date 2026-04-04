import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StarRating({ rating, count, size = 'md', showLabel = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`${sizeClasses[size]} ${
        i < Math.floor(rating)
          ? 'fill-amber-400 text-amber-400'
          : i - Math.floor(rating) < 1 && rating % 1 !== 0
          ? 'fill-amber-400 text-amber-400 opacity-50'
          : 'text-slate-300 dark:text-slate-600'
      }`}
    />
  ));

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">{stars}</div>
      {showLabel && (
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({count} reviews)
        </span>
      )}
    </div>
  );
}
