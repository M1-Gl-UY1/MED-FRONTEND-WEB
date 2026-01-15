import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const alertVariants = {
  info: {
    container: 'bg-info/10 border-info/20',
    icon: 'text-info',
    text: 'text-info',
  },
  success: {
    container: 'bg-success/10 border-success/20',
    icon: 'text-success',
    text: 'text-success',
  },
  warning: {
    container: 'bg-warning/10 border-warning/20',
    icon: 'text-warning',
    text: 'text-warning',
  },
  error: {
    container: 'bg-error/10 border-error/20',
    icon: 'text-error',
    text: 'text-error',
  },
} as const;

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

type AlertVariant = keyof typeof alertVariants;

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const styles = alertVariants[variant];
  const DefaultIcon = alertIcons[variant];

  return (
    <div
      className={cn(
        'rounded-xl p-4 border',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <span className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
          {icon ?? <DefaultIcon className="w-5 h-5" />}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn('font-semibold text-sm mb-1', styles.text)}>
              {title}
            </p>
          )}
          <div className={cn('text-sm', styles.text)}>
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg',
              'hover:bg-black/5 transition-colors',
              styles.text
            )}
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

Alert.displayName = 'Alert';

export type { AlertProps, AlertVariant };
