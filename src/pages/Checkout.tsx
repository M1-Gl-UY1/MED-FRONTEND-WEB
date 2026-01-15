import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  CreditCard,
  Building,
  Check,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import type { MethodePaiement, PaysLivraison } from '../data/mockData';
import {
  formatPrice,
  getMethodePaiementLabel,
  tauxTVA,
} from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FilterSelect from '../components/ui/FilterSelect';

type CheckoutStep = 'livraison' | 'paiement' | 'confirmation';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    subtotal,
    taxes,
    total,
    paysLivraison,
    setPaysLivraison,
    clearCart,
  } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('livraison');
  const [adresseLivraison, setAdresseLivraison] = useState(
    user?.type === 'CLIENT'
      ? `${user.adresse}, ${user.ville}`
      : user?.type === 'SOCIETE'
      ? `${user.adresse}, ${user.ville}`
      : ''
  );
  const [methodePaiement, setMethodePaiement] = useState<MethodePaiement>('CARTE_BANCAIRE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  // Redirect if not authenticated or empty cart
  if (!isAuthenticated) {
    navigate('/connexion?redirect=/commande');
    return null;
  }

  if (items.length === 0 && !orderComplete) {
    navigate('/panier');
    return null;
  }

  const steps = [
    { id: 'livraison', label: 'Livraison' },
    { id: 'paiement', label: 'Paiement' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  const handleSubmitLivraison = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('paiement');
  };

  const handleSubmitPaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate order reference
    const ref = `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    setOrderReference(ref);
    setOrderComplete(true);
    setCurrentStep('confirmation');
    clearCart();
    setIsProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className="py-16">
        <div className="container max-w-2xl">
          <div className="card text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Commande Confirmée !
            </h1>
            <p className="text-text-light mb-6">
              Votre commande a été enregistrée avec succès.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-text-muted">Référence de commande</p>
              <p className="text-xl font-bold text-primary">{orderReference}</p>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm text-text-light">
                Un email de confirmation a été envoyé à{' '}
                <span className="font-medium text-primary">{user?.email}</span>
              </p>
              <p className="text-sm text-text-light">
                Vous pouvez suivre votre commande dans votre espace personnel.
              </p>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary mb-3 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Documents disponibles
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button className="btn-outline text-sm py-2 px-4">
                  <Download className="w-4 h-4" />
                  Bon de commande (PDF)
                </button>
                <button className="btn-outline text-sm py-2 px-4">
                  <Download className="w-4 h-4" />
                  Facture proforma (PDF)
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/mes-commandes" className="btn-primary">
                Voir mes commandes
              </Link>
              <Link to="/catalogue" className="btn-outline">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/panier" className="hover:text-secondary">Panier</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Commande</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-8">
          Finaliser ma commande
        </h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep === step.id
                    ? 'bg-secondary text-primary'
                    : steps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-success text-white'
                    : 'bg-primary-100 text-primary-400'
                }`}
              >
                {steps.findIndex(s => s.id === currentStep) > index ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden sm:block ${
                  currentStep === step.id ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-12 sm:w-20 h-0.5 bg-primary-100 mx-2 sm:mx-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {currentStep === 'livraison' && (
              <form onSubmit={handleSubmitLivraison} className="card">
                <h2 className="text-lg font-semibold text-primary mb-6">
                  Informations de livraison
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
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

                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Adresse de livraison
                    </label>
                    <textarea
                      value={adresseLivraison}
                      onChange={e => setAdresseLivraison(e.target.value)}
                      className="input min-h-[100px]"
                      placeholder="Adresse complète..."
                      required
                    />
                  </div>

                  <div className="bg-info/10 rounded-lg p-4">
                    <p className="text-sm text-info flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      La livraison est gratuite. Le délai estimé est de 2 à 4 semaines
                      selon la destination.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-primary">
                    Continuer vers le paiement
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === 'paiement' && (
              <form onSubmit={handleSubmitPaiement} className="card">
                <h2 className="text-lg font-semibold text-primary mb-6">
                  Mode de paiement
                </h2>

                <div className="space-y-4">
                  {(['CARTE_BANCAIRE', 'PAYPAL', 'COMPTANT', 'CREDIT'] as MethodePaiement[]).map(
                    method => (
                      <label
                        key={method}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          methodePaiement === method
                            ? 'border-secondary bg-secondary-50'
                            : 'border-gray-200 hover:border-primary-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paiement"
                          value={method}
                          checked={methodePaiement === method}
                          onChange={e =>
                            setMethodePaiement(e.target.value as MethodePaiement)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            methodePaiement === method
                              ? 'border-secondary'
                              : 'border-gray-300'
                          }`}
                        >
                          {methodePaiement === method && (
                            <div className="w-3 h-3 rounded-full bg-secondary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {getMethodePaiementLabel(method)}
                          </p>
                          <p className="text-sm text-text-muted">
                            {method === 'CARTE_BANCAIRE' &&
                              'Paiement sécurisé par carte Visa, Mastercard'}
                            {method === 'PAYPAL' && 'Paiement via votre compte PayPal'}
                            {method === 'COMPTANT' && 'Paiement intégral à la livraison'}
                            {method === 'CREDIT' &&
                              'Financement en plusieurs mensualités'}
                          </p>
                        </div>
                        {method === 'CARTE_BANCAIRE' && (
                          <CreditCard className="w-6 h-6 text-text-muted" />
                        )}
                        {method === 'CREDIT' && (
                          <Building className="w-6 h-6 text-text-muted" />
                        )}
                      </label>
                    )
                  )}

                  {methodePaiement === 'CREDIT' && (
                    <div className="bg-warning/10 rounded-lg p-4">
                      <p className="text-sm text-warning flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        Une demande de crédit nécessite une étude de dossier.
                        Vous serez contacté par notre service financier.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('livraison')}
                    className="btn-ghost"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        Confirmer la commande
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Récapitulatif
              </h2>

              <div className="space-y-3 py-4 border-b">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.vehiculeImage}
                      alt={item.vehiculeNom}
                      className="w-16 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.vehiculeNom}
                      </p>
                      <p className="text-xs text-text-muted">
                        Qté: {item.quantite}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.sousTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-b text-sm">
                <div className="flex justify-between">
                  <span className="text-text-light">Sous-total HT</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">
                    TVA ({tauxTVA[paysLivraison]}%)
                  </span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="font-semibold text-primary">Total TTC</span>
                <span className="text-2xl font-bold text-secondary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
