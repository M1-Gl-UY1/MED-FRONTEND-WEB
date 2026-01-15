import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTASectionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  variant?: 'gold' | 'primary' | 'white';
}

const variantStyles = {
  gold: {
    section: 'gold-gradient',
    title: 'text-primary',
    description: 'text-primary-600',
    primaryVariant: 'secondary' as const,
    primaryClass: '',
    secondaryVariant: 'outline' as const,
    secondaryClass: 'border-primary/30 text-primary hover:bg-primary hover:text-white',
  },
  primary: {
    section: 'bg-primary text-white',
    title: 'text-white',
    description: 'text-primary-200',
    primaryVariant: 'primary' as const,
    primaryClass: '',
    secondaryVariant: 'outline' as const,
    secondaryClass: 'border-white/30 text-white hover:bg-white/10',
  },
  white: {
    section: 'bg-white',
    title: 'text-primary',
    description: 'text-text-light',
    primaryVariant: 'primary' as const,
    primaryClass: '',
    secondaryVariant: 'outline' as const,
    secondaryClass: '',
  },
} as const;

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'gold',
}: CTASectionProps) {
  const styles = variantStyles[variant];

  return (
    <section className={`${styles.section} py-16 sm:py-20 lg:py-24`}>
      <div className="container text-center">
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${styles.title} mb-4`}>
          {title}
        </h2>
        <p className={`${styles.description} mb-8 max-w-2xl mx-auto text-lg`}>
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            to={primaryAction.href}
            variant={styles.primaryVariant}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className={styles.primaryClass}
          >
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              asChild
              to={secondaryAction.href}
              variant={styles.secondaryVariant}
              className={styles.secondaryClass}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

CTASection.displayName = 'CTASection';

export type { CTASectionProps };
