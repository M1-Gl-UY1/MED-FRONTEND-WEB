import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Building, ArrowRight, Shield, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import logoMed from '../assets/logo_med.jpeg';
import logoMedSansFond from '../assets/logo_med_sans_fond.png';

type AuthMode = 'login' | 'register';
type UserType = 'CLIENT' | 'SOCIETE';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isLoading } = useAuth();

  const redirect = searchParams.get('redirect') || '/';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [userType, setUserType] = useState<UserType>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [numeroFiscal, setNumeroFiscal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          navigate(redirect);
        } else {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        const userData = userType === 'CLIENT'
          ? {
              type: 'CLIENT' as const,
              nom,
              prenom,
              email,
              telephone,
              motDePasse: password,
              genre: 'M' as const,
              dateNaissance: '1990-01-01',
              adresse: '',
              ville: '',
              pays: 'CM' as const,
            }
          : {
              type: 'SOCIETE' as const,
              nom,
              email,
              telephone,
              numeroFiscal,
              motDePasse: password,
              adresse: '',
              ville: '',
              pays: 'CM' as const,
              societeMereId: null,
            };

        const success = await register(userData, userType);
        if (success) {
          navigate(redirect);
        } else {
          setError('Cet email est déjà utilisé');
        }
      }
    } catch {
      setError('Une erreur est survenue');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Garantie Premium',
      description: 'Tous nos véhicules sont garantis',
    },
    {
      icon: Truck,
      title: 'Livraison Gratuite',
      description: 'Dans tout le Cameroun',
    },
    {
      icon: CreditCard,
      title: 'Financement Flexible',
      description: 'Paiement en plusieurs fois',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)] flex">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
          <div className="absolute bottom-40 right-20 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/20 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoMed}
              alt="MED Auto"
              className="h-14 w-auto object-contain rounded-xl"
            />
            <span className="text-2xl font-bold text-white">MED Auto</span>
          </Link>

          {/* Main Content */}
          <div className="my-auto">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Bienvenue chez
              <span className="text-secondary block mt-2">MED Auto</span>
            </h1>
            <p className="text-xl text-primary-200 leading-relaxed max-w-md">
              Votre partenaire de confiance pour l'achat de véhicules premium au Cameroun.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-primary-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-background">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img
              src={logoMedSansFond}
              alt="MED Auto"
              className="h-14 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-primary">MED Auto</span>
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 lg:p-9">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {mode === 'login' ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-content-light">
                {mode === 'login'
                  ? 'Connectez-vous pour accéder à votre espace'
                  : 'Rejoignez MED Auto dès maintenant'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all',
                  mode === 'login'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-content-muted hover:text-content'
                )}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all',
                  mode === 'register'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-content-muted hover:text-content'
                )}
              >
                Inscription
              </button>
            </div>

            {/* User Type Selection (Register only) */}
            {mode === 'register' && (
              <div className="mb-6">
                <p className="text-sm font-medium text-content mb-3">
                  Type de compte
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('CLIENT')}
                    className={cn(
                      'flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all',
                      userType === 'CLIENT'
                        ? 'border-secondary bg-secondary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      userType === 'CLIENT' ? 'bg-secondary/20' : 'bg-gray-100'
                    )}>
                      <User className={cn(
                        'w-6 h-6',
                        userType === 'CLIENT' ? 'text-secondary' : 'text-gray-500'
                      )} />
                    </div>
                    <span className="font-semibold">Particulier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('SOCIETE')}
                    className={cn(
                      'flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all',
                      userType === 'SOCIETE'
                        ? 'border-secondary bg-secondary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      userType === 'SOCIETE' ? 'bg-secondary/20' : 'bg-gray-100'
                    )}>
                      <Building className={cn(
                        'w-6 h-6',
                        userType === 'SOCIETE' ? 'text-secondary' : 'text-gray-500'
                      )} />
                    </div>
                    <span className="font-semibold">Société</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <>
                  {userType === 'CLIENT' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-content mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={prenom}
                          onChange={e => setPrenom(e.target.value)}
                          className="input"
                          placeholder="Jean"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-content mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={nom}
                          onChange={e => setNom(e.target.value)}
                          className="input"
                          placeholder="Fotso"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {userType === 'SOCIETE' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-content mb-2">
                          Raison sociale
                        </label>
                        <input
                          type="text"
                          value={nom}
                          onChange={e => setNom(e.target.value)}
                          className="input"
                          placeholder="Nom de votre société"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-content mb-2">
                          Numéro fiscal
                        </label>
                        <input
                          type="text"
                          value={numeroFiscal}
                          onChange={e => setNumeroFiscal(e.target.value)}
                          className="input"
                          placeholder="Ex: CM12345678901"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-content mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={e => setTelephone(e.target.value)}
                      className="input"
                      placeholder="+237 6XX XXX XXX"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-content mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pr-12"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-content-muted hover:text-content rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-error/10 text-error text-sm rounded-xl border border-error/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                fullWidth
                size="lg"
                rightIcon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
              >
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Button>
            </form>

            {/* Demo credentials */}
            {mode === 'login' && (
              <div className="mt-8 p-5 bg-primary-50 rounded-xl border border-primary-100">
                <p className="text-sm font-semibold text-primary mb-3">
                  Comptes de démonstration
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-content-light">Particulier</span>
                    <code className="text-xs text-primary bg-primary-50 px-2 py-1 rounded">
                      jean.fotso@email.com
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-content-light">Société</span>
                    <code className="text-xs text-primary bg-primary-50 px-2 py-1 rounded">
                      contact@autofleet-cm.com
                    </code>
                  </div>
                  <p className="text-xs text-content-muted text-center mt-2">
                    Mot de passe : password123 / societe123
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-content-muted mt-6">
            En continuant, vous acceptez nos{' '}
            <Link to="#" className="text-secondary hover:underline">
              Conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link to="#" className="text-secondary hover:underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
