import { forwardRef, useState, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const inputVariants = {
  size: {
    sm: 'min-h-[40px] px-3 py-2 text-sm',
    md: 'min-h-[48px] px-4 py-3 text-base',
    lg: 'min-h-[56px] px-5 py-4 text-lg',
  },
} as const;

type InputSize = keyof typeof inputVariants.size;

// Base input props
interface InputBaseProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: InputSize;
  fullWidth?: boolean;
  containerClassName?: string;
}

// Input component props
interface InputProps
  extends InputBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      fullWidth = true,
      containerClassName,
      className,
      type,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full rounded-xl border bg-white text-text',
              'transition-all duration-200',
              'placeholder:text-text-muted',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary',
              // Disabled styles
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              // Error styles
              error
                ? 'border-error focus:ring-error focus:border-error'
                : 'border-gray-200 hover:border-gray-300',
              // Size
              inputVariants.size[inputSize],
              // Icon padding
              leftIcon && 'pl-12',
              (rightIcon || isPassword) && 'pr-12',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text rounded-lg transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {rightIcon && !isPassword && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-sm text-error mt-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-text-muted mt-2">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps
  extends InputBaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = 'md',
      fullWidth = true,
      containerClassName,
      className,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            // Base styles
            'w-full rounded-xl border bg-white text-text',
            'transition-all duration-200',
            'placeholder:text-text-muted',
            'resize-y',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary',
            // Disabled styles
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            // Error styles
            error
              ? 'border-error focus:ring-error focus:border-error'
              : 'border-gray-200 hover:border-gray-300',
            // Padding based on size
            inputSize === 'sm' && 'px-3 py-2 text-sm',
            inputSize === 'md' && 'px-4 py-3 text-base',
            inputSize === 'lg' && 'px-5 py-4 text-lg',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="flex items-center gap-1.5 text-sm text-error mt-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-sm text-text-muted mt-2">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// InputGroup for combining inputs
interface InputGroupProps {
  children: ReactNode;
  className?: string;
}

function InputGroup({ children, className }: InputGroupProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      {children}
    </div>
  );
}

InputGroup.displayName = 'InputGroup';

export { Input, Textarea, InputGroup, inputVariants };
export type { InputProps, TextareaProps, InputSize };
