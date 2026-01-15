// Core UI Components
export { Button, buttonVariants } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Badge, badgeVariants } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { Card, CardHeader, CardContent, CardFooter, CardImage, cardVariants } from './Card';
export type { CardProps, CardVariant, CardPadding, CardRadius, CardHeaderProps, CardFooterProps, CardImageProps } from './Card';

export { Input, Textarea, InputGroup, inputVariants } from './Input';
export type { InputProps, TextareaProps, InputSize } from './Input';

export { OptimizedImage, BackgroundImage } from './OptimizedImage';
export type { OptimizedImageProps, BackgroundImageProps, AspectRatio } from './OptimizedImage';

export { SectionHeader, SectionMobileAction } from './SectionHeader';
export type { SectionHeaderProps, SectionMobileActionProps } from './SectionHeader';

// Navigation & Feedback
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

export { Alert } from './Alert';
export type { AlertProps, AlertVariant } from './Alert';

// Forms
export { FormField, FormInput, FormTextarea, FormSelect, FormGroup } from './FormField';
export type { FormFieldProps, FormInputProps, FormTextareaProps, FormSelectProps, FormGroupProps } from './FormField';

// Pricing
export { PriceDisplay, PriceBreakdown } from './PriceDisplay';
export type { PriceDisplayProps, PriceBreakdownProps, PriceBreakdownItem } from './PriceDisplay';

// Specs & Features
export { SpecCard, SpecGrid, FeatureCard, InfoItem } from './SpecCard';
export type { SpecCardProps, SpecGridProps, FeatureCardProps, InfoItemProps } from './SpecCard';

// Overlays
export { Modal, Drawer } from './Modal';
export type { ModalProps, DrawerProps } from './Modal';

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent, SimpleTabs } from './Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps, SimpleTabsProps, SimpleTabItem } from './Tabs';

// Selection
export { SelectionGroup, SelectionCard, CheckboxCard, OptionCard } from './SelectionCard';
export type { SelectionGroupProps, SelectionCardProps, CheckboxCardProps, OptionCardProps } from './SelectionCard';

// Existing Components
export { default as VehicleCard } from './VehicleCard';
export { default as EmptyState } from './EmptyState';
export { default as FilterSelect } from './FilterSelect';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Pagination } from './Pagination';
export { default as QuantitySelector } from './QuantitySelector';
export { default as SearchBar } from './SearchBar';
