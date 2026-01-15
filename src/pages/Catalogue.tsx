import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';
import VehicleCard from '../components/ui/VehicleCard';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
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
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
            Catalogue de Véhicules
          </h1>
          <p className="text-text-light">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={value => updateFilter('search', value)}
              placeholder="Rechercher par nom, marque ou modèle..."
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4">
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
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden btn-outline flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtres
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-primary-50'
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-primary-50'
              )}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-text-light">Filtres actifs:</span>
            {search && (
              <span className="badge badge-neutral flex items-center gap-1">
                Recherche: {search}
                <button onClick={() => updateFilter('search', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {type && (
              <span className="badge badge-neutral flex items-center gap-1">
                {type === 'AUTOMOBILE' ? 'Automobiles' : 'Scooters'}
                <button onClick={() => updateFilter('type', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {moteur && (
              <span className="badge badge-neutral flex items-center gap-1">
                {moteur === 'ESSENCE' ? 'Essence' : 'Électrique'}
                <button onClick={() => updateFilter('moteur', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {marque && (
              <span className="badge badge-neutral flex items-center gap-1">
                {marque}
                <button onClick={() => updateFilter('marque', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {promo && (
              <span className="badge badge-neutral flex items-center gap-1">
                En promotion
                <button onClick={() => updateFilter('promo', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-sm text-secondary hover:text-secondary-500 font-medium"
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
                'grid gap-6',
                viewMode === 'grid'
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
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

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filtres</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
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
              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promo}
                    onChange={e => updateFilter('promo', e.target.checked ? 'true' : '')}
                    className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm font-medium">En promotion uniquement</span>
                </label>
              </div>
            </div>
            <div className="p-4 border-t flex gap-3">
              <button onClick={resetFilters} className="btn-outline flex-1">
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="btn-primary flex-1"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
