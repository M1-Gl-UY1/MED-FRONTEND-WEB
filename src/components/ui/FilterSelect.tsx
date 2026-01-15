import { cn } from '../../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  className,
  label,
}: FilterSelectProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label className="text-sm font-medium text-text-light mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="select"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
