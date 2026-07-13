import { formatINR, discountPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { price: 'text-sm', mrp: 'text-xs', off: 'text-xs' },
  md: { price: 'text-lg', mrp: 'text-sm', off: 'text-xs' },
  lg: { price: 'text-2xl', mrp: 'text-base', off: 'text-sm' },
};

export function Price({ price, mrp, size = 'md', className }: PriceProps) {
  const s = sizeMap[size];
  const off = mrp ? discountPercent(mrp, price) : 0;
  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-foreground', s.price)}>{formatINR(price)}</span>
      {mrp && off > 0 && (
        <>
          <span className={cn('text-muted-foreground line-through', s.mrp)}>{formatINR(mrp)}</span>
          <span className={cn('font-semibold text-[var(--success)]', s.off)}>{off}% off</span>
        </>
      )}
    </div>
  );
}
