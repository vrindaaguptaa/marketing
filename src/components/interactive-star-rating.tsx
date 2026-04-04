import { Star } from 'lucide-react';
import { useState } from 'react';

interface InteractiveStarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function InteractiveStarRating({ value, onChange, size = 'lg' }: InteractiveStarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayValue;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoverValue(starValue)}
              onMouseLeave={() => setHoverValue(0)}
              className={`transition-all transform hover:scale-110 ${sizeClasses[size]}`}
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className={`${sizeClasses[size]} transition-all ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {value} {value === 1 ? 'star' : 'stars'}
        </span>
      )}
    </div>
  );
}
