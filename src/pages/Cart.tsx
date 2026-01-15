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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/connexion?redirect=/commande');
    } else {
      navigate('/commande');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="container">
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

  return (
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Panier</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-8">
          Mon Panier ({itemCount} article{itemCount > 1 ? 's' : ''})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const vehicle = getVehiculeById(item.vehiculeId);
              if (!vehicle) return null;

              return (
                <div key={item.id} className="card p-4 lg:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      to={`/vehicule/${vehicle.id}`}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.vehiculeImage}
                        alt={item.vehiculeNom}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/vehicule/${vehicle.id}`}
                            className="font-semibold text-primary hover:text-secondary"
                          >
                            {item.vehiculeNom}
                          </Link>
                          <p className="text-sm text-text-light">
                            Couleur: {item.couleurSelectionnee}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-text-muted hover:text-error transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Options */}
                      {item.optionsSelectionnees.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-text-muted mb-1">Options:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.optionsSelectionnees.map(optId => {
                              const opt = getOptionById(optId);
                              return opt ? (
                                <span key={optId} className="badge badge-neutral text-xs">
                                  {opt.nom}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Price & Quantity */}
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <QuantitySelector
                          value={item.quantite}
                          onChange={qty => updateQuantity(item.id, qty)}
                          max={vehicle.stock.quantite}
                        />
                        <div className="text-right">
                          <p className="text-sm text-text-muted">
                            {formatPrice(item.prixUnitaire + item.prixOptions)} x {item.quantite}
                          </p>
                          <p className="text-lg font-bold text-secondary">
                            {formatPrice(item.sousTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Récapitulatif
              </h2>

              {/* Delivery Country */}
              <div className="mb-4">
                <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
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

              <div className="space-y-3 py-4 border-t border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-text-light">Sous-total HT</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-light">
                    TVA ({tauxTVA[paysLivraison]}% - {getPaysLabel(paysLivraison)})
                  </span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-light">Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 mb-4">
                <span className="font-semibold text-primary">Total TTC</span>
                <span className="text-2xl font-bold text-secondary">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full"
              >
                {isAuthenticated ? 'Passer la commande' : 'Se connecter pour commander'}
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-text-muted text-center mt-3">
                  Vous devez être connecté pour passer commande
                </p>
              )}

              <div className="mt-4 p-3 bg-info/10 rounded-lg">
                <p className="text-xs text-info flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Les prix affichés incluent toutes les options sélectionnées.
                  La livraison est gratuite pour le {getPaysLabel(paysLivraison)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
