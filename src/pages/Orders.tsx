import { useState } from 'react';
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
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Badge, type BadgeVariant } from '../components/ui/Badge';
import {
  getCommandesByUserId,
  getVehiculeById,
  formatPrice,
  formatDate,
  getStatutLabel,
  getStatutColor,
  getMethodePaiementLabel,
  getPaysLabel,
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 5;

export default function Orders() {
  const navigate = useNavigate();
  const { user, isAuthenticated, getUserId } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  if (!isAuthenticated || !user) {
    navigate('/connexion');
    return null;
  }

  const allOrders = getCommandesByUserId(getUserId());

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
              <div key={order.id} className="card overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h2 className="font-semibold text-primary text-sm sm:text-base">
                        {order.reference}
                      </h2>
                      <Badge
                        variant={statusColor as BadgeVariant}
                        icon={<StatusIcon className="w-3 h-3" />}
                      >
                        {getStatutLabel(order.statut)}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-content-muted">
                      Commandé le {formatDate(order.dateCommande)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-secondary">
                      {formatPrice(order.montantTTC)}
                    </p>
                    <p className="text-xs text-content-muted">TTC</p>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 sm:py-5 space-y-4">
                  {order.lignes.map(ligne => {
                    const vehicle = getVehiculeById(ligne.vehiculeId);
                    if (!vehicle) return null;

                    return (
                      <div key={ligne.id} className="flex gap-3 sm:gap-4">
                        <Link
                          to={`/vehicule/${vehicle.id}`}
                          className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={vehicle.image}
                            alt={vehicle.nom}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/vehicule/${vehicle.id}`}
                            className="font-medium text-sm sm:text-base text-primary hover:text-secondary line-clamp-1"
                          >
                            {vehicle.marque} {vehicle.nom}
                          </Link>
                          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
                            {vehicle.modele} • Couleur: {ligne.couleur}
                          </p>
                          <p className="text-xs sm:text-sm text-content-light mt-0.5">
                            Quantité: {ligne.quantite} • {formatPrice(ligne.prixUnitaireHT)} /unité
                          </p>
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
                      {getMethodePaiementLabel(order.methodePaiement)}
                    </p>
                  </div>
                  <div>
                    <p className="text-content-muted text-xs sm:text-sm mb-1">Livraison</p>
                    <p className="font-medium text-sm sm:text-base">
                      {getPaysLabel(order.paysLivraison)}
                    </p>
                    {order.dateLivraison && (
                      <p className="text-xs text-success mt-0.5">
                        Livré le {formatDate(order.dateLivraison)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-content-muted text-xs sm:text-sm mb-1">Adresse</p>
                    <p className="font-medium text-sm sm:text-base">{order.adresseLivraison}</p>
                  </div>
                </div>

                {/* Documents */}
                {order.documents.length > 0 && (
                  <div className="pt-4 sm:pt-5 border-t border-gray-100">
                    <p className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {order.documents.map(doc => (
                        <Button
                          key={doc.id}
                          variant="outline"
                          size="sm"
                          leftIcon={<Download className="w-3 h-3" />}
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
                  <Button
                    asChild
                    to={`/vehicule/${order.lignes[0]?.vehiculeId}`}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    Voir le véhicule
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
