import { api, setToken, removeToken, setStoredUser, getStoredUser, getToken } from './api';
import type {
  LoginDTO,
  RegisterClientDTO,
  RegisterSocieteDTO,
  UtilisateurComplet,
  Client,
  Societe
} from './types';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  AUTH_CLIENT: '/api/clients/auth',
  AUTH_SOCIETE: '/api/societes/auth',
  VALIDATE_TOKEN: '/api/auth/me',
  REFRESH_TOKEN: '/api/auth/refresh',
  REGISTER_CLIENT: '/api/clients',
  REGISTER_SOCIETE: '/api/societes',
};

// Type pour la reponse d'authentification du backend avec JWT
interface BackendAuthResponse {
  token: string;
  user: Client | Societe;
  type: 'CLIENT' | 'SOCIETE';
  message: string;
}

interface ValidateTokenResponse {
  user: Client | Societe;
  type: 'CLIENT' | 'SOCIETE';
}

interface RefreshTokenResponse {
  token: string;
  message: string;
}

export const authService = {
  /**
   * Connexion unifiee (Client ou Societe) via le nouvel endpoint
   */
  async login(credentials: LoginDTO): Promise<UtilisateurComplet> {
    const response = await api.post<BackendAuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    const { token, user, type } = response.data;

    // Stocker le token JWT
    setToken(token);

    // Ajouter le type au user et le stocker
    const typedUser = { ...user, type } as UtilisateurComplet;
    setStoredUser(typedUser);

    return typedUser;
  },

  /**
   * Connexion d'un client (particulier) - fallback
   */
  async loginClient(credentials: LoginDTO): Promise<UtilisateurComplet> {
    const response = await api.post<BackendAuthResponse>(AUTH_ENDPOINTS.AUTH_CLIENT, credentials);
    const { token, user } = response.data;

    setToken(token);
    const typedUser = { ...user, type: 'CLIENT' as const };
    setStoredUser(typedUser);

    return typedUser;
  },

  /**
   * Connexion d'une societe - fallback
   */
  async loginSociete(credentials: LoginDTO): Promise<UtilisateurComplet> {
    const response = await api.post<BackendAuthResponse>(AUTH_ENDPOINTS.AUTH_SOCIETE, credentials);
    const { token, user } = response.data;

    setToken(token);
    const typedUser = { ...user, type: 'SOCIETE' as const };
    setStoredUser(typedUser);

    return typedUser;
  },

  /**
   * Valider le token actuel et recuperer les infos utilisateur
   */
  async validateToken(): Promise<UtilisateurComplet | null> {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await api.get<ValidateTokenResponse>(AUTH_ENDPOINTS.VALIDATE_TOKEN);
      const { user, type } = response.data;
      const typedUser = { ...user, type } as UtilisateurComplet;
      setStoredUser(typedUser);
      return typedUser;
    } catch {
      // Token invalide ou expire
      removeToken();
      return null;
    }
  },

  /**
   * Rafraichir le token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN);
      const { token } = response.data;
      setToken(token);
      return token;
    } catch {
      return null;
    }
  },

  /**
   * Inscription d'un nouveau client
   */
  async registerClient(data: RegisterClientDTO): Promise<UtilisateurComplet> {
    const response = await api.post<Client>(AUTH_ENDPOINTS.REGISTER_CLIENT, {
      ...data,
      type: 'CLIENT',
    });

    const user = response.data;
    user.type = 'CLIENT';

    // Apres inscription, connecter automatiquement
    return this.login({ email: data.email, motDePasse: data.motDePasse });
  },

  /**
   * Inscription d'une nouvelle societe
   */
  async registerSociete(data: RegisterSocieteDTO): Promise<UtilisateurComplet> {
    const response = await api.post<Societe>(AUTH_ENDPOINTS.REGISTER_SOCIETE, {
      ...data,
      type: 'SOCIETE',
    });

    const user = response.data;
    user.type = 'SOCIETE';

    // Apres inscription, connecter automatiquement
    return this.login({ email: data.email, motDePasse: data.motDePasse });
  },

  /**
   * Deconnexion
   */
  logout(): void {
    removeToken();
  },

  /**
   * Recuperer l'utilisateur connecte depuis le stockage local
   */
  getCurrentUser(): UtilisateurComplet | null {
    return getStoredUser<UtilisateurComplet>();
  },

  /**
   * Verifier si l'utilisateur est connecte (a un token)
   */
  isAuthenticated(): boolean {
    return getToken() !== null;
  },

  /**
   * Verifier si l'utilisateur est un client
   */
  isClient(user: UtilisateurComplet): user is Client {
    return user.type === 'CLIENT';
  },

  /**
   * Verifier si l'utilisateur est une societe
   */
  isSociete(user: UtilisateurComplet): user is Societe {
    return user.type === 'SOCIETE';
  },

  /**
   * Mettre a jour le profil d'un client
   */
  async updateClient(id: number, data: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`${AUTH_ENDPOINTS.REGISTER_CLIENT}/${id}`, data);
    const user = response.data;
    user.type = 'CLIENT';
    setStoredUser(user);
    return user;
  },

  /**
   * Mettre a jour le profil d'une societe
   */
  async updateSociete(id: number, data: Partial<Societe>): Promise<Societe> {
    const response = await api.put<Societe>(`${AUTH_ENDPOINTS.REGISTER_SOCIETE}/${id}`, data);
    const user = response.data;
    user.type = 'SOCIETE';
    setStoredUser(user);
    return user;
  },

  /**
   * Mettre a jour le profil (generique)
   */
  async updateProfile(user: UtilisateurComplet, data: Partial<Client> | Partial<Societe>): Promise<UtilisateurComplet> {
    const getUserId = (u: UtilisateurComplet): number => {
      if ('idClient' in u && u.idClient) return u.idClient;
      if ('idSociete' in u && u.idSociete) return u.idSociete;
      if ('idUtilisateur' in u && (u as any).idUtilisateur) return (u as any).idUtilisateur;
      if ('id' in u && (u as any).id) return (u as any).id;
      throw new Error('Impossible de trouver l\'ID utilisateur');
    };

    const userId = getUserId(user);

    if (user.type === 'CLIENT') {
      return this.updateClient(userId, data as Partial<Client>);
    } else {
      return this.updateSociete(userId, data as Partial<Societe>);
    }
  },
};

export default authService;
