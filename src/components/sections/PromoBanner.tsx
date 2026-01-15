import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface PromoBannerProps {
  badge?: string;
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
  highlight?: {
    value: string;
    label: string;
  };
}

export function PromoBanner({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
  highlight,
}: PromoBannerProps) {
  return (
    <section className="bg-primary text-white py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Promo Content */}
          <div className="order-2 lg:order-1">
            {badge && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary text-sm font-semibold mb-6">
                <Star className="w-4 h-4" />
                {badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {title.main}
              <span className="text-secondary block">{title.highlight}</span>
            </h2>
            <p className="text-base sm:text-lg text-primary-200 mb-6 md:mb-8 leading-relaxed max-w-xl">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild to={primaryAction.href} rightIcon={<ArrowRight className="w-5 h-5" />}>
                {primaryAction.label}
              </Button>
              {secondaryAction && (
                <Button
                  asChild
                  to={secondaryAction.href}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          </div>

          {/* Promo Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={image.src}
                alt={image.alt}
                className="rounded-2xl w-full shadow-2xl"
              />
              {highlight && (
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-secondary text-primary rounded-2xl p-4 sm:p-6 shadow-xl">
                  <p className="text-3xl sm:text-4xl font-bold">{highlight.value}</p>
                  <p className="text-sm font-medium">{highlight.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

PromoBanner.displayName = 'PromoBanner';

export type { PromoBannerProps };
