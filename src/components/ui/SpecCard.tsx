import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SpecCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function SpecCard({ icon, label, value, className }: SpecCardProps) {
  return (
    <div className={cn('card p-3 sm:p-4', className)}>
      <span className="text-secondary mb-2 block">{icon}</span>
      <p className="text-xs text-content-muted mb-0.5">{label}</p>
      <p className="font-semibold text-primary text-sm sm:text-base">{value}</p>
    </div>
  );
}

SpecCard.displayName = 'SpecCard';

// SpecGrid - for displaying multiple SpecCards
interface SpecGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
} as const;

export function SpecGrid({ children, columns = 3, className }: SpecGridProps) {
  return (
    <div className={cn('grid gap-3 sm:gap-4', columnClasses[columns], className)}>
      {children}
    </div>
  );
}

SpecGrid.displayName = 'SpecGrid';

// FeatureCard - for feature highlights with icon, title, description
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  centered?: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  centered = true,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group bg-gray-50 hover:bg-white rounded-2xl p-6 sm:p-8 transition-all hover:shadow-xl border border-transparent hover:border-gray-100',
        centered && 'text-center',
        className
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:scale-110 transition-all',
          centered && 'mx-auto'
        )}
      >
        <span className="text-secondary group-hover:text-primary transition-colors">
          {icon}
        </span>
      </div>
      <h3 className="font-bold text-primary text-lg mb-3">{title}</h3>
      <p className="text-content-light leading-relaxed">{description}</p>
    </div>
  );
}

FeatureCard.displayName = 'FeatureCard';

// InfoItem - simple icon + label + value inline
interface InfoItemProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function InfoItem({ icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {icon && <span className="text-content-muted flex-shrink-0">{icon}</span>}
      <span className="text-content-muted">{label}:</span>
      <span className="font-medium text-primary">{value}</span>
    </div>
  );
}

InfoItem.displayName = 'InfoItem';

export type { SpecCardProps, SpecGridProps, FeatureCardProps, InfoItemProps };
