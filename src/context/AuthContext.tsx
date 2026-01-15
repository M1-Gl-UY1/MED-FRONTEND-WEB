import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Utilisateur } from '../data/mockData';
import { authentifier, clients, societes } from '../data/mockData';

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, motDePasse: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<Utilisateur>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est stocké en localStorage
    const storedUser = localStorage.getItem('med_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('med_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, motDePasse: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));

      const utilisateur = authentifier(email, motDePasse);
      if (utilisateur) {
        setUser(utilisateur);
        localStorage.setItem('med_user', JSON.stringify(utilisateur));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('med_user');
    localStorage.removeItem('med_panier');
  };

  const register = async (userData: Partial<Utilisateur>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));

      // Vérifier si l'email existe déjà
      const emailExists = [...clients, ...societes].some(u => u.email === userData.email);
      if (emailExists) {
        return false;
      }

      // Dans une vraie app, on enverrait les données au backend
      // Ici on simule juste la création
      const newUser = {
        ...userData,
        id: Date.now(),
        dateInscription: new Date().toISOString().split('T')[0],
      } as Utilisateur;

      setUser(newUser);
      localStorage.setItem('med_user', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
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
