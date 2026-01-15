// Types
export type TypeMoteur = 'ESSENCE' | 'ELECTRIQUE';
export type TypeVehicule = 'AUTOMOBILE' | 'SCOOTER';
export type StatutCommande = 'EN_COURS' | 'VALIDEE' | 'LIVREE';
export type PaysLivraison = 'CM' | 'FR' | 'US' | 'NG';
export type TypeDocument = 'DEMANDE_IMMATRICULATION' | 'CERTIFICAT_CESSION' | 'BON_COMMANDE';
export type MethodePaiement = 'CARTE_BANCAIRE' | 'PAYPAL' | 'COMPTANT' | 'CREDIT';
export type StatutPanier = 'ACTIF' | 'CONVERTI' | 'VALIDE' | 'REFUSE';

export interface Option {
  id: number;
  nom: string;
  description: string;
  prix: number;
  categorie: 'INTERIEUR' | 'EXTERIEUR' | 'PERFORMANCE' | 'TECHNOLOGIE';
  incompatibilites: number[];
}

export interface Stock {
  id: number;
  quantite: number;
  dateEntree: string;
}

export interface Vehicule {
  id: number;
  nom: string;
  modele: string;
  marque: string;
  annee: number;
  typeMoteur: TypeMoteur;
  typeVehicule: TypeVehicule;
  prixBase: number;
  image: string;
  images: string[];
  description: string;
  caracteristiques: {
    puissance: string;
    transmission: string;
    carburant: string;
    consommation: string;
    acceleration: string;
    vitesseMax: string;
  };
  couleurs: string[];
  stock: Stock;
  options: number[];
  enPromotion: boolean;
  facteurReduction: number;
  nouveau: boolean;
}

export interface Client {
  id: number;
  type: 'CLIENT';
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  genre: 'M' | 'F';
  adresse: string;
  ville: string;
  pays: PaysLivraison;
  dateInscription: string;
  motDePasse?: string;
}

export interface Societe {
  id: number;
  type: 'SOCIETE';
  nom: string;
  email: string;
  telephone: string;
  numeroFiscal: string;
  adresse: string;
  ville: string;
  pays: PaysLivraison;
  societeMereId: number | null;
  dateInscription: string;
  motDePasse?: string;
}

export type Utilisateur = Client | Societe;

export interface LignePanier {
  id: number;
  vehiculeId: number;
  quantite: number;
  optionsSelectionnees: number[];
  couleurSelectionnee: string;
}

export interface Panier {
  id: number;
  utilisateurId: number;
  lignes: LignePanier[];
  statut: StatutPanier;
  dateCreation: string;
}

export interface LigneCommande {
  id: number;
  vehiculeId: number;
  quantite: number;
  prixUnitaireHT: number;
  tauxTVA: number;
  optionsSelectionnees: number[];
  couleur: string;
}

export interface Document {
  id: number;
  type: TypeDocument;
  format: 'PDF' | 'HTML';
  url: string;
  dateCreation: string;
}

export interface Commande {
  id: number;
  reference: string;
  utilisateurId: number;
  statut: StatutCommande;
  paysLivraison: PaysLivraison;
  adresseLivraison: string;
  methodePaiement: MethodePaiement;
  montantHT: number;
  taxes: number;
  montantTTC: number;
  dateCommande: string;
  dateLivraison: string | null;
  lignes: LigneCommande[];
  documents: Document[];
}

// Options disponibles (Prix en Franc CFA)
export const options: Option[] = [
  { id: 1, nom: 'Sièges cuir', description: 'Sièges en cuir véritable haute qualité', prix: 1640000, categorie: 'INTERIEUR', incompatibilites: [2] },
  { id: 2, nom: 'Sièges sportifs', description: 'Sièges sport avec maintien latéral renforcé', prix: 1180000, categorie: 'INTERIEUR', incompatibilites: [1] },
  { id: 3, nom: 'Toit ouvrant', description: 'Toit ouvrant panoramique électrique', prix: 985000, categorie: 'EXTERIEUR', incompatibilites: [] },
  { id: 4, nom: 'GPS intégré', description: 'Système de navigation avec cartographie 3D', prix: 525000, categorie: 'TECHNOLOGIE', incompatibilites: [] },
  { id: 5, nom: 'Caméra 360°', description: 'Système de caméras périphériques pour une vue complète', prix: 787000, categorie: 'TECHNOLOGIE', incompatibilites: [] },
  { id: 6, nom: 'Pack Sport', description: 'Jantes aluminium 20" + suspension sport', prix: 2295000, categorie: 'PERFORMANCE', incompatibilites: [7] },
  { id: 7, nom: 'Pack Confort', description: 'Suspension pilotée + insonorisation premium', prix: 1835000, categorie: 'PERFORMANCE', incompatibilites: [6] },
  { id: 8, nom: 'Peinture métallisée', description: 'Peinture métallisée premium multi-couches', prix: 590000, categorie: 'EXTERIEUR', incompatibilites: [] },
  { id: 9, nom: 'Alarme avancée', description: 'Système alarme anti-vol avec géolocalisation', prix: 395000, categorie: 'TECHNOLOGIE', incompatibilites: [] },
  { id: 10, nom: 'Charge rapide', description: 'Chargeur rapide 150kW embarqué (véhicules électriques)', prix: 985000, categorie: 'TECHNOLOGIE', incompatibilites: [] },
  { id: 11, nom: 'Sono premium', description: 'Système audio Harman Kardon 16 haut-parleurs', prix: 1250000, categorie: 'TECHNOLOGIE', incompatibilites: [] },
  { id: 12, nom: 'Pack hiver', description: 'Sièges chauffants + volant chauffant + vitres teintées', prix: 890000, categorie: 'INTERIEUR', incompatibilites: [] },
];

// Véhicules disponibles
export const vehicules: Vehicule[] = [
  {
    id: 1,
    nom: 'BMW X5',
    modele: 'xDrive40i M Sport',
    marque: 'BMW',
    annee: 2024,
    typeMoteur: 'ESSENCE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 49200000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      'https://images.unsplash.com/photo-1543796076-c57fb49a1ed9?w=800',
    ],
    description: 'Le BMW X5 incarne le luxe et la performance. Ce SUV premium offre un équilibre parfait entre confort, technologie et dynamisme sur route.',
    caracteristiques: {
      puissance: '340 ch',
      transmission: 'Automatique 8 vitesses',
      carburant: 'Essence',
      consommation: '9.5 L/100km',
      acceleration: '5.5s (0-100 km/h)',
      vitesseMax: '243 km/h',
    },
    couleurs: ['Noir Saphir', 'Blanc Alpin', 'Gris Métallisé', 'Bleu Phytonic'],
    stock: { id: 1, quantite: 5, dateEntree: '2024-01-15' },
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: true,
  },
  {
    id: 2,
    nom: 'Mercedes EQS',
    modele: '580 4MATIC AMG Line',
    marque: 'Mercedes-Benz',
    annee: 2024,
    typeMoteur: 'ELECTRIQUE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 82000000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
      'https://images.unsplash.com/photo-1622198034689-f5b3a6e90a12?w=800',
    ],
    description: 'La Mercedes EQS représente le summum du luxe électrique. Avec son autonomie exceptionnelle et son intérieur futuriste, elle redéfinit les standards.',
    caracteristiques: {
      puissance: '523 ch',
      transmission: 'Automatique',
      carburant: 'Électrique',
      consommation: '18.9 kWh/100km',
      acceleration: '4.3s (0-100 km/h)',
      vitesseMax: '210 km/h',
    },
    couleurs: ['Noir Obsidienne', 'Argent High-tech', 'Blanc Diamant', 'Bleu Sodalite'],
    stock: { id: 2, quantite: 3, dateEntree: '2024-02-10' },
    options: [1, 3, 4, 5, 7, 8, 9, 10, 11],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: true,
  },
  {
    id: 3,
    nom: 'Audi A4',
    modele: '45 TFSI quattro S line',
    marque: 'Audi',
    annee: 2024,
    typeMoteur: 'ESSENCE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 31500000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800',
    ],
    description: 'L\'Audi A4 allie élégance et technologie de pointe. Sa transmission quattro garantit une tenue de route exceptionnelle en toutes circonstances.',
    caracteristiques: {
      puissance: '265 ch',
      transmission: 'Automatique S tronic 7',
      carburant: 'Essence',
      consommation: '7.2 L/100km',
      acceleration: '5.8s (0-100 km/h)',
      vitesseMax: '250 km/h',
    },
    couleurs: ['Noir Mythic', 'Blanc Glacier', 'Gris Daytona', 'Rouge Tango'],
    stock: { id: 3, quantite: 8, dateEntree: '2024-01-20' },
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    enPromotion: true,
    facteurReduction: 0.05,
    nouveau: false,
  },
  {
    id: 4,
    nom: 'Tesla Model 3',
    modele: 'Performance',
    marque: 'Tesla',
    annee: 2024,
    typeMoteur: 'ELECTRIQUE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 38000000,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800',
    ],
    description: 'La Tesla Model 3 Performance offre des accélérations fulgurantes et une autonomie impressionnante. Le futur de la mobilité est là.',
    caracteristiques: {
      puissance: '513 ch',
      transmission: 'Automatique',
      carburant: 'Électrique',
      consommation: '16.5 kWh/100km',
      acceleration: '3.3s (0-100 km/h)',
      vitesseMax: '261 km/h',
    },
    couleurs: ['Noir Solide', 'Blanc Nacré', 'Rouge Multicouches', 'Bleu Métallisé'],
    stock: { id: 4, quantite: 12, dateEntree: '2024-03-01' },
    options: [1, 3, 4, 5, 8, 9, 10, 11],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: true,
  },
  {
    id: 5,
    nom: 'Vespa Elettrica',
    modele: '70 km/h',
    marque: 'Vespa',
    annee: 2024,
    typeMoteur: 'ELECTRIQUE',
    typeVehicule: 'SCOOTER',
    prixBase: 4920000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    description: 'La Vespa Elettrica combine le style italien intemporel avec une motorisation 100% électrique. Parfaite pour la mobilité urbaine durable.',
    caracteristiques: {
      puissance: '4 kW',
      transmission: 'Automatique CVT',
      carburant: 'Électrique',
      consommation: '5 kWh/100km',
      acceleration: '-',
      vitesseMax: '70 km/h',
    },
    couleurs: ['Blanc Montebianco', 'Gris Titanio', 'Vert Portofino'],
    stock: { id: 5, quantite: 15, dateEntree: '2024-02-28' },
    options: [9],
    enPromotion: true,
    facteurReduction: 0.10,
    nouveau: false,
  },
  {
    id: 6,
    nom: 'Honda PCX',
    modele: '125',
    marque: 'Honda',
    annee: 2024,
    typeMoteur: 'ESSENCE',
    typeVehicule: 'SCOOTER',
    prixBase: 2750000,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    images: [
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    ],
    description: 'Le Honda PCX 125 est le scooter urbain par excellence. Économique, fiable et confortable, il est idéal pour vos déplacements quotidiens.',
    caracteristiques: {
      puissance: '12.5 ch',
      transmission: 'Automatique CVT',
      carburant: 'Essence',
      consommation: '2.1 L/100km',
      acceleration: '-',
      vitesseMax: '100 km/h',
    },
    couleurs: ['Noir', 'Blanc Perle', 'Rouge'],
    stock: { id: 6, quantite: 20, dateEntree: '2024-01-05' },
    options: [9],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: false,
  },
  {
    id: 7,
    nom: 'Porsche Taycan',
    modele: 'Turbo S',
    marque: 'Porsche',
    annee: 2024,
    typeMoteur: 'ELECTRIQUE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 124600000,
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
    images: [
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
      'https://images.unsplash.com/photo-1619976215249-0f2c071c3593?w=800',
    ],
    description: 'Le Porsche Taycan Turbo S repousse les limites de la performance électrique. Des sensations de conduite inégalées avec zéro émission.',
    caracteristiques: {
      puissance: '761 ch',
      transmission: 'Automatique 2 rapports',
      carburant: 'Électrique',
      consommation: '23.4 kWh/100km',
      acceleration: '2.8s (0-100 km/h)',
      vitesseMax: '260 km/h',
    },
    couleurs: ['Noir', 'Blanc Carrara', 'Gris Craie', 'Rouge Carmin'],
    stock: { id: 7, quantite: 2, dateEntree: '2024-03-15' },
    options: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: true,
  },
  {
    id: 8,
    nom: 'Range Rover',
    modele: 'Sport HSE Dynamic',
    marque: 'Land Rover',
    annee: 2024,
    typeMoteur: 'ESSENCE',
    typeVehicule: 'AUTOMOBILE',
    prixBase: 64300000,
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
      'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800',
    ],
    description: 'Le Range Rover Sport incarne le luxe britannique et les capacités tout-terrain légendaires. Confort absolu sur tous les terrains.',
    caracteristiques: {
      puissance: '400 ch',
      transmission: 'Automatique 8 vitesses',
      carburant: 'Essence',
      consommation: '11.2 L/100km',
      acceleration: '5.9s (0-100 km/h)',
      vitesseMax: '225 km/h',
    },
    couleurs: ['Noir Santorini', 'Blanc Fuji', 'Gris Eiger', 'Vert British Racing'],
    stock: { id: 8, quantite: 4, dateEntree: '2024-02-20' },
    options: [1, 3, 4, 5, 7, 8, 9, 11, 12],
    enPromotion: false,
    facteurReduction: 0,
    nouveau: false,
  },
];

// Clients mockés
export const clients: Client[] = [
  {
    id: 1,
    type: 'CLIENT',
    nom: 'Fotso',
    prenom: 'Jean',
    email: 'jean.fotso@email.com',
    telephone: '+237699123456',
    dateNaissance: '1985-03-15',
    genre: 'M',
    adresse: '123 Rue de la Paix',
    ville: 'Douala',
    pays: 'CM',
    dateInscription: '2024-01-10',
    motDePasse: 'password123',
  },
  {
    id: 2,
    type: 'CLIENT',
    nom: 'Ngo Nlend',
    prenom: 'Sophie',
    email: 'sophie.ngonlend@email.com',
    telephone: '+237677234567',
    dateNaissance: '1990-07-22',
    genre: 'F',
    adresse: '45 Boulevard du Commerce',
    ville: 'Yaoundé',
    pays: 'CM',
    dateInscription: '2024-01-15',
    motDePasse: 'password123',
  },
];

// Sociétés mockées
export const societes: Societe[] = [
  {
    id: 101,
    type: 'SOCIETE',
    nom: 'AutoFleet Cameroun SA',
    email: 'contact@autofleet-cm.com',
    telephone: '+237233456789',
    numeroFiscal: 'CM12345678901',
    adresse: '10 Avenue des Affaires',
    ville: 'Douala',
    pays: 'CM',
    societeMereId: null,
    dateInscription: '2024-01-05',
    motDePasse: 'societe123',
  },
  {
    id: 102,
    type: 'SOCIETE',
    nom: 'AutoFleet Douala',
    email: 'douala@autofleet-cm.com',
    telephone: '+237233567890',
    numeroFiscal: 'CM98765432101',
    adresse: '25 Rue du Port',
    ville: 'Douala',
    pays: 'CM',
    societeMereId: 101,
    dateInscription: '2024-01-20',
    motDePasse: 'societe123',
  },
];

// Commandes mockées (pour l'historique client)
export const commandes: Commande[] = [
  {
    id: 1,
    reference: 'CMD-2024-001',
    utilisateurId: 1,
    statut: 'LIVREE',
    paysLivraison: 'CM',
    adresseLivraison: '123 Rue de la Paix, Douala',
    methodePaiement: 'CARTE_BANCAIRE',
    montantHT: 52000000,
    taxes: 9880000,
    montantTTC: 61880000,
    dateCommande: '2024-01-20',
    dateLivraison: '2024-02-15',
    lignes: [
      { id: 1, vehiculeId: 1, quantite: 1, prixUnitaireHT: 49200000, tauxTVA: 19, optionsSelectionnees: [1, 4, 5], couleur: 'Noir Saphir' },
    ],
    documents: [
      { id: 1, type: 'BON_COMMANDE', format: 'PDF', url: '/docs/cmd-001-bon.pdf', dateCreation: '2024-01-20' },
      { id: 2, type: 'CERTIFICAT_CESSION', format: 'PDF', url: '/docs/cmd-001-cession.pdf', dateCreation: '2024-02-15' },
      { id: 3, type: 'DEMANDE_IMMATRICULATION', format: 'PDF', url: '/docs/cmd-001-immat.pdf', dateCreation: '2024-02-15' },
    ],
  },
  {
    id: 2,
    reference: 'CMD-2024-002',
    utilisateurId: 1,
    statut: 'EN_COURS',
    paysLivraison: 'CM',
    adresseLivraison: '123 Rue de la Paix, Douala',
    methodePaiement: 'CREDIT',
    montantHT: 38985000,
    taxes: 7407150,
    montantTTC: 46392150,
    dateCommande: '2024-03-10',
    dateLivraison: null,
    lignes: [
      { id: 2, vehiculeId: 4, quantite: 1, prixUnitaireHT: 38000000, tauxTVA: 19, optionsSelectionnees: [10], couleur: 'Blanc Nacré' },
    ],
    documents: [
      { id: 4, type: 'BON_COMMANDE', format: 'PDF', url: '/docs/cmd-002-bon.pdf', dateCreation: '2024-03-10' },
    ],
  },
];

// Taux de TVA par pays
export const tauxTVA: Record<PaysLivraison, number> = {
  CM: 19.25,
  FR: 20,
  US: 8,
  NG: 7.5,
};

// Helper functions
export const getVehiculeById = (id: number): Vehicule | undefined =>
  vehicules.find(v => v.id === id);

export const getOptionById = (id: number): Option | undefined =>
  options.find(o => o.id === id);

export const getClientById = (id: number): Client | undefined =>
  clients.find(c => c.id === id);

export const getSocieteById = (id: number): Societe | undefined =>
  societes.find(s => s.id === id);

export const getUtilisateurById = (id: number): Utilisateur | undefined =>
  getClientById(id) || getSocieteById(id);

export const getCommandesByUserId = (userId: number): Commande[] =>
  commandes.filter(c => c.utilisateurId === userId);

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatDateShort = (date: string): string =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const getPaysLabel = (code: PaysLivraison): string => {
  const labels: Record<PaysLivraison, string> = {
    CM: 'Cameroun',
    FR: 'France',
    US: 'États-Unis',
    NG: 'Nigeria',
  };
  return labels[code];
};

export const getStatutLabel = (statut: StatutCommande): string => {
  const labels: Record<StatutCommande, string> = {
    EN_COURS: 'En cours',
    VALIDEE: 'Validée',
    LIVREE: 'Livrée',
  };
  return labels[statut];
};

export const getStatutColor = (statut: StatutCommande): string => {
  const colors: Record<StatutCommande, string> = {
    EN_COURS: 'warning',
    VALIDEE: 'info',
    LIVREE: 'success',
  };
  return colors[statut];
};

export const getMethodePaiementLabel = (methode: MethodePaiement): string => {
  const labels: Record<MethodePaiement, string> = {
    CARTE_BANCAIRE: 'Carte bancaire',
    PAYPAL: 'PayPal',
    COMPTANT: 'Comptant',
    CREDIT: 'Crédit',
  };
  return labels[methode];
};

export const calculerPrixVehicule = (vehicule: Vehicule): number => {
  if (vehicule.enPromotion && vehicule.facteurReduction > 0) {
    return vehicule.prixBase * (1 - vehicule.facteurReduction);
  }
  return vehicule.prixBase;
};

export const calculerTotalOptions = (optionIds: number[]): number => {
  return optionIds.reduce((total, id) => {
    const option = getOptionById(id);
    return total + (option?.prix || 0);
  }, 0);
};

export const calculerTaxes = (montantHT: number, pays: PaysLivraison): number => {
  return montantHT * (tauxTVA[pays] / 100);
};

export const verifierCompatibiliteOptions = (optionId: number, optionsSelectionnees: number[]): boolean => {
  const option = getOptionById(optionId);
  if (!option) return false;

  return !option.incompatibilites.some(incompId => optionsSelectionnees.includes(incompId));
};

export const getOptionsIncompatibles = (optionId: number): number[] => {
  const option = getOptionById(optionId);
  return option?.incompatibilites || [];
};

// Fonction d'authentification mockée
export const authentifier = (email: string, motDePasse: string): Utilisateur | null => {
  const client = clients.find(c => c.email === email && c.motDePasse === motDePasse);
  if (client) return client;

  const societe = societes.find(s => s.email === email && s.motDePasse === motDePasse);
  if (societe) return societe;

  return null;
};

// Véhicules en vedette (nouveaux ou en promotion)
export const getVehiculesEnVedette = (): Vehicule[] => {
  return vehicules.filter(v => v.nouveau || v.enPromotion).slice(0, 4);
};

// Véhicules populaires (basés sur le stock bas = forte demande)
export const getVehiculesPopulaires = (): Vehicule[] => {
  return [...vehicules]
    .filter(v => v.typeVehicule === 'AUTOMOBILE')
    .sort((a, b) => a.stock.quantite - b.stock.quantite)
    .slice(0, 4);
};
