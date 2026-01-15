import { type ReactNode, createContext, useContext } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// Context for selection group
interface SelectionGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  type: 'radio' | 'checkbox';
}

const SelectionGroupContext = createContext<SelectionGroupContextValue | null>(null);

function useSelectionGroupContext() {
  return useContext(SelectionGroupContext);
}

// SelectionGroup - Container for multiple SelectionCards
interface SelectionGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  type?: 'radio' | 'checkbox';
}

export function SelectionGroup({
  name,
  value,
  onChange,
  children,
  className,
  type = 'radio',
}: SelectionGroupProps) {
  return (
    <SelectionGroupContext.Provider value={{ name, value, onChange, type }}>
      <div className={cn('space-y-3', className)} role="radiogroup">
        {children}
      </div>
    </SelectionGroupContext.Provider>
  );
}

SelectionGroup.displayName = 'SelectionGroup';

// SelectionCard - Individual selectable card
interface SelectionCardProps {
  value: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SelectionCard({
  value,
  title,
  description,
  icon,
  rightIcon,
  disabled = false,
  className,
  children,
}: SelectionCardProps) {
  const context = useSelectionGroupContext();

  if (!context) {
    throw new Error('SelectionCard must be used within a SelectionGroup');
  }

  const { name, value: selectedValue, onChange, type } = context;
  const isSelected = selectedValue === value;

  return (
    <label
      className={cn(
        'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all min-h-[72px]',
        isSelected
          ? 'border-secondary bg-secondary-50'
          : 'border-gray-200 hover:border-primary-200',
        disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200',
        className
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Selection indicator */}
      <div
        className={cn(
          'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
          isSelected ? 'border-secondary' : 'border-gray-300'
        )}
      >
        {isSelected && (
          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-secondary" />
        )}
      </div>

      {/* Icon */}
      {icon && (
        <span className={cn('flex-shrink-0', isSelected ? 'text-secondary' : 'text-content-muted')}>
          {icon}
        </span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base text-primary">{title}</p>
        {description && (
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">{description}</p>
        )}
        {children}
      </div>

      {/* Right icon */}
      {rightIcon && (
        <span className="flex-shrink-0 text-content-muted">{rightIcon}</span>
      )}
    </label>
  );
}

SelectionCard.displayName = 'SelectionCard';

// CheckboxCard - Card with checkbox indicator instead of radio
interface CheckboxCardProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function CheckboxCard({
  checked,
  onChange,
  title,
  description,
  icon,
  disabled = false,
  className,
  children,
}: CheckboxCardProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all min-h-[72px]',
        checked
          ? 'border-secondary bg-secondary-50'
          : 'border-gray-200 hover:border-primary-200',
        disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Checkbox indicator */}
      <div
        className={cn(
          'w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors',
          checked
            ? 'border-secondary bg-secondary'
            : 'border-gray-300'
        )}
      >
        {checked && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />}
      </div>

      {/* Icon */}
      {icon && (
        <span className={cn('flex-shrink-0', checked ? 'text-secondary' : 'text-content-muted')}>
          {icon}
        </span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base text-primary">{title}</p>
        {description && (
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">{description}</p>
        )}
        {children}
      </div>
    </label>
  );
}

CheckboxCard.displayName = 'CheckboxCard';

// OptionCard - Simplified card for quick selection (like color swatches, sizes)
interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function OptionCard({
  selected,
  onClick,
  children,
  disabled = false,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={cn(
        'p-3 sm:p-4 rounded-xl border-2 transition-all text-center min-h-[48px]',
        selected
          ? 'border-secondary bg-secondary-50 text-primary font-medium'
          : 'border-gray-200 hover:border-primary-200 text-content',
        disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200',
        className
      )}
    >
      {children}
    </button>
  );
}

OptionCard.displayName = 'OptionCard';

export type {
  SelectionGroupProps,
  SelectionCardProps,
  CheckboxCardProps,
  OptionCardProps,
};
