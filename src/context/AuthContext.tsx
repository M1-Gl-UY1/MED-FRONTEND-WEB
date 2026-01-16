import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { UtilisateurComplet, RegisterClientDTO, RegisterSocieteDTO } from '../services/types';
// Fallback sur mock data si API indisponible
import { authentifier as mockAuthentifier, clients, societes } from '../data/mockData';
import type { Utilisateur as MockUtilisateur } from '../data/mockData';

type Utilisateur = UtilisateurComplet | MockUtilisateur;

// Helper pour obtenir l'ID utilisateur (different entre API et mock)
export function getUserId(user: Utilisateur): number {
  // Mock data uses 'id'
  if ('id' in user) {
    return user.id;
  }
  // API data uses 'idClient' or 'idSociete' or 'idUtilisateur'
  if ('idUtilisateur' in user && (user as any).idUtilisateur) {
    return (user as any).idUtilisateur;
  }
  if (user.type === 'CLIENT' && 'idClient' in user) {
    return user.idClient;
  }
  if (user.type === 'SOCIETE' && 'idSociete' in user) {
    return user.idSociete;
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
        // D'abord essayer de valider le token avec l'API
        const validatedUser = await authService.validateToken();
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          // Pas de token valide, verifier le stockage local (mock)
          const storedUser = authService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch {
        // API indisponible, fallback sur le stockage local
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
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
      // Essayer l'API d'abord
      const utilisateur = await authService.login({ email, motDePasse });
      setUser(utilisateur);
      return true;
    } catch (apiError) {
      console.warn('API indisponible, utilisation des donnees mock', apiError);

      // Fallback sur les donnees mock
      try {
        const mockUser = mockAuthentifier(email, motDePasse);
        if (mockUser) {
          setUser(mockUser);
          localStorage.setItem('med_user', JSON.stringify(mockUser));
          return true;
        }
        setError('Email ou mot de passe incorrect');
        return false;
      } catch {
        setError('Erreur lors de la connexion');
        return false;
      }
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
    } catch (apiError) {
      console.warn('API indisponible, creation locale', apiError);

      // Fallback local
      const emailExists = [...clients, ...societes].some(u => u.email === userData.email);
      if (emailExists) {
        setError('Cet email est deja utilise');
        return false;
      }

      // Simulation locale
      const newUser = {
        ...userData,
        id: Date.now(),
        type,
        dateInscription: new Date().toISOString().split('T')[0],
      } as MockUtilisateur;

      setUser(newUser);
      localStorage.setItem('med_user', JSON.stringify(newUser));
      return true;
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
