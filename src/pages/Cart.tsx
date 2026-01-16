import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/ui/EmptyState';
import FilterSelect from '../components/ui/FilterSelect';
import Pagination from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCart, type PaysLivraison } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 5;

// Taux de TVA par pays (en pourcentage pour affichage)
const TAUX_TVA_DISPLAY: Record<PaysLivraison, number> = {
  CM: 19.25,
  FR: 20,
  US: 8,
  NG: 7.5,
};

// Labels des pays
const PAYS_LABELS: Record<PaysLivraison, string> = {
  CM: 'Cameroun',
  FR: 'France',
  US: 'États-Unis',
  NG: 'Nigeria',
};

// Formatter le prix
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    taxes,
    total,
    paysLivraison,
    isLoading,
    removeFromCart,
    updateQuantity,
    setPaysLivraison,
  } = useCart();
  const [currentPage, setCurrentPage] = useState(1);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/connexion?redirect=/commande');
    } else {
      navigate('/commande');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-content-light">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="container py-12">
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8" />}
            title="Votre panier est vide"
            description="Parcourez notre catalogue pour trouver le véhicule de vos rêves."
            action={{
              label: 'Voir le catalogue',
              href: '/catalogue',
            }}
          />
        </div>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-6 sm:py-7 md:py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-content-light mb-5 md:mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">Panier</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-primary mb-5 sm:mb-6 md:mb-7">
          Mon Panier ({itemCount} article{itemCount > 1 ? 's' : ''})
        </h1>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {paginatedItems.map(item => {
                const vehicule = item.vehicule;
                // Gestion des différentes structures d'image possibles
                const imageUrl = vehicule.images?.[0]?.url
                  || (typeof vehicule.images?.[0] === 'string' ? vehicule.images[0] : null)
                  || '/placeholder-car.jpg';
                const vehiculeNom = `${vehicule.marque} ${vehicule.nom}`;
                const stockQty = vehicule.stock?.quantite || 0;

                return (
                  <article key={item.id} className="card">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/vehicule/${vehicule.idVehicule}`}
                        className="w-24 h-18 sm:w-32 sm:h-24 md:w-36 md:h-28 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={imageUrl}
                          alt={vehiculeNom}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                          }}
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Link
                              to={`/vehicule/${vehicule.idVehicule}`}
                              className="font-semibold text-primary hover:text-secondary text-sm sm:text-base line-clamp-1"
                            >
                              {vehiculeNom}
                            </Link>
                            <p className="text-xs sm:text-sm text-content-light">
                              Couleur: {item.couleurSelectionnee}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-9 h-9 flex items-center justify-center text-content-muted hover:text-error hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Supprimer du panier"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Selected Options */}
                        {item.optionsSelectionnees.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-content-muted mb-1.5">Options:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.optionsSelectionnees.map(opt => (
                                <Badge key={opt.idOption} variant="neutral" size="sm">
                                  {opt.nom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price & Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <QuantitySelector
                            value={item.quantite}
                            onChange={qty => updateQuantity(item.id, qty)}
                            max={stockQty}
                          />
                          <div className="text-right min-w-0">
                            <p className="text-[10px] sm:text-xs text-content-muted truncate">
                              {formatPrice(item.prixUnitaire + item.prixOptions)} x {item.quantite}
                            </p>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-secondary">
                              {formatPrice(item.sousTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card lg:sticky lg:top-[88px]">
              <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
                Récapitulatif
              </h2>

              {/* Delivery Country */}
              <div className="mb-5">
                <label className="text-sm font-medium text-content-light mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pays de livraison
                </label>
                <FilterSelect
                  value={paysLivraison}
                  onChange={value => setPaysLivraison(value as PaysLivraison)}
                  options={[
                    { value: 'CM', label: 'Cameroun' },
                    { value: 'FR', label: 'France' },
                    { value: 'US', label: 'États-Unis' },
                    { value: 'NG', label: 'Nigeria' },
                  ]}
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-b border-gray-100">
                <div className="flex justify-between items-start gap-2 text-xs sm:text-sm">
                  <span className="text-content-light flex-shrink-0">Sous-total HT</span>
                  <span className="font-medium text-right">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-start gap-2 text-xs sm:text-sm">
                  <span className="text-content-light flex-shrink-0 text-[10px] sm:text-sm">
                    TVA ({TAUX_TVA_DISPLAY[paysLivraison]}%)
                  </span>
                  <span className="font-medium text-right">{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                  <span className="text-content-light">Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 mb-4 gap-2">
                <span className="font-semibold text-primary text-sm sm:text-base">Total TTC</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-secondary text-right">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {isAuthenticated ? 'Passer la commande' : 'Se connecter pour commander'}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-content-muted text-center mt-3">
                  Vous devez être connecté pour passer commande
                </p>
              )}

              {/* Info Box */}
              <div className="mt-4 p-3 sm:p-4 bg-info/10 rounded-lg">
                <p className="text-xs sm:text-sm text-info flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Les prix affichés incluent toutes les options sélectionnées.
                    La livraison est gratuite pour le {PAYS_LABELS[paysLivraison]}.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
