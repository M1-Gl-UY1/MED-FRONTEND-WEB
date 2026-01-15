import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Car, Eye, EyeOff, User, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

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

        const success = await register(userData);
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

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Car className="w-7 h-7 text-secondary" />
          </div>
          <span className="text-2xl font-bold text-primary">MED Motors</span>
        </Link>

        <div className="card">
          {/* Mode Toggle */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
                mode === 'login'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-text-muted hover:text-text'
              )}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
                mode === 'register'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-text-muted hover:text-text'
              )}
            >
              Inscription
            </button>
          </div>

          {/* User Type Selection (Register only) */}
          {mode === 'register' && (
            <div className="mb-6">
              <p className="text-sm font-medium text-text-light mb-3">
                Type de compte
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('CLIENT')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                    userType === 'CLIENT'
                      ? 'border-secondary bg-secondary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  )}
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium">Particulier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('SOCIETE')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                    userType === 'SOCIETE'
                      ? 'border-secondary bg-secondary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  )}
                >
                  <Building className="w-6 h-6" />
                  <span className="text-sm font-medium">Société</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {userType === 'CLIENT' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={nom}
                        onChange={e => setNom(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                )}

                {userType === 'SOCIETE' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-1">
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
                      <label className="block text-sm font-medium text-text-light mb-1">
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
                  <label className="block text-sm font-medium text-text-light mb-1">
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
              <label className="block text-sm font-medium text-text-light mb-1">
                Email
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
              <label className="block text-sm font-medium text-text-light mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
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
              <div className="p-3 bg-error/10 text-error text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-xs font-medium text-primary mb-2">
                Comptes de démonstration :
              </p>
              <div className="text-xs text-text-light space-y-1">
                <p>
                  <span className="font-medium">Particulier:</span>{' '}
                  jean.fotso@email.com / password123
                </p>
                <p>
                  <span className="font-medium">Société:</span>{' '}
                  contact@autofleet-cm.com / societe123
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
