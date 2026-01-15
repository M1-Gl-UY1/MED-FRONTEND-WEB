import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';
import VehicleCard from '../components/ui/VehicleCard';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { Button, Badge, Drawer, CheckboxCard } from '../components/ui';
import { vehicules } from '../data/mockData';
import { cn } from '../lib/utils';

const ITEMS_PER_PAGE = 9;

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Get filters from URL
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const moteur = searchParams.get('moteur') || '';
  const marque = searchParams.get('marque') || '';
  const promo = searchParams.get('promo') === 'true';
  const sort = searchParams.get('sort') || '';

  // Update URL params
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  // Get unique marques
  const marques = useMemo(() => {
    const uniqueMarques = [...new Set(vehicules.map(v => v.marque))];
    return uniqueMarques.map(m => ({ value: m, label: m }));
  }, []);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = [...vehicules];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        v =>
          v.nom.toLowerCase().includes(searchLower) ||
          v.marque.toLowerCase().includes(searchLower) ||
          v.modele.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (type) {
      result = result.filter(v => v.typeVehicule === type);
    }

    // Moteur filter
    if (moteur) {
      result = result.filter(v => v.typeMoteur === moteur);
    }

    // Marque filter
    if (marque) {
      result = result.filter(v => v.marque === marque);
    }

    // Promo filter
    if (promo) {
      result = result.filter(v => v.enPromotion);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.prixBase - b.prixBase);
        break;
      case 'price-desc':
        result.sort((a, b) => b.prixBase - a.prixBase);
        break;
      case 'year-desc':
        result.sort((a, b) => b.annee - a.annee);
        break;
      case 'name-asc':
        result.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      default:
        // Default: nouveaux en premier
        result.sort((a, b) => (b.nouveau ? 1 : 0) - (a.nouveau ? 1 : 0));
    }

    return result;
  }, [search, type, moteur, marque, promo, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Check if any filter is active
  const hasActiveFilters = search || type || moteur || marque || promo;

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
            Catalogue de Véhicules
          </h1>
          <p className="text-sm sm:text-base text-text-light">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={value => updateFilter('search', value)}
                placeholder="Rechercher par nom, marque ou modèle..."
              />
            </div>

            {/* Mobile Filter Button */}
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant="outline"
              leftIcon={<SlidersHorizontal className="w-5 h-5" />}
              className="lg:hidden"
            >
              Filtres
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center ml-1">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Desktop Filters Row */}
          <div className="hidden lg:flex items-center gap-3">
            <FilterSelect
              value={type}
              onChange={value => updateFilter('type', value)}
              placeholder="Type"
              options={[
                { value: 'AUTOMOBILE', label: 'Automobiles' },
                { value: 'SCOOTER', label: 'Scooters' },
              ]}
            />
            <FilterSelect
              value={moteur}
              onChange={value => updateFilter('moteur', value)}
              placeholder="Motorisation"
              options={[
                { value: 'ESSENCE', label: 'Essence' },
                { value: 'ELECTRIQUE', label: 'Électrique' },
              ]}
            />
            <FilterSelect
              value={marque}
              onChange={value => updateFilter('marque', value)}
              placeholder="Marque"
              options={marques}
            />
            <FilterSelect
              value={sort}
              onChange={value => updateFilter('sort', value)}
              placeholder="Trier par"
              options={[
                { value: 'price-asc', label: 'Prix croissant' },
                { value: 'price-desc', label: 'Prix décroissant' },
                { value: 'year-desc', label: 'Plus récents' },
                { value: 'name-asc', label: 'Nom A-Z' },
              ]}
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary-50 text-text-light'
                )}
                aria-label="Vue grille"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary-50 text-text-light'
                )}
                aria-label="Vue liste"
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-text-light">Filtres actifs:</span>
            {search && (
              <Badge variant="neutral" removable onRemove={() => updateFilter('search', '')}>
                Recherche: {search}
              </Badge>
            )}
            {type && (
              <Badge variant="neutral" removable onRemove={() => updateFilter('type', '')}>
                {type === 'AUTOMOBILE' ? 'Automobiles' : 'Scooters'}
              </Badge>
            )}
            {moteur && (
              <Badge variant="neutral" removable onRemove={() => updateFilter('moteur', '')}>
                {moteur === 'ESSENCE' ? 'Essence' : 'Électrique'}
              </Badge>
            )}
            {marque && (
              <Badge variant="neutral" removable onRemove={() => updateFilter('marque', '')}>
                {marque}
              </Badge>
            )}
            {promo && (
              <Badge variant="neutral" removable onRemove={() => updateFilter('promo', '')}>
                En promotion
              </Badge>
            )}
            <button
              onClick={resetFilters}
              className="text-sm text-secondary hover:text-secondary-500 font-medium ml-2"
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* Results */}
        {paginatedVehicles.length > 0 ? (
          <>
            <div
              className={cn(
                'grid gap-4 sm:gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {paginatedVehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<Filter className="w-8 h-8" />}
            title="Aucun véhicule trouvé"
            description="Aucun véhicule ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            action={{
              label: 'Réinitialiser les filtres',
              onClick: resetFilters,
            }}
          />
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtres"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              Réinitialiser
            </Button>
            <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
              Appliquer
            </Button>
          </div>
        }
      >
        <div className="p-4 space-y-5">
          <FilterSelect
            value={type}
            onChange={value => updateFilter('type', value)}
            placeholder="Tous les types"
            label="Type de véhicule"
            options={[
              { value: 'AUTOMOBILE', label: 'Automobiles' },
              { value: 'SCOOTER', label: 'Scooters' },
            ]}
          />
          <FilterSelect
            value={moteur}
            onChange={value => updateFilter('moteur', value)}
            placeholder="Toutes motorisations"
            label="Motorisation"
            options={[
              { value: 'ESSENCE', label: 'Essence' },
              { value: 'ELECTRIQUE', label: 'Électrique' },
            ]}
          />
          <FilterSelect
            value={marque}
            onChange={value => updateFilter('marque', value)}
            placeholder="Toutes les marques"
            label="Marque"
            options={marques}
          />
          <FilterSelect
            value={sort}
            onChange={value => updateFilter('sort', value)}
            placeholder="Par défaut"
            label="Trier par"
            options={[
              { value: 'price-asc', label: 'Prix croissant' },
              { value: 'price-desc', label: 'Prix décroissant' },
              { value: 'year-desc', label: 'Plus récents' },
              { value: 'name-asc', label: 'Nom A-Z' },
            ]}
          />

          {/* Promo Checkbox */}
          <CheckboxCard
            checked={promo}
            onChange={checked => updateFilter('promo', checked ? 'true' : '')}
            title="En promotion uniquement"
            description="Afficher seulement les véhicules en promotion"
          />
        </div>
      </Drawer>
    </div>
  );
}
