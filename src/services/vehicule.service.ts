import { api } from './api';
import type { Vehicule, Option, ImageVehicule, HalResponse, VehiculeFilters } from './types';

const ENDPOINTS = {
  VEHICULES: '/api/vehicules',
  VEHICULES_CUSTOM: '/vehicules',
  OPTIONS: '/api/options',
  CATALOGUE: '/api/catalogue/liste',
};

export const vehiculeService = {
  /**
   * Récupérer tous les véhicules avec pagination (Spring Data REST)
   */
  async getAll(params?: VehiculeFilters): Promise<{ vehicules: Vehicule[]; total: number; totalPages: number }> {
    const response = await api.get<HalResponse<Vehicule>>(ENDPOINTS.VEHICULES, {
      page: params?.page || 0,
      size: params?.size || 20,
      sort: params?.sort || 'idVehicule,asc',
    });

    const embedded = response.data._embedded;
    const vehicules = embedded?.vehicules || [];

    return {
      vehicules,
      total: response.data.page?.totalElements || vehicules.length,
      totalPages: response.data.page?.totalPages || 1,
    };
  },

  /**
   * Récupérer les véhicules via l'endpoint custom (avec Decorator pattern appliqué)
   */
  async getAllCustom(): Promise<Vehicule[]> {
    const response = await api.get<Vehicule[]>(ENDPOINTS.VEHICULES_CUSTOM);
    return response.data;
  },

  /**
   * Récupérer un véhicule par son ID
   */
  async getById(id: number): Promise<Vehicule> {
    const response = await api.get<Vehicule>(`${ENDPOINTS.VEHICULES_CUSTOM}/${id}`);
    return response.data;
  },

  /**
   * Récupérer les images d'un véhicule
   */
  async getImages(vehiculeId: number): Promise<ImageVehicule[]> {
    const response = await api.get<ImageVehicule[]>(`${ENDPOINTS.VEHICULES_CUSTOM}/${vehiculeId}/images`);
    return response.data;
  },

  /**
   * Rechercher des véhicules avec filtres
   */
  async search(filters: VehiculeFilters): Promise<Vehicule[]> {
    // Utiliser l'endpoint catalogue avec le pattern Iterator
    const response = await api.get<Vehicule[]>(ENDPOINTS.CATALOGUE);
    let vehicules = response.data;

    // Appliquer les filtres côté client (le backend pourrait avoir des endpoints de recherche)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      vehicules = vehicules.filter(v =>
        v.nom.toLowerCase().includes(searchLower) ||
        v.marque.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      vehicules = vehicules.filter(v => v.type === filters.type);
    }

    if (filters.engine) {
      vehicules = vehicules.filter(v => v.engine === filters.engine);
    }

    if (filters.marque) {
      vehicules = vehicules.filter(v => v.marque === filters.marque);
    }

    if (filters.solde !== undefined) {
      vehicules = vehicules.filter(v => v.solde === filters.solde);
    }

    if (filters.prixMin !== undefined) {
      vehicules = vehicules.filter(v => v.prixBase >= filters.prixMin!);
    }

    if (filters.prixMax !== undefined) {
      vehicules = vehicules.filter(v => v.prixBase <= filters.prixMax!);
    }

    return vehicules;
  },

  /**
   * Récupérer toutes les options disponibles
   */
  async getOptions(): Promise<Option[]> {
    const response = await api.get<HalResponse<Option>>(ENDPOINTS.OPTIONS);
    return response.data._embedded?.options || [];
  },

  /**
   * Récupérer une option par son ID
   */
  async getOptionById(id: number): Promise<Option> {
    const response = await api.get<Option>(`${ENDPOINTS.OPTIONS}/${id}`);
    return response.data;
  },

  /**
   * Récupérer les véhicules en promotion
   */
  async getPromotions(): Promise<Vehicule[]> {
    const vehicules = await this.getAllCustom();
    return vehicules.filter(v => v.solde);
  },

  /**
   * Récupérer les nouveaux véhicules
   */
  async getNouveaux(): Promise<Vehicule[]> {
    const vehicules = await this.getAllCustom();
    return vehicules.filter(v => v.nouveau);
  },

  /**
   * Récupérer les marques disponibles
   */
  async getMarques(): Promise<string[]> {
    const vehicules = await this.getAllCustom();
    const marques = [...new Set(vehicules.map(v => v.marque))];
    return marques.sort();
  },

  /**
   * Vérifier la compatibilité des options
   */
  verifierCompatibilite(optionId: number, optionsSelectionnees: number[], options: Option[]): boolean {
    const option = options.find(o => o.idOption === optionId);
    if (!option) return false;

    return !(option.optionsIncompatible || []).some(incomp => optionsSelectionnees.includes(incomp.idOption));
  },

  /**
   * Obtenir les options incompatibles
   */
  getOptionsIncompatibles(optionId: number, options: Option[]): number[] {
    const option = options.find(o => o.idOption === optionId);
    return (option?.optionsIncompatible || []).map(o => o.idOption);
  },
};

export default vehiculeService;
