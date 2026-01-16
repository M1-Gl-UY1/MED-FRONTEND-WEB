import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  ShoppingCart,
  Check,
  AlertCircle,
  Fuel,
  Zap,
  Gauge,
  Calendar,
  Settings,
  Loader2,
} from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import {
  Button,
  Badge,
  Breadcrumb,
  PriceDisplay,
  SpecCard,
  SpecGrid,
  Alert,
} from '../components/ui';
import { vehiculeService } from '../services';
import type { Vehicule, Option } from '../services/types';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

// Fonctions utilitaires
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const calculerPrixVehicule = (vehicle: Vehicule): number => {
  if (vehicle.solde && vehicle.facteurReduction && vehicle.facteurReduction > 0) {
    return vehicle.prixBase * (1 - vehicle.facteurReduction);
  }
  return vehicle.prixBase;
};

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [vehicle, setVehicle] = useState<Vehicule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Charger le véhicule depuis l'API
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await vehiculeService.getById(Number(id));
        setVehicle(data);
        // Initialiser la couleur sélectionnée
        if (data.couleurs && data.couleurs.length > 0) {
          setSelectedColor(data.couleurs[0]);
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement du véhicule:', err);
        setError(err.message || 'Véhicule non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-content-light">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !vehicle) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="container text-center py-12">
          <h1 className="text-xl sm:text-2xl font-bold text-primary mb-3">
            Véhicule non trouvé
          </h1>
          <p className="text-content-light mb-6 max-w-md mx-auto">
            Le véhicule que vous recherchez n'existe pas ou a été retiré du catalogue.
          </p>
          <Button asChild to="/catalogue">
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const prixBase = calculerPrixVehicule(vehicle);
  const hasDiscount = vehicle.solde && vehicle.facteurReduction && vehicle.facteurReduction > 0;

  // Available options for this vehicle (depuis le backend)
  const availableOptions: Option[] = vehicle.options || [];

  // Group options by category
  const optionsByCategory = availableOptions.reduce((acc, opt) => {
    if (!acc[opt.categorie]) acc[opt.categorie] = [];
    acc[opt.categorie].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  const categoryLabels: Record<string, string> = {
    INTERIEUR: 'Intérieur',
    EXTERIEUR: 'Extérieur',
    PERFORMANCE: 'Performance',
    TECHNOLOGIE: 'Technologie',
  };

  // Helper to get option by ID
  const getOptionById = (optId: number): Option | undefined => {
    return availableOptions.find(o => o.idOption === optId);
  };

  // Calculate total price
  const totalOptions = selectedOptions.reduce((sum, optId) => {
    const opt = getOptionById(optId);
    return sum + (opt?.prix || 0);
  }, 0);
  const totalPrice = (prixBase + totalOptions) * quantity;

  // Toggle option selection
  const toggleOption = (optionId: number) => {
    const option = getOptionById(optionId);
    if (!option) return;

    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    } else {
      // Vérifier les incompatibilités
      const incompatibles = (option.incompatibilites || []).filter(id => selectedOptions.includes(id));
      if (incompatibles.length > 0) {
        setSelectedOptions(prev => [
          ...prev.filter(id => !incompatibles.includes(id)),
          optionId,
        ]);
      } else {
        setSelectedOptions(prev => [...prev, optionId]);
      }
    }
  };

  // Check if option is compatible
  const isOptionCompatible = (optionId: number): boolean => {
    if (selectedOptions.includes(optionId)) return true;
    const option = getOptionById(optionId);
    if (!option) return false;
    return !(option.incompatibilites || []).some(id => selectedOptions.includes(id));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const stockQty = vehicle.stock?.quantite || 0;
    if (stockQty < quantity) return;

    // Récupérer les objets Option complets pour les options sélectionnées
    const optionsToAdd = availableOptions.filter(opt => selectedOptions.includes(opt.idOption));

    const success = addToCart(vehicle, quantity, optionsToAdd, selectedColor);
    if (success) {
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 3000);
    }
  };

  // Get images URLs
  const imageUrls = vehicle.images?.map(img => img.url) || [];
  if (imageUrls.length === 0) {
    imageUrls.push('/placeholder-car.jpg');
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-6 sm:py-7 md:py-8 lg:py-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Catalogue', href: '/catalogue' },
            { label: `${vehicle.marque} ${vehicle.nom}` },
          ]}
          className="mb-5 md:mb-6"
        />

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Images Column */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
              <img
                src={imageUrls[selectedImage] || '/placeholder-car.jpg'}
                alt={`${vehicle.marque} ${vehicle.nom}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                }}
              />

              {/* Badges */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                {vehicle.nouveau && (
                  <Badge variant="info">Nouveau</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="error">
                    -{Math.round((vehicle.facteurReduction || 0) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
                <button
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors"
                  aria-label="Partager"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {imageUrls.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                      selectedImage === index
                        ? 'border-secondary'
                        : 'border-transparent hover:border-primary-200'
                    )}
                  >
                    <img
                      src={img}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-7 pb-24 lg:pb-0">
            {/* Title & Price */}
            <div>
              <p className="text-xs sm:text-sm text-content-muted uppercase tracking-wider mb-1">
                {vehicle.marque}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                {vehicle.nom}
              </h1>
              <p className="text-base sm:text-lg text-content-light mb-4">
                {vehicle.model}
              </p>

              {/* Price */}
              <PriceDisplay
                price={prixBase}
                originalPrice={hasDiscount ? vehicle.prixBase : undefined}
                size="xl"
                suffix="Prix de base"
              />
            </div>

            {/* Specs Grid */}
            <SpecGrid columns={3}>
              <SpecCard
                icon={<Calendar className="w-5 h-5" />}
                label="Année"
                value={vehicle.annee}
              />
              <SpecCard
                icon={<Gauge className="w-5 h-5" />}
                label="Puissance"
                value={vehicle.puissance || '-'}
              />
              <SpecCard
                icon={vehicle.engine === 'ELECTRIQUE' ? <Zap className="w-5 h-5" /> : <Fuel className="w-5 h-5" />}
                label="Conso."
                value={vehicle.consommation || '-'}
              />
              <SpecCard
                icon={<Settings className="w-5 h-5" />}
                label="Transmission"
                value={vehicle.transmission || '-'}
              />
              <SpecCard
                icon={<Gauge className="w-5 h-5" />}
                label="0-100 km/h"
                value={vehicle.acceleration || '-'}
              />
              <SpecCard
                icon={<Gauge className="w-5 h-5" />}
                label="Vitesse max"
                value={vehicle.vitesseMax || '-'}
              />
            </SpecGrid>

            {/* Description */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-primary mb-3">
                Description
              </h2>
              <p className="text-sm sm:text-base text-content-light leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Color Selection */}
            {vehicle.couleurs && vehicle.couleurs.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-3">
                  Couleur: <span className="font-normal text-content-light">{selectedColor}</span>
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {vehicle.couleurs.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'h-11 px-4 rounded-lg border-2 text-sm font-medium transition-colors',
                        selectedColor === color
                          ? 'border-secondary bg-secondary-50 text-secondary'
                          : 'border-gray-200 hover:border-primary-200'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {availableOptions.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
                  Options
                </h2>
                <div className="space-y-5 sm:space-y-6">
                  {Object.entries(optionsByCategory).map(([category, opts]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-content-muted mb-3">
                        {categoryLabels[category] || category}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {opts.map(option => {
                          const isSelected = selectedOptions.includes(option.idOption);
                          const isCompatible = isOptionCompatible(option.idOption);
                          const incompatibles = (option.incompatibilites || []).filter(id =>
                            selectedOptions.includes(id)
                          );

                          return (
                            <button
                              key={option.idOption}
                              onClick={() => toggleOption(option.idOption)}
                              className={cn(
                                'w-full flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all text-left gap-3',
                                isSelected
                                  ? 'border-secondary bg-secondary-50'
                                  : !isCompatible
                                  ? 'border-gray-100 bg-gray-50 opacity-60'
                                  : 'border-gray-200 hover:border-primary-200'
                              )}
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5',
                                    isSelected
                                      ? 'bg-secondary text-primary'
                                      : 'border-2 border-gray-300'
                                  )}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm sm:text-base">
                                    {option.nom}
                                  </p>
                                  <p className="text-xs sm:text-sm text-content-light mt-0.5">
                                    {option.description}
                                  </p>
                                  {!isCompatible && incompatibles.length > 0 && (
                                    <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                      <span>
                                        Incompatible avec:{' '}
                                        {incompatibles
                                          .map(id => getOptionById(id)?.nom)
                                          .join(', ')}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-semibold text-secondary text-sm sm:text-base whitespace-nowrap">
                                +{formatPrice(option.prix)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-40 lg:relative lg:shadow-none lg:p-0 lg:pt-6 lg:mt-2 lg:border-t lg:border-gray-100">
              {/* Stock Warning */}
              {vehicle.stock && vehicle.stock.quantite <= 3 && vehicle.stock.quantite > 0 && (
                <Alert variant="warning" className="mb-4">
                  Plus que {vehicle.stock.quantite} en stock
                </Alert>
              )}

              {/* Out of Stock Warning */}
              {(!vehicle.stock || vehicle.stock.quantite === 0) && (
                <Alert variant="error" className="mb-4">
                  Rupture de stock
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs sm:text-sm text-content-muted mb-1.5">Quantité</p>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      max={vehicle.stock?.quantite || 0}
                    />
                  </div>

                  {/* Total */}
                  <div className="flex-1 sm:flex-initial">
                    <p className="text-xs sm:text-sm text-content-muted mb-1">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-secondary">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!vehicle.stock || vehicle.stock.quantite === 0 || isAddedToCart}
                  leftIcon={isAddedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  className={cn(
                    'sm:ml-auto',
                    isAddedToCart && 'bg-success hover:bg-success'
                  )}
                >
                  {isAddedToCart ? 'Ajouté au panier' : 'Ajouter au panier'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
