import { useState, useEffect, useRef, type ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
  auto: '',
} as const;

type AspectRatio = keyof typeof aspectRatioClasses;

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: AspectRatio;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  blur?: boolean;
  skeleton?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  containerClassName?: string;
}

const DEFAULT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage non disponible%3C/text%3E%3C/svg%3E';

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  aspectRatio = 'auto',
  objectFit = 'cover',
  blur = true,
  skeleton = true,
  rounded = 'lg',
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const currentSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        roundedClasses[rounded],
        containerClassName
      )}
    >
      {/* Skeleton loader */}
      {skeleton && isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-all duration-300',
            objectFitClasses[objectFit],
            roundedClasses[rounded],
            // Blur effect during loading
            blur && isLoading && 'blur-sm scale-105',
            // Final state
            !isLoading && 'blur-0 scale-100',
            className
          )}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}

      {/* Placeholder when not in view */}
      {!isInView && (
        <div className="absolute inset-0 bg-gray-100" />
      )}
    </div>
  );
}

// Simplified version for backgrounds
interface BackgroundImageProps {
  src: string;
  fallbackSrc?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  overlay = false,
  overlayOpacity = 0.4,
  children,
  className,
}: BackgroundImageProps) {
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? fallbackSrc : src;

  // Preload image to detect errors
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => setHasError(true);
  }, [src]);

  return (
    <div
      className={cn('relative bg-cover bg-center bg-no-repeat', className)}
      style={{ backgroundImage: `url(${currentSrc})` }}
    >
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

OptimizedImage.displayName = 'OptimizedImage';
BackgroundImage.displayName = 'BackgroundImage';

export type { OptimizedImageProps, BackgroundImageProps, AspectRatio };
