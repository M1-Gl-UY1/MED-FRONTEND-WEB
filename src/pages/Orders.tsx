import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  Loader2,
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Badge, type BadgeVariant } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { commandeService } from '../services/commande.service';
import type { Commande } from '../services/types';

// Formatter le prix
const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

// Formatter une date
const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'Non spécifiée';
  try {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return date;
  }
};

// Labels des statuts (inclut les noms backend)
const getStatutLabel = (statut: string): string => {
  const labels: Record<string, string> = {
    EN_COURS: 'En cours',
    ACTIF: 'Active',
    VALIDEE: 'Validée',
    VALIDE: 'Validée',
    LIVREE: 'Livrée',
    CONVERTI: 'Convertie',
    REFUSE: 'Refusée',
  };
  return labels[statut] || statut;
};

// Couleurs des statuts (inclut les noms backend)
const getStatutColor = (statut: string): string => {
  const colors: Record<string, string> = {
    EN_COURS: 'warning',
    ACTIF: 'warning',
    VALIDEE: 'info',
    VALIDE: 'info',
    LIVREE: 'success',
    CONVERTI: 'success',
    REFUSE: 'error',
  };
  return colors[statut] || 'default';
};

// Labels des méthodes de paiement (inclut les noms backend)
const getMethodePaiementLabel = (methode: string): string => {
  const labels: Record<string, string> = {
    CARTE_BANCAIRE: 'Carte bancaire',
    PAYPAL: 'PayPal',
    COMPTANT: 'Comptant',
    CREDIT: 'Crédit',
  };
  return labels[methode] || methode || 'Non spécifié';
};

// Labels des pays
const getPaysLabel = (code: string): string => {
  const labels: Record<string, string> = {
    CM: 'Cameroun',
    FR: 'France',
    US: 'États-Unis',
    NG: 'Nigeria',
  };
  return labels[code] || code || 'Non spécifié';
};

const ITEMS_PER_PAGE = 5;

export default function Orders() {
  const navigate = useNavigate();
  const { user, isAuthenticated, getUserId } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [allOrders, setAllOrders] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);
        const orders = await commandeService.getByUserId(getUserId());
        setAllOrders(orders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        setAllOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, getUserId]);

  if (!isAuthenticated || !user) {
    navigate('/connexion');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-content-light">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(allOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = allOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return Clock;
      case 'VALIDEE':
        return CheckCircle;
      case 'LIVREE':
        return Truck;
      default:
        return Package;
    }
  };

  if (allOrders.length === 0) {
    return (
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          <EmptyState
            icon={<Package className="w-8 h-8" />}
            title="Aucune commande"
            description="Vous n'avez pas encore passé de commande. Explorez notre catalogue pour trouver votre véhicule."
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
    <div className="py-6 sm:py-7 md:py-8 lg:py-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-content-light mb-5 md:mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/profil" className="hover:text-secondary">Mon profil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">Mes commandes</span>
        </nav>

        {/* Header with count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 md:mb-7">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
              Mes Commandes
            </h1>
            <p className="text-sm text-content-light mt-1">
              {allOrders.length} commande{allOrders.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-5 lg:space-y-6">
          {paginatedOrders.map(order => {
            const StatusIcon = getStatusIcon(order.statut);
            const statusColor = getStatutColor(order.statut);

            return (
              <div key={order.idCommande || (order as any).id} className="card overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h2 className="font-semibold text-primary text-sm sm:text-base">
                        {order.reference || `CMD-${order.idCommande || (order as any).id}`}
                      </h2>
                      <Badge
                        variant={statusColor as BadgeVariant}
                        icon={<StatusIcon className="w-3 h-3" />}
                      >
                        {getStatutLabel(order.statut) || order.statut}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-content-muted">
                      Commandé le {formatDate(order.date || new Date().toISOString())}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-secondary">
                      {formatPrice(order.total || 0)}
                    </p>
                    <p className="text-xs text-content-muted">TTC</p>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 sm:py-5 space-y-4">
                  {/* Utiliser lignesCommandes du backend */}
                  {(order.lignesCommandes || []).map((ligne: any) => {
                    const vehicule = ligne.vehicule;
                    if (!vehicule) return null;

                    const imageUrl = vehicule.images?.[0]?.url
                      || '/placeholder-car.jpg';
                    const vehiculeNom = `${vehicule.marque || ''} ${vehicule.nom || vehicule.model || ''}`.trim();

                    return (
                      <div key={ligne.idLigneCommande || ligne.id} className="flex gap-3 sm:gap-4">
                        <Link
                          to={`/vehicule/${vehicule.idVehicule}`}
                          className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden flex-shrink-0"
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
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/vehicule/${vehicule.idVehicule}`}
                            className="font-medium text-sm sm:text-base text-primary hover:text-secondary line-clamp-1"
                          >
                            {vehiculeNom || 'Véhicule'}
                          </Link>
                          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
                            {vehicule.model} • Couleur: {ligne.couleur || 'Standard'}
                          </p>
                          <p className="text-xs sm:text-sm text-content-light mt-0.5">
                            Quantité: {ligne.quantite} • {formatPrice(ligne.prixUnitaireHT || 0)} /unité
                          </p>
                          {/* Gérer les deux noms: optionsSelectionnees ou optionsAchetees */}
                          {((ligne.optionsSelectionnees || ligne.optionsAchetees) &&
                            (ligne.optionsSelectionnees || ligne.optionsAchetees).length > 0) && (
                            <p className="text-xs text-content-muted mt-0.5">
                              Options: {(ligne.optionsSelectionnees || ligne.optionsAchetees).map((opt: any) => opt.nom).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Details */}
                <div className="py-4 sm:py-5 border-t border-gray-100 grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-content-muted text-xs sm:text-sm mb-1">Mode de paiement</p>
                    <p className="font-medium text-sm sm:text-base">
                      {getMethodePaiementLabel(order.typePaiement)}
                    </p>
                  </div>
                  <div>
                    <p className="text-content-muted text-xs sm:text-sm mb-1">Livraison</p>
                    <p className="font-medium text-sm sm:text-base">
                      {order.paysLivraison ? getPaysLabel(order.paysLivraison) : 'Non spécifié'}
                    </p>
                    {(order as any).dateLivraison && (
                      <p className="text-xs text-success mt-0.5">
                        Livré le {formatDate((order as any).dateLivraison)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-content-muted text-xs sm:text-sm mb-1">Adresse</p>
                    <p className="font-medium text-sm sm:text-base">
                      {order.adresseLivraison || (order as any).adresse || 'Non spécifiée'}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                {order.liasseDocuments?.documents && order.liasseDocuments.documents.length > 0 && (
                  <div className="pt-4 sm:pt-5 border-t border-gray-100">
                    <p className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {order.liasseDocuments.documents.map(doc => (
                        <Button
                          key={doc.idDocument}
                          variant="outline"
                          size="sm"
                          leftIcon={<Download className="w-3 h-3" />}
                          onClick={() => doc.url && window.open(doc.url, '_blank')}
                        >
                          {doc.type === 'BON_COMMANDE' && 'Bon de commande'}
                          {doc.type === 'CERTIFICAT_CESSION' && 'Certificat de cession'}
                          {doc.type === 'DEMANDE_IMMATRICULATION' && 'Demande immatriculation'}
                          ({doc.format})
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 sm:pt-5 border-t border-gray-100 flex flex-wrap gap-3">
                  {(() => {
                    const lignes = order.lignesCommandes || [];
                    const premierVehicule = lignes[0]?.vehicule;
                    return premierVehicule ? (
                      <Button
                        asChild
                        to={`/vehicule/${premierVehicule.idVehicule}`}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Voir le véhicule
                      </Button>
                    ) : null;
                  })()}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => generateRecuPDF(order)}
                  >
                    Télécharger le reçu
                  </Button>
                  {order.statut === 'LIVREE' && (
                    <Button variant="outline" size="sm">
                      Laisser un avis
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 md:mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper pour obtenir les lignes de commande (gère les deux noms possibles)
const getLignesCommande = (commande: any): any[] => {
  return commande.lignes || commande.lignesCommandes || [];
};

// Helper pour obtenir les options (gère les deux noms possibles)
const getOptions = (ligne: any): any[] => {
  return ligne.optionsSelectionnees || ligne.optionsAchetees || [];
};

// Fonction pour générer le reçu PDF
function generateRecuPDF(commande: Commande) {
  const jspdfWindow = window as any;
  const jsPDF = jspdfWindow.jspdf?.jsPDF;

  if (!jsPDF) {
    // Charger jsPDF dynamiquement
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => generateRecuPDFContent(commande);
    document.head.appendChild(script);
  } else {
    generateRecuPDFContent(commande);
  }
}

function generateRecuPDFContent(commande: Commande) {
  const jspdfWindow = window as any;
  const jsPDF = jspdfWindow.jspdf.jsPDF;
  const doc = new jsPDF();

  const reference = commande.reference || `CMD-${commande.idCommande}`;
  const montant = commande.total || 0;
  const date = commande.date || new Date().toISOString();
  const lignes = getLignesCommande(commande);

  // Formatter le prix pour le PDF
  const formatPricePDF = (price: number): string => {
    const value = price || 0;
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Mrd XAF`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M XAF`;
    }
    return new Intl.NumberFormat('fr-FR').format(value) + ' XAF';
  };

  // En-tête avec couleur de fond
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(201, 162, 39);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MED Auto', 20, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("L'Excellence Automobile", 20, 30);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REÇU DE COMMANDE', 20, 40);
  doc.setFontSize(10);
  doc.text(`N° ${reference}`, 190, 40, { align: 'right' });

  // Informations de la commande
  let y = 60;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de la commande', 20, y);

  y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  // Grille d'informations
  const infoStartX = 20;
  const infoValueX = 70;

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', infoStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(date), infoValueX, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Référence:', infoStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(reference, infoValueX, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Statut:', infoStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getStatutLabel(commande.statut), infoValueX, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Paiement:', infoStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getMethodePaiementLabel(commande.typePaiement), infoValueX, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Livraison:', infoStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getPaysLabel(commande.paysLivraison), infoValueX, y);

  if (commande.adresseLivraison || (commande as any).adresse) {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Adresse:', infoStartX, y);
    doc.setFont('helvetica', 'normal');
    const adresse = commande.adresseLivraison || (commande as any).adresse;
    doc.text(adresse.substring(0, 60), infoValueX, y);
  }

  // Tableau des articles
  y += 18;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Articles commandés', 20, y);

  y += 8;
  doc.setFillColor(26, 26, 46);
  doc.rect(20, y, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Véhicule', 25, y + 7);
  doc.text('Qté', 125, y + 7);
  doc.text('Prix Unit.', 145, y + 7);
  doc.text('Total', 175, y + 7);

  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  let subtotal = 0;
  lignes.forEach((ligne: any) => {
    const vehicule = ligne.vehicule;
    const nom = vehicule
      ? `${vehicule.marque || ''} ${vehicule.nom || vehicule.model || ''}`.trim()
      : 'Véhicule';
    const prix = ligne.prixUnitaireHT || vehicule?.prixBase || 0;
    const qte = ligne.quantite || 1;
    const total = prix * qte;
    subtotal += total;

    y += 8;
    doc.text(nom.substring(0, 45), 25, y);
    doc.text(qte.toString(), 130, y);
    doc.text(formatPricePDF(prix), 145, y);
    doc.text(formatPricePDF(total), 175, y);

    // Options si présentes
    const options = getOptions(ligne);
    if (options.length > 0) {
      y += 5;
      doc.setFontSize(7);
      doc.setTextColor(108, 117, 125);
      doc.text(`  Options: ${options.map((o: any) => o.nom).join(', ')}`, 25, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
    }
  });

  // Totaux
  y += 15;
  const taxe = (commande as any).taxe || (montant - subtotal) || (subtotal * 0.1925);

  doc.setFillColor(248, 249, 250);
  doc.rect(120, y, 70, 8, 'F');
  doc.text('Sous-total HT', 125, y + 6);
  doc.text(formatPricePDF(subtotal), 185, y + 6, { align: 'right' });

  y += 8;
  doc.rect(120, y, 70, 8, 'F');
  const tauxTva = commande.paysLivraison === 'FR' ? '20%' : commande.paysLivraison === 'US' ? '8%' : commande.paysLivraison === 'NG' ? '7.5%' : '19.25%';
  doc.text(`TVA (${tauxTva})`, 125, y + 6);
  doc.text(formatPricePDF(taxe), 185, y + 6, { align: 'right' });

  y += 8;
  doc.setFillColor(201, 162, 39);
  doc.rect(120, y, 70, 12, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', 125, y + 8);
  doc.text(formatPricePDF(montant), 185, y + 8, { align: 'right' });

  // Message de remerciement
  y += 25;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 46);
  doc.text('Merci pour votre commande !', 105, y, { align: 'center' });
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(108, 117, 125);
  doc.text('Pour toute question concernant votre commande, contactez-nous.', 105, y, { align: 'center' });

  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(108, 117, 125);
  doc.text('MED Auto - 123 Avenue de l\'Indépendance, Douala, Cameroun', 105, 275, { align: 'center' });
  doc.text('+237 699 000 000 | contact@med-auto.cm', 105, 280, { align: 'center' });
  doc.text('www.med-auto.cm', 105, 285, { align: 'center' });

  doc.save(`Recu_${reference}.pdf`);
}
