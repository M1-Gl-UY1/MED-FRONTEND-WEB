import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  CreditCard,
  Building,
  Check,
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
import {
  Button,
  Breadcrumb,
  Alert,
  SelectionGroup,
  SelectionCard,
  FormField,
  FormTextarea,
} from '../components/ui';
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
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container max-w-2xl">
          <div className="card text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2">
              Commande Confirmée !
            </h1>
            <p className="text-sm sm:text-base text-content-light mb-6 sm:mb-8">
              Votre commande a été enregistrée avec succès.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 sm:p-5 mb-6">
              <p className="text-xs sm:text-sm text-content-muted mb-1">Référence de commande</p>
              <p className="text-lg sm:text-xl font-bold text-primary">{orderReference}</p>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <p className="text-sm text-content-light">
                Un email de confirmation a été envoyé à{' '}
                <span className="font-medium text-primary">{user?.email}</span>
              </p>
              <p className="text-sm text-content-light">
                Vous pouvez suivre votre commande dans votre espace personnel.
              </p>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
              <h3 className="font-semibold text-primary mb-3 sm:mb-4 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Documents disponibles
              </h3>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                  Bon de commande (PDF)
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                  Facture proforma (PDF)
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild to="/mes-commandes">
                Voir mes commandes
              </Button>
              <Button asChild to="/catalogue" variant="outline">
                Continuer mes achats
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-7 md:py-8 lg:py-10">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Panier', href: '/panier' },
            { label: 'Commande' },
          ]}
          className="mb-5 md:mb-6"
        />

        <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-primary mb-5 sm:mb-6 md:mb-7">
          Finaliser ma commande
        </h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-5 sm:mb-6 md:mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full font-semibold text-sm sm:text-base ${
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
                className={`ml-2 sm:ml-3 text-sm font-medium hidden sm:block ${
                  currentStep === step.id ? 'text-primary' : 'text-content-muted'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 sm:w-16 lg:w-20 h-0.5 bg-primary-100 mx-2 sm:mx-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {currentStep === 'livraison' && (
              <form onSubmit={handleSubmitLivraison} className="card">
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-5 sm:mb-6">
                  Informations de livraison
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-content-light mb-2">
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

                  <FormField label="Adresse de livraison" required>
                    <FormTextarea
                      value={adresseLivraison}
                      onChange={e => setAdresseLivraison(e.target.value)}
                      placeholder="Adresse complète..."
                      required
                      rows={4}
                    />
                  </FormField>

                  <Alert variant="info">
                    La livraison est gratuite. Le délai estimé est de 2 à 4 semaines
                    selon la destination.
                  </Alert>
                </div>

                <div className="flex justify-end mt-6 sm:mt-8">
                  <Button type="submit" rightIcon={<ChevronRight className="w-5 h-5" />}>
                    Continuer vers le paiement
                  </Button>
                </div>
              </form>
            )}

            {currentStep === 'paiement' && (
              <form onSubmit={handleSubmitPaiement} className="card">
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-5 sm:mb-6">
                  Mode de paiement
                </h2>

                <SelectionGroup
                  name="paiement"
                  value={methodePaiement}
                  onChange={value => setMethodePaiement(value as MethodePaiement)}
                >
                  <SelectionCard
                    value="CARTE_BANCAIRE"
                    title={getMethodePaiementLabel('CARTE_BANCAIRE')}
                    description="Paiement sécurisé par carte Visa, Mastercard"
                    rightIcon={<CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />}
                  />
                  <SelectionCard
                    value="PAYPAL"
                    title={getMethodePaiementLabel('PAYPAL')}
                    description="Paiement via votre compte PayPal"
                  />
                  <SelectionCard
                    value="COMPTANT"
                    title={getMethodePaiementLabel('COMPTANT')}
                    description="Paiement intégral à la livraison"
                  />
                  <SelectionCard
                    value="CREDIT"
                    title={getMethodePaiementLabel('CREDIT')}
                    description="Financement en plusieurs mensualités"
                    rightIcon={<Building className="w-5 h-5 sm:w-6 sm:h-6" />}
                  />
                </SelectionGroup>

                {methodePaiement === 'CREDIT' && (
                  <Alert variant="warning" className="mt-4">
                    Une demande de crédit nécessite une étude de dossier.
                    Vous serez contacté par notre service financier.
                  </Alert>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep('livraison')}
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    rightIcon={!isProcessing ? <Check className="w-5 h-5" /> : undefined}
                  >
                    {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card lg:sticky lg:top-[88px]">
              <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
                Récapitulatif
              </h2>

              <div className="space-y-3 sm:space-y-4 py-4 border-b border-gray-100">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.vehiculeImage}
                      alt={item.vehiculeNom}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.vehiculeNom}
                      </p>
                      <p className="text-xs text-content-muted mt-0.5">
                        Qté: {item.quantite}
                      </p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0">
                      {formatPrice(item.sousTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 sm:space-y-3 py-4 border-b border-gray-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-light">Sous-total HT</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-light">
                    TVA ({tauxTVA[paysLivraison]}%)
                  </span>
                  <span className="font-medium">{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-light">Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="font-semibold text-primary">Total TTC</span>
                <span className="text-xl sm:text-2xl font-bold text-secondary">
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
