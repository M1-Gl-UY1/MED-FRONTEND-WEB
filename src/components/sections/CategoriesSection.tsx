import { Link } from 'react-router-dom';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

interface Category {
  name: string;
  count: number;
  href: string;
  icon: LucideIcon;
  color: string;
}

interface CategoriesSectionProps {
  title: string;
  subtitle?: string;
  categories: Category[];
}

export function CategoriesSection({
  title,
  subtitle,
  categories,
}: CategoriesSectionProps) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container">
        <SectionHeader title={title} subtitle={subtitle} centered />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(category => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative bg-gray-50 hover:bg-white rounded-2xl p-6 sm:p-8 transition-all hover:shadow-xl border border-transparent hover:border-gray-100"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <category.icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-bold text-primary text-lg sm:text-xl mb-1">
                {category.name}
              </h3>
              <p className="text-text-light">
                {category.count} véhicule{category.count > 1 ? 's' : ''}
              </p>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

CategoriesSection.displayName = 'CategoriesSection';

export type { CategoriesSectionProps, Category };
