import { Link } from 'react-router-dom';
import { Fuel, Gauge, Calendar, Zap } from 'lucide-react';
import type { Vehicule } from '../../services/types';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

// Fonction utilitaire pour formater le prix
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Fonction pour calculer le prix avec réduction
const calculerPrixVehicule = (vehicle: Vehicule): number => {
  if (vehicle.solde && vehicle.facteurReduction && vehicle.facteurReduction > 0) {
    return vehicle.prixBase * (1 - vehicle.facteurReduction);
  }
  return vehicle.prixBase;
};

// Fonction pour obtenir l'URL de l'image principale
const getImageUrl = (vehicle: Vehicule): string => {
  if (vehicle.images && vehicle.images.length > 0) {
    const principale = vehicle.images.find(img => img.estPrincipale);
    return principale?.url || vehicle.images[0]?.url || '/placeholder-car.jpg';
  }
  return '/placeholder-car.jpg';
};

interface VehicleCardProps {
  vehicle: Vehicule;
  compact?: boolean;
}

export default function VehicleCard({ vehicle, compact = false }: VehicleCardProps) {
  const prixActuel = calculerPrixVehicule(vehicle);
  const hasDiscount = vehicle.solde && vehicle.facteurReduction && vehicle.facteurReduction > 0;

  return (
    <Link
      to={`/vehicule/${vehicle.idVehicule}`}
      className="card-hover group block overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(vehicle)}
          alt={`${vehicle.marque} ${vehicle.nom}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
          }}
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.nouveau && (
            <Badge variant="info">Nouveau</Badge>
          )}
          {hasDiscount && (
            <Badge variant="error">
              -{Math.round((vehicle.facteurReduction || 0) * 100)}%
            </Badge>
          )}
        </div>

        {/* Top Right Badge - Motor Type */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={vehicle.engine === 'ELECTRIQUE' ? 'success' : 'neutral'}
            icon={vehicle.engine === 'ELECTRIQUE' ? <Zap className="w-3 h-3" /> : <Fuel className="w-3 h-3" />}
          >
            {vehicle.engine === 'ELECTRIQUE' ? 'Électrique' : 'Essence'}
          </Badge>
        </div>

        {/* Stock Warning */}
        {vehicle.stock && vehicle.stock.quantite <= 3 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning">
              Plus que {vehicle.stock.quantite} en stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-4', compact ? 'sm:p-4' : 'sm:p-5 lg:p-6')}>
        {/* Brand & Model */}
        <div className="mb-2.5 sm:mb-3">
          <p className="text-xs text-content-muted uppercase tracking-wider mb-1">
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
          <p className="text-sm text-content-light mt-1">{vehicle.model}</p>
        </div>

        {/* Specs - Hidden in compact mode */}
        {!compact && (
          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 mb-3 sm:mb-4 text-xs text-content-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-content-muted" />
              {vehicle.annee}
            </span>
            {vehicle.caracteristiques?.puissance && (
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-content-muted" />
                {vehicle.caracteristiques.puissance}
              </span>
            )}
            {vehicle.caracteristiques?.consommation && (
              <span className="flex items-center gap-1.5">
                {vehicle.engine === 'ELECTRIQUE' ? (
                  <Zap className="w-3.5 h-3.5 text-content-muted" />
                ) : (
                  <Fuel className="w-3.5 h-3.5 text-content-muted" />
                )}
                {vehicle.caracteristiques.consommation}
              </span>
            )}
          </div>
        )}

        {/* Price & Type */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-gray-100">
          <div>
            {hasDiscount && (
              <p className="text-sm text-content-muted line-through">
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
          <span className="text-xs text-content-muted pb-1">
            {vehicle.type === 'AUTOMOBILE' ? 'Auto' : 'Scooter'}
          </span>
        </div>
      </div>
    </Link>
  );
}
