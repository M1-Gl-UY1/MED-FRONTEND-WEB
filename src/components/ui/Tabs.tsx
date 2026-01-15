import { type ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

// Context for tabs state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Main Tabs container
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value ?? internalValue;
  const setActiveTab = (id: string) => {
    if (!value) {
      setInternalValue(id);
    }
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.displayName = 'Tabs';

// TabsList - Container for tab triggers
interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

const listVariants = {
  default: 'bg-gray-100 p-1 rounded-xl',
  pills: 'gap-2',
  underline: 'border-b border-gray-200 gap-0',
} as const;

export function TabsList({
  children,
  className,
  variant = 'default',
  fullWidth = false,
}: TabsListProps) {
  return (
    <div
      className={cn(
        'flex items-center',
        listVariants[variant],
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

TabsList.displayName = 'TabsList';

// TabsTrigger - Individual tab button
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'pills' | 'underline';
}

const triggerVariants = {
  default: {
    base: 'px-4 py-2 rounded-lg text-sm font-medium transition-all',
    active: 'bg-white text-primary shadow-sm',
    inactive: 'text-text-muted hover:text-primary',
  },
  pills: {
    base: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
    active: 'bg-secondary text-primary',
    inactive: 'bg-gray-100 text-text-muted hover:bg-gray-200',
  },
  underline: {
    base: 'px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px',
    active: 'border-secondary text-primary',
    inactive: 'border-transparent text-text-muted hover:text-primary hover:border-gray-300',
  },
} as const;

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
  variant = 'default',
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  const styles = triggerVariants[variant];

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        styles.base,
        isActive ? styles.active : styles.inactive,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

TabsTrigger.displayName = 'TabsTrigger';

// TabsContent - Content panel for each tab
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabsContent({
  value,
  children,
  className,
  forceMount = false,
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  );
}

TabsContent.displayName = 'TabsContent';

// Simple Tabs - All-in-one component for simpler use cases
interface SimpleTabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SimpleTabsProps {
  items: SimpleTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

export function SimpleTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  fullWidth = false,
  className,
  listClassName,
  contentClassName,
}: SimpleTabsProps) {
  const initialValue = defaultValue ?? items[0]?.id ?? '';

  return (
    <Tabs
      defaultValue={initialValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList variant={variant} fullWidth={fullWidth} className={listClassName}>
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            variant={variant}
            disabled={item.disabled}
            className={fullWidth ? 'flex-1' : undefined}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id} className={contentClassName}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

SimpleTabs.displayName = 'SimpleTabs';

export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps, SimpleTabsProps, SimpleTabItem };
