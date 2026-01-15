import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className,
}: FormFieldProps) {
  const id = htmlFor || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-content mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-error mt-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-content-muted mt-2">{hint}</p>
      )}
    </div>
  );
}

FormField.displayName = 'FormField';

// FormInput - a simple styled input for use inside FormField
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ hasError, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full min-h-[48px] px-4 py-3 rounded-xl border bg-white text-content',
          'transition-all duration-200',
          'placeholder:text-content-muted',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
          hasError
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

// FormTextarea - a simple styled textarea for use inside FormField
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ hasError, className, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-content',
          'transition-all duration-200',
          'placeholder:text-content-muted resize-y',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
          hasError
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      />
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// FormSelect - a simple styled select for use inside FormField
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ hasError, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full min-h-[48px] px-4 py-3 rounded-xl border bg-white text-content',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
          hasError
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// FormGroup - for grouping multiple fields horizontally
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {children}
    </div>
  );
}

FormGroup.displayName = 'FormGroup';

export type { FormFieldProps, FormInputProps, FormTextareaProps, FormSelectProps, FormGroupProps };
