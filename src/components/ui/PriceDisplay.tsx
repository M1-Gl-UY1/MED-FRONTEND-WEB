import { cn, formatPrice } from '../../lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCurrency?: boolean;
  suffix?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const sizeClasses = {
  sm: {
    current: 'text-base font-bold',
    original: 'text-xs',
  },
  md: {
    current: 'text-lg sm:text-xl font-bold',
    original: 'text-sm',
  },
  lg: {
    current: 'text-xl sm:text-2xl font-bold',
    original: 'text-base',
  },
  xl: {
    current: 'text-2xl sm:text-3xl font-bold',
    original: 'text-lg',
  },
} as const;

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  showCurrency = true,
  suffix,
  className,
  align = 'left',
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const styles = sizeClasses[size];

  const formattedPrice = showCurrency ? formatPrice(price) : price.toLocaleString('fr-FR');
  const formattedOriginal = originalPrice
    ? showCurrency
      ? formatPrice(originalPrice)
      : originalPrice.toLocaleString('fr-FR')
    : null;

  return (
    <div className={cn(alignClasses[align], className)}>
      {hasDiscount && formattedOriginal && (
        <p className={cn('text-content-muted line-through', styles.original)}>
          {formattedOriginal}
        </p>
      )}
      <p className={cn('text-secondary', styles.current)}>
        {formattedPrice}
        {suffix && <span className="text-content-muted font-normal text-sm ml-1">{suffix}</span>}
      </p>
    </div>
  );
}

// PriceBreakdown - for order summaries
interface PriceBreakdownItem {
  label: string;
  value: number | string;
  highlight?: boolean;
  free?: boolean;
}

interface PriceBreakdownProps {
  items: PriceBreakdownItem[];
  total: {
    label: string;
    value: number;
  };
  className?: string;
}

export function PriceBreakdown({ items, total, className }: PriceBreakdownProps) {
  return (
    <div className={className}>
      <div className="space-y-3 py-4 border-t border-b border-gray-100">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-content-light">{item.label}</span>
            <span className={cn('font-medium', item.free && 'text-success')}>
              {item.free
                ? 'Gratuit'
                : typeof item.value === 'number'
                ? formatPrice(item.value)
                : item.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center py-4">
        <span className="font-semibold text-primary">{total.label}</span>
        <span className="text-2xl font-bold text-secondary">
          {formatPrice(total.value)}
        </span>
      </div>
    </div>
  );
}

PriceDisplay.displayName = 'PriceDisplay';
PriceBreakdown.displayName = 'PriceBreakdown';

export type { PriceDisplayProps, PriceBreakdownProps, PriceBreakdownItem };
