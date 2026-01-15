import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  variant: {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-50 text-primary',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    premium: 'bg-secondary-100 text-secondary-600',
    neutral: 'bg-gray-100 text-gray-600',
    outline: 'border border-gray-300 bg-transparent text-gray-600',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  },
} as const;

type BadgeVariant = keyof typeof badgeVariants.variant;
type BadgeSize = keyof typeof badgeVariants.size;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

function Badge({
  variant = 'default',
  size = 'md',
  icon,
  children,
  removable = false,
  onRemove,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        'transition-colors duration-200',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex-shrink-0 w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          aria-label="Supprimer"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps, BadgeVariant, BadgeSize };
