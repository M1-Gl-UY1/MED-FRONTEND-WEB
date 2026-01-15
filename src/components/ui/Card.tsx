import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

const cardVariants = {
  variant: {
    default: 'bg-white border border-gray-100',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-200',
    ghost: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-white to-gray-50',
  },
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  },
} as const;

type CardVariant = keyof typeof cardVariants.variant;
type CardPadding = keyof typeof cardVariants.padding;
type CardRadius = keyof typeof cardVariants.radius;

interface CardBaseProps {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  hover?: boolean;
  className?: string;
  children?: ReactNode;
}

// Card as <div>
interface CardAsDivProps
  extends CardBaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof CardBaseProps> {
  as?: 'div';
  to?: never;
}

// Card as <article>
interface CardAsArticleProps
  extends CardBaseProps,
    Omit<HTMLAttributes<HTMLElement>, keyof CardBaseProps> {
  as?: 'article';
  to?: never;
}

// Card as <Link>
interface CardAsLinkProps extends CardBaseProps, Omit<LinkProps, keyof CardBaseProps> {
  as?: 'link';
  to: string;
}

type CardProps = CardAsDivProps | CardAsArticleProps | CardAsLinkProps;

const Card = forwardRef<HTMLDivElement | HTMLAnchorElement | HTMLElement, CardProps>(
  (props, ref) => {
    const {
      variant = 'default',
      padding = 'md',
      radius = 'lg',
      hover = false,
      className,
      children,
      as = 'div',
      ...rest
    } = props;

    const baseStyles = cn(
      // Base transition
      'transition-all duration-200',
      // Variant styles
      cardVariants.variant[variant],
      // Padding
      cardVariants.padding[padding],
      // Radius
      cardVariants.radius[radius],
      // Hover effects
      hover && 'hover:shadow-xl hover:border-gray-200 cursor-pointer',
      // Custom className
      className
    );

    // Render as Link
    if (as === 'link' && 'to' in props && props.to) {
      const { to, ...linkRest } = rest as Omit<CardAsLinkProps, keyof CardBaseProps>;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={baseStyles}
          {...linkRest}
        >
          {children}
        </Link>
      );
    }

    // Render as article
    if (as === 'article') {
      const articleRest = rest as Omit<CardAsArticleProps, keyof CardBaseProps>;
      return (
        <article
          ref={ref as React.Ref<HTMLElement>}
          className={baseStyles}
          {...articleRest}
        >
          {children}
        </article>
      );
    }

    // Render as div (default)
    const divRest = rest as Omit<CardAsDivProps, keyof CardBaseProps>;
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseStyles}
        {...divRest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

function CardHeader({ title, subtitle, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
      {...props}
    >
      {children ?? (
        <>
          <div>
            {title && (
              <h3 className="font-semibold text-primary text-base sm:text-lg">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-content-light mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
}

CardHeader.displayName = 'CardHeader';

// CardContent component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

CardContent.displayName = 'CardContent';

// CardFooter component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  separated?: boolean;
}

function CardFooter({ separated = true, className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-4',
        separated && 'pt-4 border-t border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

CardFooter.displayName = 'CardFooter';

// CardImage component
interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  overlay?: ReactNode;
}

function CardImage({
  src,
  alt,
  aspectRatio = 'video',
  overlay,
  className,
  ...props
}: CardImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: '',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
}

CardImage.displayName = 'CardImage';

export { Card, CardHeader, CardContent, CardFooter, CardImage, cardVariants };
export type { CardProps, CardVariant, CardPadding, CardRadius, CardHeaderProps, CardFooterProps, CardImageProps };
