import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate, getPaysLabel } from '../data/mockData';
import { cn } from '../lib/utils';
import {
  Button,
  Breadcrumb,
  FormField,
  FormInput,
  CheckboxCard,
} from '../components/ui';

type Tab = 'profile' | 'security' | 'notifications';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated || !user) {
    navigate('/connexion');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Mon profil', icon: User },
    { id: 'security' as Tab, label: 'Sécurité', icon: Shield },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Mon profil' }]}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card mb-4 sm:mb-6">
              <div className="text-center mb-4 sm:mb-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-3">
                  {user.type === 'CLIENT' ? (
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                  ) : (
                    <Building className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                  )}
                </div>
                <h2 className="font-semibold text-primary">
                  {user.type === 'CLIENT' ? `${user.prenom} ${user.nom}` : user.nom}
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  {user.type === 'CLIENT' ? 'Compte particulier' : 'Compte société'}
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-secondary-50 text-secondary'
                        : 'text-text hover:bg-primary-50'
                    )}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <Link
                to="/mes-commandes"
                className="flex items-center justify-between min-h-[44px] py-2 text-sm font-medium text-text hover:text-secondary"
              >
                Mes commandes
                <ChevronRight className="w-5 h-5" />
              </Link>
              <hr className="my-3" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 min-h-[44px] py-2 text-sm font-medium text-error hover:text-error/80 w-full"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary">
                    Informations personnelles
                  </h2>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="ghost"
                    size="sm"
                    leftIcon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  >
                    {isEditing ? 'Enregistrer' : 'Modifier'}
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {user.type === 'CLIENT' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={user.prenom}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={user.nom}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}

                  {user.type === 'SOCIETE' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Raison sociale
                        </label>
                        <input
                          type="text"
                          value={user.nom}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Numéro fiscal
                        </label>
                        <input
                          type="text"
                          value={user.numeroFiscal}
                          disabled
                          className="input bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={user.telephone}
                      disabled={!isEditing}
                      className="input disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Ville
                    </label>
                    <input
                      type="text"
                      value={user.ville}
                      disabled={!isEditing}
                      className="input disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={getPaysLabel(user.pays)}
                      disabled
                      className="input bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={user.adresse}
                      disabled={!isEditing}
                      className="input min-h-[80px] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Membre depuis
                    </label>
                    <input
                      type="text"
                      value={formatDate(user.dateInscription)}
                      disabled
                      className="input bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-5 sm:mb-6">
                  Sécurité du compte
                </h2>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="font-medium text-primary mb-3 sm:mb-4">
                      Changer le mot de passe
                    </h3>
                    <div className="space-y-4">
                      <FormField label="Mot de passe actuel">
                        <FormInput type="password" />
                      </FormField>
                      <FormField label="Nouveau mot de passe">
                        <FormInput type="password" />
                      </FormField>
                      <FormField label="Confirmer le nouveau mot de passe">
                        <FormInput type="password" />
                      </FormField>
                      <Button>
                        Mettre à jour le mot de passe
                      </Button>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h3 className="font-medium text-primary mb-2 sm:mb-3">
                      Authentification à deux facteurs
                    </h3>
                    <p className="text-sm text-text-light mb-4">
                      Ajoutez une couche de sécurité supplémentaire à votre compte.
                    </p>
                    <Button variant="outline">Activer la 2FA</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-base sm:text-lg font-semibold text-primary mb-5 sm:mb-6">
                  Préférences de notification
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <CheckboxCard
                    checked={true}
                    onChange={() => {}}
                    title="Notifications par email"
                    description="Recevoir des notifications par email"
                  />
                  <CheckboxCard
                    checked={true}
                    onChange={() => {}}
                    title="Mises à jour de commande"
                    description="Être notifié du statut de mes commandes"
                  />
                  <CheckboxCard
                    checked={false}
                    onChange={() => {}}
                    title="Offres promotionnelles"
                    description="Recevoir les offres et promotions"
                  />
                  <CheckboxCard
                    checked={false}
                    onChange={() => {}}
                    title="Newsletter"
                    description="Recevoir notre newsletter mensuelle"
                  />
                </div>

                <Button className="mt-6 sm:mt-8">
                  Enregistrer les préférences
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
