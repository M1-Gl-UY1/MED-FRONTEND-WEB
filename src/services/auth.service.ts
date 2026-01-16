import { api, removeToken, setStoredUser, getStoredUser } from './api';
import type {
  LoginDTO,
  RegisterClientDTO,
  RegisterSocieteDTO,
  UtilisateurComplet,
  Client,
  Societe
} from './types';

const AUTH_ENDPOINTS = {
  AUTH_CLIENT: '/api/clients/auth',
  AUTH_SOCIETE: '/api/societes/auth',
  REGISTER_CLIENT: '/api/clients',
  REGISTER_SOCIETE: '/api/societes',
};

// Type pour la réponse d'authentification du backend
interface BackendAuthResponse {
  user: Client | Societe;
  type: 'CLIENT' | 'SOCIETE';
  message: string;
}

export const authService = {
  /**
   * Connexion d'un client (particulier)
   */
  async loginClient(credentials: LoginDTO): Promise<UtilisateurComplet> {
    const response = await api.post<BackendAuthResponse>(AUTH_ENDPOINTS.AUTH_CLIENT, credentials);
    const user = response.data.user as Client;
    user.type = 'CLIENT';

    // Stocker l'utilisateur (pas de token JWT pour l'instant dans ce backend)
    setStoredUser(user);

    return user;
  },

  /**
   * Connexion d'une société
   */
  async loginSociete(credentials: LoginDTO): Promise<UtilisateurComplet> {
    const response = await api.post<BackendAuthResponse>(AUTH_ENDPOINTS.AUTH_SOCIETE, credentials);
    const user = response.data.user as Societe;
    user.type = 'SOCIETE';

    setStoredUser(user);

    return user;
  },

  /**
   * Connexion générique (détecte automatiquement le type)
   */
  async login(credentials: LoginDTO): Promise<UtilisateurComplet> {
    try {
      // Essayer d'abord comme client
      return await this.loginClient(credentials);
    } catch {
      // Si ça échoue, essayer comme société
      return await this.loginSociete(credentials);
    }
  },

  /**
   * Inscription d'un nouveau client
   */
  async registerClient(data: RegisterClientDTO): Promise<UtilisateurComplet> {
    // Utiliser l'endpoint Spring Data REST pour créer le client
    const response = await api.post<Client>(AUTH_ENDPOINTS.REGISTER_CLIENT, {
      ...data,
      type: 'CLIENT',
    });

    const user = response.data;
    user.type = 'CLIENT';
    setStoredUser(user);

    return user;
  },

  /**
   * Inscription d'une nouvelle société
   */
  async registerSociete(data: RegisterSocieteDTO): Promise<UtilisateurComplet> {
    const response = await api.post<Societe>(AUTH_ENDPOINTS.REGISTER_SOCIETE, {
      ...data,
      type: 'SOCIETE',
    });

    const user = response.data;
    user.type = 'SOCIETE';
    setStoredUser(user);

    return user;
  },

  /**
   * Déconnexion
   */
  logout(): void {
    removeToken();
  },

  /**
   * Récupérer l'utilisateur connecté depuis le stockage local
   */
  getCurrentUser(): UtilisateurComplet | null {
    return getStoredUser<UtilisateurComplet>();
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  /**
   * Vérifier si l'utilisateur est un client
   */
  isClient(user: UtilisateurComplet): user is Client {
    return user.type === 'CLIENT';
  },

  /**
   * Vérifier si l'utilisateur est une société
   */
  isSociete(user: UtilisateurComplet): user is Societe {
    return user.type === 'SOCIETE';
  },

  /**
   * Mettre à jour le profil d'un client
   */
  async updateClient(id: number, data: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`${AUTH_ENDPOINTS.REGISTER_CLIENT}/${id}`, data);
    const user = response.data;
    user.type = 'CLIENT';
    setStoredUser(user);
    return user;
  },

  /**
   * Mettre à jour le profil d'une société
   */
  async updateSociete(id: number, data: Partial<Societe>): Promise<Societe> {
    const response = await api.put<Societe>(`${AUTH_ENDPOINTS.REGISTER_SOCIETE}/${id}`, data);
    const user = response.data;
    user.type = 'SOCIETE';
    setStoredUser(user);
    return user;
  },

  /**
   * Mettre à jour le profil (générique)
   */
  async updateProfile(user: UtilisateurComplet, data: Partial<Client> | Partial<Societe>): Promise<UtilisateurComplet> {
    // Le backend utilise idUtilisateur, mais le frontend peut avoir idClient ou idSociete
    const getUserId = (u: UtilisateurComplet): number => {
      // Essayer différentes propriétés d'ID
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
