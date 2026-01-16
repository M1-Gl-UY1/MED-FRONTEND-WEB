import VehicleCard from '../ui/VehicleCard';
import { SectionHeader, SectionMobileAction } from '../ui/SectionHeader';
import type { Vehicule } from '../../services/types';

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
  loading?: boolean;
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
  loading = false,
}: VehiclesGridSectionProps) {
  // Ne pas afficher la section si pas de véhicules et pas en chargement
  if (!loading && vehicles.length === 0) {
    return null;
  }

  return (
    <section className={`${bgClasses[background]} py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20`}>
      <div className="container">
        <SectionHeader
          label={label}
          title={title}
          subtitle={subtitle}
          action={action}
        />

        {/* Loading State */}
        {loading ? (
          <div className={`grid ${columnClasses[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-7`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vehicles Grid */
          <div className={`grid ${columnClasses[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-7`}>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.idVehicule} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Mobile Link */}
        {action && !loading && vehicles.length > 0 && (
          <SectionMobileAction label={action.label} href={action.href} />
        )}
      </div>
    </section>
  );
}

VehiclesGridSection.displayName = 'VehiclesGridSection';

export type { VehiclesGridSectionProps };
