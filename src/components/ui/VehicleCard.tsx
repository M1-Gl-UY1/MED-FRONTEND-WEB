import { Link } from 'react-router-dom';
import { Fuel, Gauge, Calendar, Zap } from 'lucide-react';
import type { Vehicule } from '../../data/mockData';
import { formatPrice, calculerPrixVehicule } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

interface VehicleCardProps {
  vehicle: Vehicule;
  compact?: boolean;
}

export default function VehicleCard({ vehicle, compact = false }: VehicleCardProps) {
  const prixActuel = calculerPrixVehicule(vehicle);
  const hasDiscount = vehicle.enPromotion && vehicle.facteurReduction > 0;

  return (
    <Link
      to={`/vehicule/${vehicle.id}`}
      className="card-hover group block overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.marque} ${vehicle.nom}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.nouveau && (
            <Badge variant="info">Nouveau</Badge>
          )}
          {hasDiscount && (
            <Badge variant="error">
              -{Math.round(vehicle.facteurReduction * 100)}%
            </Badge>
          )}
        </div>

        {/* Top Right Badge - Motor Type */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={vehicle.typeMoteur === 'ELECTRIQUE' ? 'success' : 'neutral'}
            icon={vehicle.typeMoteur === 'ELECTRIQUE' ? <Zap className="w-3 h-3" /> : <Fuel className="w-3 h-3" />}
          >
            {vehicle.typeMoteur === 'ELECTRIQUE' ? 'Électrique' : 'Essence'}
          </Badge>
        </div>

        {/* Stock Warning */}
        {vehicle.stock.quantite <= 3 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning">
              Plus que {vehicle.stock.quantite} en stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-4', compact ? 'sm:p-4' : 'sm:p-5')}>
        {/* Brand & Model */}
        <div className="mb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {vehicle.marque}
          </p>
          <h3
            className={cn(
              'font-bold text-primary group-hover:text-secondary transition-colors leading-snug',
              compact ? 'text-base' : 'text-base sm:text-lg'
            )}
          >
            {vehicle.nom}
          </h3>
          <p className="text-sm text-text-light mt-1">{vehicle.modele}</p>
        </div>

        {/* Specs - Hidden in compact mode */}
        {!compact && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-text-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              {vehicle.annee}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-text-muted" />
              {vehicle.caracteristiques.puissance}
            </span>
            <span className="flex items-center gap-1.5">
              {vehicle.typeMoteur === 'ELECTRIQUE' ? (
                <Zap className="w-3.5 h-3.5 text-text-muted" />
              ) : (
                <Fuel className="w-3.5 h-3.5 text-text-muted" />
              )}
              {vehicle.caracteristiques.consommation}
            </span>
          </div>
        )}

        {/* Price & Type */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-gray-100">
          <div>
            {hasDiscount && (
              <p className="text-sm text-text-muted line-through">
                {formatPrice(vehicle.prixBase)}
              </p>
            )}
            <p
              className={cn(
                'font-bold text-secondary',
                compact ? 'text-lg' : 'text-lg sm:text-xl'
              )}
            >
              {formatPrice(prixActuel)}
            </p>
          </div>
          <span className="text-xs text-text-muted pb-1">
            {vehicle.typeVehicule === 'AUTOMOBILE' ? 'Auto' : 'Scooter'}
          </span>
        </div>
      </div>
    </Link>
  );
}
