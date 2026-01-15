import { type LucideIcon } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

export function FeaturesSection({
  label,
  title,
  subtitle,
  features,
  columns = 4,
}: FeaturesSectionProps) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container">
        <SectionHeader
          label={label}
          title={title}
          subtitle={subtitle}
          centered
        />

        {/* Features Grid */}
        <div className={`grid ${columnClasses[columns]} gap-6 lg:gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-white rounded-2xl p-6 sm:p-8 text-center transition-all hover:shadow-xl border border-transparent hover:border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-secondary group-hover:scale-110 transition-all">
                <feature.icon className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bold text-primary text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-text-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

FeaturesSection.displayName = 'FeaturesSection';

export type { FeaturesSectionProps, Feature };
