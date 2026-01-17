import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatage des prix en Franc CFA
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

// Formatage des dates
export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatDateShort = (date: string): string =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Types pour les pays et statuts
export type PaysLivraison = 'CM' | 'FR' | 'US' | 'NG';
export type StatutCommande = 'EN_COURS' | 'VALIDEE' | 'LIVREE' | 'ACTIF' | 'CONVERTI' | 'REFUSEE';
export type MethodePaiement = 'CARTE_BANCAIRE' | 'PAYPAL' | 'COMPTANT' | 'CREDIT';

// Taux de TVA par pays
export const tauxTVA: Record<PaysLivraison, number> = {
  CM: 19.25,
  FR: 20,
  US: 8,
  NG: 7.5,
};

// Labels pour les pays
export const getPaysLabel = (code: PaysLivraison): string => {
  const labels: Record<PaysLivraison, string> = {
    CM: 'Cameroun',
    FR: 'France',
    US: 'États-Unis',
    NG: 'Nigeria',
  };
  return labels[code];
};

// Labels pour les statuts de commande
export const getStatutLabel = (statut: StatutCommande): string => {
  const labels: Record<StatutCommande, string> = {
    EN_COURS: 'En cours',
    VALIDEE: 'Validée',
    LIVREE: 'Livrée',
    ACTIF: 'En cours',
    CONVERTI: 'Convertie',
    REFUSEE: 'Refusée',
  };
  return labels[statut];
};

// Couleurs pour les statuts de commande
export const getStatutColor = (statut: StatutCommande): string => {
  const colors: Record<StatutCommande, string> = {
    EN_COURS: 'warning',
    VALIDEE: 'info',
    LIVREE: 'success',
    ACTIF: 'warning',
    CONVERTI: 'info',
    REFUSEE: 'error',
  };
  return colors[statut];
};

// Labels pour les méthodes de paiement
export const getMethodePaiementLabel = (methode: MethodePaiement): string => {
  const labels: Record<MethodePaiement, string> = {
    CARTE_BANCAIRE: 'Carte bancaire',
    PAYPAL: 'PayPal',
    COMPTANT: 'Comptant',
    CREDIT: 'Crédit',
  };
  return labels[methode];
};

// Calcul des taxes
export const calculerTaxes = (montantHT: number, pays: PaysLivraison): number => {
  return montantHT * (tauxTVA[pays] / 100);
};
