import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: 'Accueil', href: '/' }, ...items]
    : items;

  return (
    <nav
      className={cn('flex items-center gap-2 text-sm text-content-light mb-6', className)}
      aria-label="Fil d'Ariane"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isHome = index === 0 && showHome;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            )}
            {isLast ? (
              <span className="text-primary font-medium" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="hover:text-secondary transition-colors flex items-center gap-1"
              >
                {isHome && <Home className="w-4 h-4" />}
                <span className={isHome ? 'sr-only sm:not-sr-only' : ''}>
                  {item.label}
                </span>
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

Breadcrumb.displayName = 'Breadcrumb';

export type { BreadcrumbProps, BreadcrumbItem };
