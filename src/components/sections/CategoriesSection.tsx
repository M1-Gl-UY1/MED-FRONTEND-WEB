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
    <section className="bg-white py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20">
      <div className="container">
        <SectionHeader title={title} subtitle={subtitle} centered />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map(category => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative bg-gray-50 hover:bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 transition-all hover:shadow-xl border border-transparent hover:border-gray-100"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl ${category.color} flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}
              >
                <category.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </div>
              <h3 className="font-bold text-primary text-base sm:text-lg lg:text-xl mb-0.5 lg:mb-1">
                {category.name}
              </h3>
              <p className="text-content-light text-sm lg:text-base">
                {category.count} véhicule{category.count > 1 ? 's' : ''}
              </p>
              <ChevronRight className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-content-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

CategoriesSection.displayName = 'CategoriesSection';

export type { CategoriesSectionProps, Category };
