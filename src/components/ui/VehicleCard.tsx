import { Link } from 'react-router-dom';
import { Fuel, Gauge, Calendar, Zap } from 'lucide-react';
import type { Vehicule } from '../../data/mockData';
import { formatPrice, calculerPrixVehicule } from '../../data/mockData';
import { cn } from '../../lib/utils';

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
      className={cn(
        'card-hover group block overflow-hidden',
        compact ? 'p-0' : 'p-0'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.marque} ${vehicle.nom}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.nouveau && (
            <span className="badge badge-info">
              Nouveau
            </span>
          )}
          {hasDiscount && (
            <span className="badge badge-error">
              -{Math.round(vehicle.facteurReduction * 100)}%
            </span>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'badge',
            vehicle.typeMoteur === 'ELECTRIQUE' ? 'badge-success' : 'badge-neutral'
          )}>
            {vehicle.typeMoteur === 'ELECTRIQUE' ? (
              <><Zap className="w-3 h-3 mr-1" /> Électrique</>
            ) : (
              <><Fuel className="w-3 h-3 mr-1" /> Essence</>
            )}
          </span>
        </div>

        {/* Stock Warning */}
        {vehicle.stock.quantite <= 3 && (
          <div className="absolute bottom-3 left-3">
            <span className="badge badge-warning">
              Plus que {vehicle.stock.quantite} en stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-4', compact && 'p-3')}>
        {/* Brand & Model */}
        <div className="mb-2">
          <p className="text-xs text-text-muted uppercase tracking-wide">
            {vehicle.marque}
          </p>
          <h3 className={cn(
            'font-bold text-primary group-hover:text-secondary transition-colors',
            compact ? 'text-base' : 'text-lg'
          )}>
            {vehicle.nom}
          </h3>
          <p className="text-sm text-text-light">{vehicle.modele}</p>
        </div>

        {/* Specs */}
        {!compact && (
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-text-light">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {vehicle.annee}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {vehicle.caracteristiques.puissance}
            </span>
            <span className="flex items-center gap-1">
              {vehicle.typeMoteur === 'ELECTRIQUE' ? (
                <Zap className="w-3.5 h-3.5" />
              ) : (
                <Fuel className="w-3.5 h-3.5" />
              )}
              {vehicle.caracteristiques.consommation}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            {hasDiscount && (
              <p className="text-sm text-text-muted line-through">
                {formatPrice(vehicle.prixBase)}
              </p>
            )}
            <p className={cn(
              'font-bold text-secondary',
              compact ? 'text-lg' : 'text-xl'
            )}>
              {formatPrice(prixActuel)}
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {vehicle.typeVehicule === 'AUTOMOBILE' ? 'Auto' : 'Scooter'}
          </span>
        </div>
      </div>
    </Link>
  );
}
