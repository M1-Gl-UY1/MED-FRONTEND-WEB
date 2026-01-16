// Types correspondants aux entités backend Spring Boot

// Enums
export type TypeMoteur = 'ESSENCE' | 'ELECTRIQUE';
export type TypeVehicule = 'AUTOMOBILE' | 'SCOOTER';
export type StatutCommande = 'ACTIF' | 'CONVERTI' | 'VALIDEE' | 'REFUSEE';
export type PaysLivraison = 'CM' | 'FR' | 'US' | 'NG';
export type TypeDocument = 'DEMANDE_IMMATRICULATION' | 'CERTIFICAT_CESSION' | 'BON_COMMANDE';
export type TypeMethodePaiement = 'CARTE_BANCAIRE' | 'PAYPAL' | 'COMPTANT' | 'CREDIT';
export type StatutPanier = 'ACTIF' | 'CONVERTI' | 'VALIDEE' | 'REFUSEE';
export type TypeUtilisateur = 'CLIENT' | 'SOCIETE' | 'ADMIN';
export type CategorieOption = 'INTERIEUR' | 'EXTERIEUR' | 'PERFORMANCE' | 'TECHNOLOGIE' | 'SECURITE' | 'CONFORT';

// Entités Backend
export interface Option {
  idOption: number;
  nom: string;
  description: string;
  prix: number;
  categorie: CategorieOption;
  optionsIncompatible?: Option[];
}

export interface ImageVehicule {
  idImage: number;
  url: string;
  ordreAffichage: number;
  estPrincipale: boolean;
}

export interface Stock {
  idStock: number;
  quantite: number;
  dateEntre: string;
}

export interface Vehicule {
  idVehicule: number;
  nom: string;
  model: string;
  marque: string;
  annee: number;
  engine: TypeMoteur;
  type: TypeVehicule;
  prixBase: number;
  prixOriginal?: number;  // Prix original si décoré
  description?: string;
  // Caractéristiques techniques (champs directs)
  puissance?: string;
  transmission?: string;
  carburant?: string;
  consommation?: string;
  acceleration?: string;
  vitesseMax?: string;
  couleurs?: string[];
  images: ImageVehicule[];
  stock?: Stock;
  options?: Option[];
  solde: boolean;
  facteurReduction?: number;
  nouveau?: boolean;
  decorated?: boolean;  // Indique si le prix a été modifié par le Decorator
}

export interface Client {
  idUtilisateur: number;
  type?: 'CLIENT';
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  sexe?: 'M' | 'F';
  adresse?: string;
  ville?: string;
  pays?: string;
}

export interface Societe {
  idUtilisateur: number;
  type?: 'SOCIETE';
  nom: string;
  email: string;
  telephone?: string;
  numeroTaxe: string;
  adresse?: string;
  ville?: string;
  pays?: string;
}

export interface Utilisateur {
  idUtilisateur: number;
  email: string;
  nom: string;
  prenom?: string;
  telephone?: string;
  type: TypeUtilisateur;
  dateInscription?: string;
}

export type UtilisateurComplet = Client | Societe;

export interface LignePanier {
  idLignePanier: number;
  vehicule: Vehicule;
  quantite: number;
  optionsSelectionnees: Option[];
  couleurSelectionnee?: string;
}

export interface Panier {
  idPanier: number;
  utilisateur: Utilisateur;
  lignes: LignePanier[];
  statut: StatutPanier;
  dateCreation: string;
}

export interface LigneCommande {
  idLigneCommande: number;
  vehicule: Vehicule;
  quantite: number;
  prixUnitaireHT: number;
  tauxTVA: number;
  optionsAchetees: Option[];
  couleur?: string;
}

export interface Document {
  idDocument: number;
  type: TypeDocument;
  format: 'PDF' | 'HTML';
  url: string;
  dateCreation: string;
}

export interface Commande {
  idCommande: number;
  reference: string;
  utilisateur: Utilisateur;
  statut: StatutCommande | string;
  paysLivraison: PaysLivraison;
  adresseLivraison: string;
  typePaiement: TypeMethodePaiement;
  total: number;
  taxe: number;
  date: string;
  lignesCommandes: LigneCommande[];
  liasseDocuments?: {
    idLiasse: number;
    documents: Document[];
  };
}

// DTOs pour les requêtes
export interface LoginDTO {
  email: string;
  motDePasse: string;
}

export interface RegisterClientDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  dateNaissance?: string;
  sexe?: 'M' | 'F';
  adresse?: string;
  ville?: string;
  pays?: string;
}

export interface RegisterSocieteDTO {
  nom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  numeroTaxe: string;
  adresse?: string;
  ville?: string;
  pays?: string;
}

export interface AuthResponse {
  token?: string;
  user: UtilisateurComplet;
  message?: string;
}

export interface CreateCommandeDTO {
  type: 'comptant' | 'credit';
  paysLivraison: PaysLivraison;
  adresseLivraison: string;
  typePaiement: TypeMethodePaiement;
  lignes: {
    vehiculeId: number;
    quantite: number;
    optionIds: number[];
    couleur?: string;
  }[];
}

export interface AjouterPanierDTO {
  vehiculeId: number;
  quantite: number;
  optionIds: number[];
  couleur?: string;
}

// Réponses paginées (Spring Data REST)
export interface HalLinks {
  self: { href: string };
  first?: { href: string };
  last?: { href: string };
  next?: { href: string };
  prev?: { href: string };
  profile?: { href: string };
}

export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface HalResponse<T> {
  _embedded: {
    [key: string]: T[];
  };
  _links: HalLinks;
  page: PageInfo;
}

// Statistiques Dashboard
export interface DashboardStats {
  totalVentes: number;
  commandesEnCours: number;
  commandesValidees: number;
  commandesLivrees: number;
  ventesParMois: { mois: string; montant: number }[];
  ventesParPays: { pays: PaysLivraison; montant: number }[];
  vehiculesPopulaires: { vehicule: Vehicule; quantiteVendue: number }[];
  stockFaible: Vehicule[];
}

// Filtres de recherche
export interface VehiculeFilters {
  search?: string;
  type?: TypeVehicule;
  engine?: TypeMoteur;
  marque?: string;
  prixMin?: number;
  prixMax?: number;
  solde?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
