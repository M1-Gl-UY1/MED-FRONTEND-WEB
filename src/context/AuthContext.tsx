import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { UtilisateurComplet, RegisterClientDTO, RegisterSocieteDTO } from '../services/types';

type Utilisateur = UtilisateurComplet;

// Helper pour obtenir l'ID utilisateur
export function getUserId(user: Utilisateur): number {
  if ('idUtilisateur' in user && user.idUtilisateur) {
    return user.idUtilisateur;
  }
  if ('id' in user) {
    return (user as any).id;
  }
  return 0;
}

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, motDePasse: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterClientDTO | RegisterSocieteDTO, type: 'CLIENT' | 'SOCIETE') => Promise<boolean>;
  updateProfile: (data: Partial<UtilisateurComplet>) => Promise<boolean>;
  clearError: () => void;
  getUserId: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Valider le token au montage
  useEffect(() => {
    const validateAndLoadUser = async () => {
      try {
        const validatedUser = await authService.validateToken();
        if (validatedUser) {
          setUser(validatedUser);
        }
      } catch (err) {
        // Token invalide ou serveur indisponible - l'utilisateur devra se reconnecter
        console.warn('Validation du token echouee:', err);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateAndLoadUser();
  }, []);

  const login = useCallback(async (email: string, motDePasse: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const utilisateur = await authService.login({ email, motDePasse });
      setUser(utilisateur);
      return true;
    } catch (apiError: any) {
      console.error('Erreur de connexion:', apiError);
      if (apiError.message?.includes('Network') || apiError.message?.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Veuillez verifier votre connexion internet.');
      } else if (apiError.response?.status === 401 || apiError.response?.status === 403) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(apiError.message || 'Erreur lors de la connexion. Veuillez reessayer.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('med_panier');
    localStorage.removeItem('med_pays_livraison');
  }, []);

  const register = useCallback(async (
    userData: RegisterClientDTO | RegisterSocieteDTO,
    type: 'CLIENT' | 'SOCIETE'
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let utilisateur: UtilisateurComplet;

      if (type === 'CLIENT') {
        utilisateur = await authService.registerClient(userData as RegisterClientDTO);
      } else {
        utilisateur = await authService.registerSociete(userData as RegisterSocieteDTO);
      }

      setUser(utilisateur);
      return true;
    } catch (apiError: any) {
      console.error('Erreur d\'inscription:', apiError);
      if (apiError.message?.includes('Network') || apiError.message?.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Veuillez verifier votre connexion internet.');
      } else if (apiError.response?.status === 409 || apiError.message?.includes('existe')) {
        setError('Cet email est deja utilise');
      } else {
        setError(apiError.message || 'Erreur lors de l\'inscription. Veuillez reessayer.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UtilisateurComplet>): Promise<boolean> => {
    if (!user) {
      setError('Utilisateur non connecte');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(user as UtilisateurComplet, data);
      setUser(updatedUser);
      return true;
    } catch (apiError: any) {
      console.error('Erreur lors de la mise a jour du profil:', apiError);
      setError(apiError.message || 'Erreur lors de la mise a jour du profil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getUserIdValue = useCallback((): number => {
    if (!user) return 0;
    return getUserId(user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        register,
        updateProfile,
        clearError,
        getUserId: getUserIdValue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
