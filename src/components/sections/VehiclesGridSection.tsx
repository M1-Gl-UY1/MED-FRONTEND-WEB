import VehicleCard from '../ui/VehicleCard';
import { SectionHeader, SectionMobileAction } from '../ui/SectionHeader';
import type { Vehicule } from '../../data/mockData';

interface VehiclesGridSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  vehicles: Vehicule[];
  action?: {
    label: string;
    href: string;
  };
  columns?: 2 | 3 | 4;
  background?: 'white' | 'gray';
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-background',
} as const;

export function VehiclesGridSection({
  label,
  title,
  subtitle,
  vehicles,
  action,
  columns = 4,
  background = 'gray',
}: VehiclesGridSectionProps) {
  return (
    <section className={`${bgClasses[background]} py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20`}>
      <div className="container">
        <SectionHeader
          label={label}
          title={title}
          subtitle={subtitle}
          action={action}
        />

        {/* Vehicles Grid */}
        <div className={`grid ${columnClasses[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-7`}>
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Mobile Link */}
        {action && <SectionMobileAction label={action.label} href={action.href} />}
      </div>
    </section>
  );
}

VehiclesGridSection.displayName = 'VehiclesGridSection';

export type { VehiclesGridSectionProps };
