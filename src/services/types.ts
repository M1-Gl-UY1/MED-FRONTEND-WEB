// Types correspondants aux entités backend Spring Boot

// Enums
export type TypeMoteur = 'ESSENCE' | 'ELECTRIQUE';
export type TypeVehicule = 'AUTOMOBILE' | 'SCOOTER';
export type StatutCommande = 'EN_COURS' | 'VALIDEE' | 'LIVREE';
export type PaysLivraison = 'CM' | 'FR' | 'US' | 'NG';
export type TypeDocument = 'DEMANDE_IMMATRICULATION' | 'CERTIFICAT_CESSION' | 'BON_COMMANDE';
export type MethodePaiement = 'CARTE_BANCAIRE' | 'PAYPAL' | 'COMPTANT' | 'CREDIT';
export type StatutPanier = 'ACTIF' | 'CONVERTI' | 'VALIDE' | 'REFUSE';
export type TypeUtilisateur = 'CLIENT' | 'SOCIETE' | 'ADMIN';

// Entités Backend
export interface Option {
  idOption: number;
  nom: string;
  description: string;
  prix: number;
  categorie: 'INTERIEUR' | 'EXTERIEUR' | 'PERFORMANCE' | 'TECHNOLOGIE';
  incompatibilites: number[];
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
  dateEntree: string;
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
  description?: string;
  caracteristiques?: {
    puissance: string;
    transmission: string;
    carburant: string;
    consommation: string;
    acceleration: string;
    vitesseMax: string;
  };
  couleurs?: string[];
  images: ImageVehicule[];
  stock?: Stock;
  options?: Option[];
  solde: boolean;
  facteurReduction?: number;
  nouveau?: boolean;
}

export interface Client {
  idClient?: number;
  idUtilisateur?: number;  // ID backend (utilisateur parent)
  type: 'CLIENT';
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  genre?: 'M' | 'F';
  sexe?: string;  // Alias backend
  adresse?: string;
  ville?: string;
  pays?: PaysLivraison;
  dateInscription?: string;
}

export interface Societe {
  idSociete?: number;
  idUtilisateur?: number;  // ID backend (utilisateur parent)
  type: 'SOCIETE';
  nom: string;
  email: string;
  telephone?: string;
  numeroFiscal?: string;
  numeroTaxe?: string;  // Alias backend
  adresse?: string;
  ville?: string;
  pays?: PaysLivraison;
  societeMereId?: number | null;
  dateInscription?: string;
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
  optionsSelectionnees: Option[];
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
  statut: StatutCommande;
  paysLivraison: PaysLivraison;
  adresseLivraison: string;
  methodePaiement: MethodePaiement;
  montantHT: number;
  taxes: number;
  montantTTC: number;
  dateCommande: string;
  dateLivraison?: string | null;
  lignes: LigneCommande[];
  documents: Document[];
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
  genre?: 'M' | 'F';
  adresse?: string;
  ville?: string;
  pays?: PaysLivraison;
}

export interface RegisterSocieteDTO {
  nom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  numeroFiscal: string;
  adresse?: string;
  ville?: string;
  pays?: PaysLivraison;
  societeMereId?: number | null;
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
  methodePaiement: MethodePaiement;
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
