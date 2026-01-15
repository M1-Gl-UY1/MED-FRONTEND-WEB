import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../data/mockData';

interface Stat {
  value: string;
  label: string;
}

interface HeroSectionProps {
  badge?: string;
  title: {
    line1: string;
    highlight: string;
    line2: string;
  };
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  stats: Stat[];
  image: {
    src: string;
    alt: string;
  };
  priceTag?: {
    label: string;
    price: number;
    suffix?: string;
  };
  featureBadge?: string;
}

export function HeroSection({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats,
  image,
  priceTag,
  featureBadge,
}: HeroSectionProps) {
  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Hero Content */}
          <div>
            {badge && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                {badge}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1]">
              {title.line1}
              <br />
              <span className="text-secondary">{title.highlight}</span>
              <br />
              {title.line2}
            </h1>
            <p className="text-lg sm:text-xl text-primary-200 mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild to={primaryAction.href} rightIcon={<ArrowRight className="w-5 h-5" />}>
                {primaryAction.label}
              </Button>
              {secondaryAction && (
                <Button
                  variant="outline"
                  onClick={secondaryAction.onClick}
                  leftIcon={<Play className="w-5 h-5" />}
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-2xl sm:text-3xl font-bold text-secondary">{stat.value}</p>
                  <p className="text-sm text-primary-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <img
                src={image.src}
                alt={image.alt}
                className="rounded-2xl shadow-2xl w-full"
              />
              {/* Price Badge */}
              {priceTag && (
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                  <p className="text-sm text-text-muted mb-1">{priceTag.label}</p>
                  <p className="text-3xl font-bold text-secondary">
                    {formatPrice(priceTag.price)}
                  </p>
                  {priceTag.suffix && (
                    <p className="text-xs text-text-muted mt-1">{priceTag.suffix}</p>
                  )}
                </div>
              )}
              {/* Features Badge */}
              {featureBadge && (
                <div className="absolute -top-4 -right-4 bg-secondary text-primary rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-sm font-bold">{featureBadge}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

HeroSection.displayName = 'HeroSection';

export type { HeroSectionProps, Stat };
