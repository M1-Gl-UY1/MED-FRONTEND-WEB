import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const titleSizes = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl lg:text-4xl',
  lg: 'text-3xl sm:text-4xl lg:text-5xl',
} as const;

export function SectionHeader({
  label,
  title,
  subtitle,
  action,
  centered = false,
  size = 'md',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 lg:mb-10',
        centered ? 'text-center' : 'flex flex-col sm:flex-row sm:items-end justify-between gap-4',
        className
      )}
    >
      <div className={cn(centered && 'max-w-2xl mx-auto')}>
        {label && (
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2 block">
            {label}
          </span>
        )}
        <h2 className={cn('font-bold text-primary', titleSizes[size])}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn('text-text-light mt-2', size === 'lg' && 'text-lg')}>
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {action && !centered && (
        <Link
          to={action.href}
          className="hidden sm:inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group flex-shrink-0"
        >
          {action.label}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {action && centered && (
        <Link
          to={action.href}
          className="inline-flex items-center justify-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group mt-4"
        >
          {action.label}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// Mobile-only action link (for use at bottom of sections)
interface SectionMobileActionProps {
  label: string;
  href: string;
  className?: string;
}

export function SectionMobileAction({ label, href, className }: SectionMobileActionProps) {
  return (
    <Link
      to={href}
      className={cn(
        'sm:hidden flex items-center justify-center gap-2 text-secondary font-semibold mt-8 py-3',
        className
      )}
    >
      {label}
      <ArrowRight className="w-5 h-5" />
    </Link>
  );
}

SectionHeader.displayName = 'SectionHeader';
SectionMobileAction.displayName = 'SectionMobileAction';

export type { SectionHeaderProps, SectionMobileActionProps };
