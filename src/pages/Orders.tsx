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
import { cn } from '../lib/utils';

export default function Orders() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    navigate('/connexion');
    return null;
  }

  const orders = getCommandesByUserId(user.id);

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

  if (orders.length === 0) {
    return (
      <div className="py-16">
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
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/profil" className="hover:text-secondary">Mon profil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Mes commandes</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-8">
          Mes Commandes
        </h1>

        <div className="space-y-6">
          {orders.map(order => {
            const StatusIcon = getStatusIcon(order.statut);
            const statusColor = getStatutColor(order.statut);

            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-semibold text-primary">
                        {order.reference}
                      </h2>
                      <span className={cn('badge', `badge-${statusColor}`)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatutLabel(order.statut)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">
                      Commandé le {formatDate(order.dateCommande)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">
                      {formatPrice(order.montantTTC)}
                    </p>
                    <p className="text-xs text-text-muted">TTC</p>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 space-y-4">
                  {order.lignes.map(ligne => {
                    const vehicle = getVehiculeById(ligne.vehiculeId);
                    if (!vehicle) return null;

                    return (
                      <div key={ligne.id} className="flex gap-4">
                        <Link
                          to={`/vehicule/${vehicle.id}`}
                          className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0"
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
                            className="font-medium text-primary hover:text-secondary"
                          >
                            {vehicle.marque} {vehicle.nom}
                          </Link>
                          <p className="text-sm text-text-muted">
                            {vehicle.modele} • Couleur: {ligne.couleur}
                          </p>
                          <p className="text-sm text-text-light">
                            Quantité: {ligne.quantite} • {formatPrice(ligne.prixUnitaireHT)} /unité
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Details */}
                <div className="py-4 border-t grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted mb-1">Mode de paiement</p>
                    <p className="font-medium">
                      {getMethodePaiementLabel(order.methodePaiement)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-1">Livraison</p>
                    <p className="font-medium">
                      {getPaysLabel(order.paysLivraison)}
                    </p>
                    {order.dateLivraison && (
                      <p className="text-xs text-success">
                        Livré le {formatDate(order.dateLivraison)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-text-muted mb-1">Adresse</p>
                    <p className="font-medium">{order.adresseLivraison}</p>
                  </div>
                </div>

                {/* Documents */}
                {order.documents.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.documents.map(doc => (
                        <button
                          key={doc.id}
                          className="btn-outline text-xs py-2 px-3"
                        >
                          <Download className="w-3 h-3" />
                          {doc.type === 'BON_COMMANDE' && 'Bon de commande'}
                          {doc.type === 'CERTIFICAT_CESSION' && 'Certificat de cession'}
                          {doc.type === 'DEMANDE_IMMATRICULATION' && 'Demande immatriculation'}
                          ({doc.format})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t flex flex-wrap gap-3">
                  <Link
                    to={`/vehicule/${order.lignes[0]?.vehiculeId}`}
                    className="btn-ghost text-sm py-2 px-4"
                  >
                    <Eye className="w-4 h-4" />
                    Voir le véhicule
                  </Link>
                  {order.statut === 'LIVREE' && (
                    <button className="btn-outline text-sm py-2 px-4">
                      Laisser un avis
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
