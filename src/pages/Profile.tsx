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
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-secondary">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Mon profil</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card mb-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-3">
                  {user.type === 'CLIENT' ? (
                    <User className="w-10 h-10 text-secondary" />
                  ) : (
                    <Building className="w-10 h-10 text-secondary" />
                  )}
                </div>
                <h2 className="font-semibold text-primary">
                  {user.type === 'CLIENT' ? `${user.prenom} ${user.nom}` : user.nom}
                </h2>
                <p className="text-sm text-text-muted">
                  {user.type === 'CLIENT' ? 'Compte particulier' : 'Compte société'}
                </p>
              </div>

              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
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
                className="flex items-center justify-between py-2 text-sm font-medium text-text hover:text-secondary"
              >
                Mes commandes
                <ChevronRight className="w-5 h-5" />
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-sm font-medium text-error hover:text-error/80 w-full"
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-primary">
                    Informations personnelles
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-ghost text-sm py-2 px-4"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Modifier
                      </>
                    )}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
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
                <h2 className="text-lg font-semibold text-primary mb-6">
                  Sécurité du compte
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-primary mb-2">
                      Changer le mot de passe
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Mot de passe actuel
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Nouveau mot de passe
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <button className="btn-primary">
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <h3 className="font-medium text-primary mb-2">
                      Authentification à deux facteurs
                    </h3>
                    <p className="text-sm text-text-light mb-4">
                      Ajoutez une couche de sécurité supplémentaire à votre compte.
                    </p>
                    <button className="btn-outline">Activer la 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-primary mb-6">
                  Préférences de notification
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Notifications par email',
                      description: 'Recevoir des notifications par email',
                      checked: true,
                    },
                    {
                      title: 'Mises à jour de commande',
                      description: 'Être notifié du statut de mes commandes',
                      checked: true,
                    },
                    {
                      title: 'Offres promotionnelles',
                      description: 'Recevoir les offres et promotions',
                      checked: false,
                    },
                    {
                      title: 'Newsletter',
                      description: 'Recevoir notre newsletter mensuelle',
                      checked: false,
                    },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-200 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                    </label>
                  ))}
                </div>

                <button className="btn-primary mt-6">
                  Enregistrer les préférences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
