import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// Variants configuration
const buttonVariants = {
  variant: {
    primary: 'bg-secondary text-primary hover:bg-secondary-300 active:bg-secondary-400',
    secondary: 'bg-primary text-white hover:bg-accent active:bg-accent-dark',
    outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-content hover:bg-primary-50 active:bg-primary-100',
    link: 'bg-transparent text-secondary hover:underline underline-offset-4 p-0 h-auto min-h-0',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80',
  },
  size: {
    sm: 'min-h-[44px] px-4 py-2 text-sm gap-1.5',
    md: 'min-h-[48px] px-6 py-3 text-base gap-2',
    lg: 'min-h-[56px] px-8 py-4 text-lg gap-2.5',
    icon: 'min-h-[48px] w-12 p-0',
    'icon-sm': 'min-h-[44px] w-11 p-0',
  },
} as const;

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

// Base props shared between Button and ButtonLink
interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

// Button as <button>
interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  asChild?: false;
  to?: never;
}

// Button as <Link>
interface ButtonAsLinkProps extends ButtonBaseProps, Omit<LinkProps, keyof ButtonBaseProps> {
  asChild?: true;
  to: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      asChild,
      disabled,
      ...rest
    } = props;

    const baseStyles = cn(
      // Base styles
      'inline-flex items-center justify-center font-semibold rounded-lg',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'whitespace-nowrap select-none',
      // Variant styles
      buttonVariants.variant[variant],
      // Size styles (skip for link variant)
      variant !== 'link' && buttonVariants.size[size],
      // Full width
      fullWidth && 'w-full',
      // Custom className
      className
    );

    const content = (
      <>
        {isLoading && (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    // Render as Link
    if (asChild && 'to' in props && props.to) {
      const { to, ...linkRest } = rest as Omit<ButtonAsLinkProps, keyof ButtonBaseProps>;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={cn(baseStyles, disabled && 'pointer-events-none opacity-50')}
          aria-disabled={disabled}
          {...linkRest}
        >
          {content}
        </Link>
      );
    }

    // Render as button
    const buttonRest = rest as Omit<ButtonAsButtonProps, keyof ButtonBaseProps>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonRest.type ?? 'button'}
        className={baseStyles}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps, ButtonVariant, ButtonSize };
