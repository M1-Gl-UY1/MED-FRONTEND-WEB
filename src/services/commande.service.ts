import { api } from './api';
import type {
  Commande,
  CreateCommandeDTO,
  HalResponse,
  PaysLivraison,
  StatutCommande,
  Document
} from './types';

const ENDPOINTS = {
  COMMANDES: '/api/commandes',
  CREER: '/api/commandes/creer',
  EXECUTER: (id: number) => `/api/commandes/${id}/executer`,
  ANNULER: (id: number) => `/api/commandes/${id}/annuler`,
  TOTAL: (id: number, pays: string) => `/api/commandes/${id}/total/${pays}`,
  DOCUMENTS: '/api/documents',
  LIASSE: (commandeId: number) => `/api/documents/liasse/${commandeId}`,
};

// Taux de TVA par pays
export const TAUX_TVA: Record<PaysLivraison, number> = {
  CM: 19.25,
  FR: 20,
  US: 8,
  NG: 7.5,
};

export const commandeService = {
  /**
   * Récupérer toutes les commandes
   */
  async getAll(): Promise<Commande[]> {
    const response = await api.get<HalResponse<Commande>>(ENDPOINTS.COMMANDES);
    return response.data._embedded?.commandes || [];
  },

  /**
   * Récupérer une commande par son ID
   */
  async getById(id: number): Promise<Commande> {
    const response = await api.get<Commande>(`${ENDPOINTS.COMMANDES}/${id}`);
    return response.data;
  },

  /**
   * Récupérer les commandes d'un utilisateur
   */
  async getByUserId(userId: number): Promise<Commande[]> {
    try {
      // Utiliser l'endpoint dédié
      const response = await api.get<Commande[]>(`${ENDPOINTS.COMMANDES}/utilisateur/${userId}`);
      return response.data || [];
    } catch {
      // Fallback: récupérer toutes les commandes et filtrer côté client
      console.warn('Endpoint utilisateur non disponible, récupération de toutes les commandes');
      const allResponse = await api.get<Commande[]>(ENDPOINTS.COMMANDES);
      const allCommandes = allResponse.data || [];
      return allCommandes.filter(c =>
        c.utilisateur?.idUtilisateur === userId
      );
    }
  },

  /**
   * Créer une nouvelle commande (utilise Factory Method pattern)
   */
  async creer(data: CreateCommandeDTO): Promise<Commande> {
    const response = await api.post<Commande>(ENDPOINTS.CREER, data);
    return response.data;
  },

  /**
   * Exécuter une commande (utilise Command pattern)
   */
  async executer(id: number): Promise<Commande> {
    const response = await api.post<Commande>(ENDPOINTS.EXECUTER(id));
    return response.data;
  },

  /**
   * Annuler une commande (utilise Command pattern)
   */
  async annuler(id: number): Promise<Commande> {
    const response = await api.post<Commande>(ENDPOINTS.ANNULER(id));
    return response.data;
  },

  /**
   * Calculer le total d'une commande pour un pays (utilise Template Method pattern)
   */
  async calculerTotal(id: number, pays: PaysLivraison): Promise<number> {
    const response = await api.get<{ total: number }>(ENDPOINTS.TOTAL(id, pays));
    return response.data.total;
  },

  /**
   * Générer la liasse documentaire (utilise Builder + Singleton patterns)
   */
  async genererLiasse(commandeId: number): Promise<Document[]> {
    const response = await api.post<Document[]>(ENDPOINTS.LIASSE(commandeId));
    return response.data;
  },

  /**
   * Récupérer les documents d'une commande
   */
  async getDocuments(commandeId: number): Promise<Document[]> {
    const response = await api.get<Document[]>(`${ENDPOINTS.DOCUMENTS}?commandeId=${commandeId}`);
    return response.data;
  },

  /**
   * Calculer les taxes localement
   */
  calculerTaxes(montantHT: number, pays: PaysLivraison): number {
    return montantHT * (TAUX_TVA[pays] / 100);
  },

  /**
   * Obtenir le libellé d'un statut
   */
  getStatutLabel(statut: StatutCommande): string {
    const labels: Record<StatutCommande, string> = {
      EN_COURS: 'En cours',
      VALIDEE: 'Validée',
      LIVREE: 'Livrée',
    };
    return labels[statut];
  },

  /**
   * Obtenir la couleur d'un statut (pour les badges)
   */
  getStatutColor(statut: StatutCommande): 'warning' | 'info' | 'success' {
    const colors: Record<StatutCommande, 'warning' | 'info' | 'success'> = {
      EN_COURS: 'warning',
      VALIDEE: 'info',
      LIVREE: 'success',
    };
    return colors[statut];
  },

  /**
   * Obtenir le libellé d'un pays
   */
  getPaysLabel(pays: PaysLivraison): string {
    const labels: Record<PaysLivraison, string> = {
      CM: 'Cameroun',
      FR: 'France',
      US: 'États-Unis',
      NG: 'Nigeria',
    };
    return labels[pays];
  },
};

export default commandeService;
