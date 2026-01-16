import { api } from './api';
import type { Panier, LignePanier, AjouterPanierDTO, HalResponse } from './types';

const ENDPOINTS = {
  PANIERS: '/api/paniers',
  LIGNE_PANIERS: '/api/lignePaniers',
};

export const panierService = {
  /**
   * Récupérer le panier actif de l'utilisateur
   */
  async getPanierActif(utilisateurId: number): Promise<Panier | null> {
    try {
      const response = await api.get<HalResponse<Panier>>(ENDPOINTS.PANIERS, {
        utilisateurId,
        statut: 'ACTIF',
      });
      const paniers = response.data._embedded?.paniers || [];
      return paniers.length > 0 ? paniers[0] : null;
    } catch {
      return null;
    }
  },

  /**
   * Créer un nouveau panier
   */
  async creer(utilisateurId: number): Promise<Panier> {
    const response = await api.post<Panier>(ENDPOINTS.PANIERS, {
      utilisateur: `/api/utilisateurs/${utilisateurId}`,
      statut: 'ACTIF',
      dateCreation: new Date().toISOString(),
    });
    return response.data;
  },

  /**
   * Ajouter une ligne au panier
   */
  async ajouterLigne(panierId: number, data: AjouterPanierDTO): Promise<LignePanier> {
    const response = await api.post<LignePanier>(ENDPOINTS.LIGNE_PANIERS, {
      panier: `/api/paniers/${panierId}`,
      vehicule: `/api/vehicules/${data.vehiculeId}`,
      quantite: data.quantite,
      optionsSelectionnees: data.optionIds.map(id => `/api/options/${id}`),
      couleurSelectionnee: data.couleur,
    });
    return response.data;
  },

  /**
   * Mettre à jour la quantité d'une ligne
   */
  async updateQuantite(ligneId: number, quantite: number): Promise<LignePanier> {
    const response = await api.patch<LignePanier>(`${ENDPOINTS.LIGNE_PANIERS}/${ligneId}`, {
      quantite,
    });
    return response.data;
  },

  /**
   * Supprimer une ligne du panier
   */
  async supprimerLigne(ligneId: number): Promise<void> {
    await api.delete(`${ENDPOINTS.LIGNE_PANIERS}/${ligneId}`);
  },

  /**
   * Vider le panier
   */
  async vider(panierId: number): Promise<void> {
    // Récupérer toutes les lignes du panier
    const response = await api.get<HalResponse<LignePanier>>(ENDPOINTS.LIGNE_PANIERS, {
      panierId,
    });
    const lignes = response.data._embedded?.lignePaniers || [];

    // Supprimer chaque ligne
    await Promise.all(lignes.map(ligne => this.supprimerLigne(ligne.idLignePanier)));
  },

  /**
   * Convertir le panier en commande (change le statut)
   */
  async convertir(panierId: number): Promise<Panier> {
    const response = await api.patch<Panier>(`${ENDPOINTS.PANIERS}/${panierId}`, {
      statut: 'CONVERTI',
    });
    return response.data;
  },
};

export default panierService;
