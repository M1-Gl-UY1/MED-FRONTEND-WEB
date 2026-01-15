import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/ui/EmptyState';
import FilterSelect from '../components/ui/FilterSelect';
import Pagination from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { PaysLivraison } from '../data/mockData';
import {
  formatPrice,
  getVehiculeById,
  getOptionById,
  getPaysLabel,
  tauxTVA,
} from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 5;

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
                const vehicle = getVehiculeById(item.vehiculeId);
                if (!vehicle) return null;

                return (
                  <article key={item.id} className="card">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/vehicule/${vehicle.id}`}
                        className="w-28 h-20 sm:w-32 sm:h-24 md:w-36 md:h-28 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.vehiculeImage}
                          alt={item.vehiculeNom}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Link
                              to={`/vehicule/${vehicle.id}`}
                              className="font-semibold text-primary hover:text-secondary text-sm sm:text-base line-clamp-1"
                            >
                              {item.vehiculeNom}
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
                              {item.optionsSelectionnees.map(optId => {
                                const opt = getOptionById(optId);
                                return opt ? (
                                  <Badge key={optId} variant="neutral" size="sm">
                                    {opt.nom}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Price & Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <QuantitySelector
                            value={item.quantite}
                            onChange={qty => updateQuantity(item.id, qty)}
                            max={vehicle.stock.quantite}
                          />
                          <div className="text-right">
                            <p className="text-xs sm:text-sm text-content-muted">
                              {formatPrice(item.prixUnitaire + item.prixOptions)} x {item.quantite}
                            </p>
                            <p className="text-lg font-bold text-secondary">
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
                <div className="flex justify-between text-sm">
                  <span className="text-content-light">Sous-total HT</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-content-light">
                    TVA ({tauxTVA[paysLivraison]}% - {getPaysLabel(paysLivraison)})
                  </span>
                  <span className="font-medium">{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-content-light">Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 mb-4">
                <span className="font-semibold text-primary">Total TTC</span>
                <span className="text-2xl font-bold text-secondary">
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
                    La livraison est gratuite pour le {getPaysLabel(paysLivraison)}.
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
