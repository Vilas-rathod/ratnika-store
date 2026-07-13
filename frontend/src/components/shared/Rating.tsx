import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export function Rating({ value, count, size = 14, className, showValue }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              i <= Math.round(value)
                ? 'fill-[var(--gold)] text-[var(--gold)]'
                : 'fill-transparent text-muted-foreground/40',
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-xs font-medium">{value.toFixed(1)}</span>}
      {count != null && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${i} stars`}
        >
          <Star
            className={cn(
              'h-7 w-7',
              i <= value
                ? 'fill-[var(--gold)] text-[var(--gold)]'
                : 'fill-transparent text-muted-foreground/40',
            )}
          />
        </button>
      ))}
    </div>
  );
}
