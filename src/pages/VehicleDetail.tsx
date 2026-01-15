import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import {
  getVehiculeById,
  getOptionById,
  options,
  formatPrice,
  calculerPrixVehicule,
  verifierCompatibiliteOptions,
  getOptionsIncompatibles,
} from '../data/mockData';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const vehicle = useMemo(() => getVehiculeById(Number(id)), [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(vehicle?.couleurs[0] || '');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  if (!vehicle) {
    return (
      <div className="py-16">
        <div className="container text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Véhicule non trouvé</h1>
          <p className="text-text-light mb-6">
            Le véhicule que vous recherchez n'existe pas ou a été retiré du catalogue.
          </p>
          <Link to="/catalogue" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const prixBase = calculerPrixVehicule(vehicle);
  const hasDiscount = vehicle.enPromotion && vehicle.facteurReduction > 0;

  // Available options for this vehicle
  const availableOptions = options.filter(opt => vehicle.options.includes(opt.id));

  // Group options by category
  const optionsByCategory = availableOptions.reduce((acc, opt) => {
    if (!acc[opt.categorie]) acc[opt.categorie] = [];
    acc[opt.categorie].push(opt);
    return acc;
  }, {} as Record<string, typeof options>);

  const categoryLabels: Record<string, string> = {
    INTERIEUR: 'Intérieur',
    EXTERIEUR: 'Extérieur',
    PERFORMANCE: 'Performance',
    TECHNOLOGIE: 'Technologie',
  };

  // Calculate total price
  const totalOptions = selectedOptions.reduce((sum, id) => {
    const opt = getOptionById(id);
    return sum + (opt?.prix || 0);
  }, 0);
  const totalPrice = (prixBase + totalOptions) * quantity;

  // Toggle option selection
  const toggleOption = (optionId: number) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    } else {
      // Check compatibility - get all incompatible IDs and find which are selected
      const allIncompatibles = getOptionsIncompatibles(optionId);
      const incompatibles = allIncompatibles.filter(id => selectedOptions.includes(id));
      if (incompatibles.length > 0) {
        // Remove incompatible options first
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
    return verifierCompatibiliteOptions(optionId, selectedOptions);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (vehicle.stock.quantite < quantity) return;

    const success = addToCart(vehicle.id, quantity, selectedOptions, selectedColor);
    if (success) {
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 3000);
    }
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/catalogue" className="hover:text-secondary">Catalogue</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">{vehicle.marque} {vehicle.nom}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <img
                src={vehicle.images[selectedImage]}
                alt={`${vehicle.marque} ${vehicle.nom}`}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {vehicle.nouveau && (
                  <span className="badge badge-info">Nouveau</span>
                )}
                {hasDiscount && (
                  <span className="badge badge-error">
                    -{Math.round(vehicle.facteurReduction * 100)}%
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                      selectedImage === index
                        ? 'border-secondary'
                        : 'border-transparent hover:border-primary-200'
                    )}
                  >
                    <img
                      src={img}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-text-muted uppercase tracking-wide mb-1">
                {vehicle.marque}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                {vehicle.nom}
              </h1>
              <p className="text-lg text-text-light">{vehicle.modele}</p>
            </div>

            {/* Price */}
            <div className="mb-6">
              {hasDiscount && (
                <p className="text-lg text-text-muted line-through">
                  {formatPrice(vehicle.prixBase)}
                </p>
              )}
              <p className="text-3xl font-bold text-secondary">
                {formatPrice(prixBase)}
              </p>
              <p className="text-sm text-text-light">Prix de base</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="card p-3">
                <Calendar className="w-5 h-5 text-secondary mb-2" />
                <p className="text-xs text-text-muted">Année</p>
                <p className="font-semibold">{vehicle.annee}</p>
              </div>
              <div className="card p-3">
                <Gauge className="w-5 h-5 text-secondary mb-2" />
                <p className="text-xs text-text-muted">Puissance</p>
                <p className="font-semibold">{vehicle.caracteristiques.puissance}</p>
              </div>
              <div className="card p-3">
                {vehicle.typeMoteur === 'ELECTRIQUE' ? (
                  <Zap className="w-5 h-5 text-secondary mb-2" />
                ) : (
                  <Fuel className="w-5 h-5 text-secondary mb-2" />
                )}
                <p className="text-xs text-text-muted">Conso.</p>
                <p className="font-semibold">{vehicle.caracteristiques.consommation}</p>
              </div>
              <div className="card p-3">
                <Settings className="w-5 h-5 text-secondary mb-2" />
                <p className="text-xs text-text-muted">Transmission</p>
                <p className="font-semibold text-sm">{vehicle.caracteristiques.transmission}</p>
              </div>
              <div className="card p-3">
                <Gauge className="w-5 h-5 text-secondary mb-2" />
                <p className="text-xs text-text-muted">0-100 km/h</p>
                <p className="font-semibold">{vehicle.caracteristiques.acceleration}</p>
              </div>
              <div className="card p-3">
                <Gauge className="w-5 h-5 text-secondary mb-2" />
                <p className="text-xs text-text-muted">Vitesse max</p>
                <p className="font-semibold">{vehicle.caracteristiques.vitesseMax}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-primary mb-3">Description</h2>
              <p className="text-text-light">{vehicle.description}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-primary mb-3">
                Couleur: <span className="font-normal text-text-light">{selectedColor}</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {vehicle.couleurs.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors',
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

            {/* Options */}
            {availableOptions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-primary mb-4">Options</h2>
                <div className="space-y-6">
                  {Object.entries(optionsByCategory).map(([category, opts]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-text-muted mb-3">
                        {categoryLabels[category] || category}
                      </h3>
                      <div className="space-y-2">
                        {opts.map(option => {
                          const isSelected = selectedOptions.includes(option.id);
                          const isCompatible = isOptionCompatible(option.id);
                          const incompatibles = option.incompatibilites.filter(id =>
                            selectedOptions.includes(id)
                          );

                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleOption(option.id)}
                              className={cn(
                                'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left',
                                isSelected
                                  ? 'border-secondary bg-secondary-50'
                                  : !isCompatible
                                  ? 'border-gray-100 bg-gray-50 opacity-60'
                                  : 'border-gray-200 hover:border-primary-200'
                              )}
                            >
                              <div className="flex items-start gap-3">
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
                                <div>
                                  <p className="font-medium">{option.nom}</p>
                                  <p className="text-sm text-text-light">
                                    {option.description}
                                  </p>
                                  {!isCompatible && incompatibles.length > 0 && (
                                    <p className="text-xs text-error mt-1 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      Incompatible avec:{' '}
                                      {incompatibles
                                        .map(id => getOptionById(id)?.nom)
                                        .join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-semibold text-secondary ml-4">
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

            {/* Quantity & Add to Cart */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-8">
              {/* Stock Warning */}
              {vehicle.stock.quantite <= 3 && (
                <p className="text-sm text-warning mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Plus que {vehicle.stock.quantite} en stock
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Quantité</p>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={vehicle.stock.quantite}
                  />
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <p className="text-sm text-text-muted mb-1">Total</p>
                  <p className="text-2xl font-bold text-secondary">
                    {formatPrice(totalPrice)}
                  </p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={vehicle.stock.quantite === 0 || isAddedToCart}
                  className={cn(
                    'btn-primary w-full sm:w-auto px-8',
                    isAddedToCart && 'bg-success hover:bg-success'
                  )}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Ajouté au panier
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
