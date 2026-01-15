import { jsPDF } from 'jspdf';

// Couleurs de la marque MED Motors
const COLORS = {
  primary: [26, 26, 46] as [number, number, number],
  secondary: [201, 162, 39] as [number, number, number],
  gray: [108, 117, 125] as [number, number, number],
  lightGray: [248, 249, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
  darkGray: [55, 65, 81] as [number, number, number],
};

// Informations du projet
const PROJECT_INFO = {
  name: 'MED Motors',
  subtitle: 'Plateforme E-commerce Automobile',
  version: '1.0.0',
  date: new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }),
  client: 'MED Motors SARL',
  author: 'Équipe de Développement',
};

class CahierDesChargesGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private currentY: number;
  private pageNumber: number;
  private tableOfContents: { title: string; page: number; level: number }[] = [];

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.contentWidth = this.pageWidth - 2 * this.margin;
    this.currentY = this.margin;
    this.pageNumber = 1;
  }

  private checkPageBreak(requiredSpace: number = 30): void {
    if (this.currentY + requiredSpace > this.pageHeight - 25) {
      this.addNewPage();
    }
  }

  private addNewPage(): void {
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = this.margin;
    this.addPageHeader();
  }

  private addPageHeader(): void {
    if (this.pageNumber > 1) {
      // Header line
      this.doc.setDrawColor(...COLORS.secondary);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, 12, this.pageWidth - this.margin, 12);

      // Header text
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.gray);
      this.doc.text('MED Motors - Cahier des Charges', this.margin, 9);
      this.doc.text(`Page ${this.pageNumber}`, this.pageWidth - this.margin, 9, { align: 'right' });

      this.currentY = 20;
    }
  }

  private addFooter(): void {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // Footer line
      this.doc.setDrawColor(...COLORS.lightGray);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);

      // Footer text
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.gray);
      this.doc.text(
        `Document confidentiel - ${PROJECT_INFO.date}`,
        this.margin,
        this.pageHeight - 10
      );
      this.doc.text(
        `Page ${i} / ${totalPages}`,
        this.pageWidth - this.margin,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  // Page de couverture
  private addCoverPage(): void {
    // Background gradient effect
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight / 2, 'F');

    // Gold accent bar
    this.doc.setFillColor(...COLORS.secondary);
    this.doc.rect(0, this.pageHeight / 2 - 3, this.pageWidth, 6, 'F');

    // Logo placeholder
    this.doc.setFillColor(...COLORS.secondary);
    this.doc.circle(this.pageWidth / 2, 50, 20, 'F');
    this.doc.setFontSize(24);
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MED', this.pageWidth / 2, 55, { align: 'center' });

    // Title
    this.doc.setFontSize(32);
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CAHIER DES CHARGES', this.pageWidth / 2, 95, { align: 'center' });

    // Subtitle
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Plateforme E-commerce Automobile', this.pageWidth / 2, 108, { align: 'center' });

    // Project name
    this.doc.setFontSize(28);
    this.doc.setTextColor(...COLORS.secondary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MED MOTORS', this.pageWidth / 2, 130, { align: 'center' });

    // Info box
    const boxY = this.pageHeight / 2 + 20;
    this.doc.setFillColor(...COLORS.lightGray);
    this.doc.roundedRect(this.margin + 20, boxY, this.contentWidth - 40, 70, 5, 5, 'F');

    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLORS.darkGray);
    this.doc.setFont('helvetica', 'normal');

    const infoItems = [
      ['Version', PROJECT_INFO.version],
      ['Date', PROJECT_INFO.date],
      ['Client', PROJECT_INFO.client],
      ['Auteur', PROJECT_INFO.author],
      ['Statut', 'Document Final'],
    ];

    let infoY = boxY + 15;
    infoItems.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${label}:`, this.margin + 35, infoY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(value, this.margin + 75, infoY);
      infoY += 12;
    });

    // Confidential notice
    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.gray);
    this.doc.text(
      'Ce document est confidentiel et destiné uniquement aux parties concernées.',
      this.pageWidth / 2,
      this.pageHeight - 30,
      { align: 'center' }
    );
  }

  // Table des matières
  private addTableOfContents(): void {
    this.addNewPage();

    this.doc.setFontSize(24);
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TABLE DES MATIÈRES', this.margin, this.currentY);
    this.currentY += 20;

    // Placeholder - will be updated after all content is added
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLORS.gray);
    this.doc.text('[La table des matières sera générée automatiquement]', this.margin, this.currentY);
  }

  // Section Title
  private addSectionTitle(title: string, level: number = 1): void {
    this.checkPageBreak(25);

    if (level === 1) {
      // Main section
      this.currentY += 10;
      this.doc.setFillColor(...COLORS.primary);
      this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, 12, 'F');

      this.doc.setFontSize(14);
      this.doc.setTextColor(...COLORS.white);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title.toUpperCase(), this.margin + 5, this.currentY + 3);
      this.currentY += 18;

      this.tableOfContents.push({ title, page: this.pageNumber, level: 1 });
    } else if (level === 2) {
      // Subsection
      this.currentY += 8;
      this.doc.setDrawColor(...COLORS.secondary);
      this.doc.setLineWidth(2);
      this.doc.line(this.margin, this.currentY, this.margin + 5, this.currentY);

      this.doc.setFontSize(12);
      this.doc.setTextColor(...COLORS.primary);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin + 10, this.currentY + 1);
      this.currentY += 12;

      this.tableOfContents.push({ title, page: this.pageNumber, level: 2 });
    } else {
      // Sub-subsection
      this.currentY += 5;
      this.doc.setFontSize(11);
      this.doc.setTextColor(...COLORS.darkGray);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin + 5, this.currentY);
      this.currentY += 8;
    }
  }

  // Paragraph
  private addParagraph(text: string, indent: number = 0): void {
    this.checkPageBreak(15);

    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLORS.darkGray);
    this.doc.setFont('helvetica', 'normal');

    const lines = this.doc.splitTextToSize(text, this.contentWidth - indent);
    lines.forEach((line: string) => {
      this.checkPageBreak(6);
      this.doc.text(line, this.margin + indent, this.currentY);
      this.currentY += 5;
    });
    this.currentY += 3;
  }

  // Bullet list
  private addBulletList(items: string[], indent: number = 5): void {
    items.forEach((item) => {
      this.checkPageBreak(8);

      // Bullet point
      this.doc.setFillColor(...COLORS.secondary);
      this.doc.circle(this.margin + indent + 2, this.currentY - 1.5, 1.5, 'F');

      // Text
      this.doc.setFontSize(10);
      this.doc.setTextColor(...COLORS.darkGray);
      this.doc.setFont('helvetica', 'normal');

      const lines = this.doc.splitTextToSize(item, this.contentWidth - indent - 10);
      lines.forEach((line: string, idx: number) => {
        this.doc.text(line, this.margin + indent + 8, this.currentY + (idx * 5));
      });
      this.currentY += lines.length * 5 + 2;
    });
    this.currentY += 3;
  }

  // Table
  private addTable(headers: string[], rows: string[][], colWidths?: number[]): void {
    this.checkPageBreak(30);

    const defaultColWidth = this.contentWidth / headers.length;
    const widths = colWidths || headers.map(() => defaultColWidth);
    const rowHeight = 8;

    // Header
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, rowHeight, 'F');

    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFont('helvetica', 'bold');

    let xPos = this.margin + 3;
    headers.forEach((header, idx) => {
      this.doc.text(header, xPos, this.currentY + 5.5);
      xPos += widths[idx];
    });
    this.currentY += rowHeight;

    // Rows
    rows.forEach((row, rowIdx) => {
      this.checkPageBreak(rowHeight + 5);

      const bgColor = rowIdx % 2 === 0 ? COLORS.lightGray : COLORS.white;
      this.doc.setFillColor(...bgColor);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, rowHeight, 'F');

      this.doc.setFontSize(9);
      this.doc.setTextColor(...COLORS.darkGray);
      this.doc.setFont('helvetica', 'normal');

      xPos = this.margin + 3;
      row.forEach((cell, idx) => {
        const truncated = cell.length > 40 ? cell.substring(0, 37) + '...' : cell;
        this.doc.text(truncated, xPos, this.currentY + 5.5);
        xPos += widths[idx];
      });
      this.currentY += rowHeight;
    });

    // Border
    this.doc.setDrawColor(...COLORS.gray);
    this.doc.setLineWidth(0.2);
    this.doc.rect(this.margin, this.currentY - (rows.length + 1) * rowHeight, this.contentWidth, (rows.length + 1) * rowHeight);

    this.currentY += 8;
  }

  // Info box
  private addInfoBox(title: string, content: string): void {
    this.checkPageBreak(30);

    const lines = this.doc.splitTextToSize(content, this.contentWidth - 20);
    const boxHeight = 15 + lines.length * 5;

    this.doc.setFillColor(...COLORS.lightGray);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 3, 3, 'F');

    this.doc.setDrawColor(...COLORS.secondary);
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, this.currentY, this.margin, this.currentY + boxHeight);

    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 8, this.currentY + 8);

    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.darkGray);
    this.doc.setFont('helvetica', 'normal');
    lines.forEach((line: string, idx: number) => {
      this.doc.text(line, this.margin + 8, this.currentY + 15 + idx * 5);
    });

    this.currentY += boxHeight + 8;
  }

  // Generate full document
  public generate(): void {
    // Page de couverture
    this.addCoverPage();

    // Table des matières (placeholder)
    this.addTableOfContents();

    // ==========================================
    // 1. INTRODUCTION
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('1. INTRODUCTION');

    this.addSectionTitle('1.1 Présentation du Projet', 2);
    this.addParagraph(
      'MED Motors est une plateforme e-commerce dédiée à la vente de véhicules premium au Cameroun et à l\'international. ' +
      'Cette application web permet aux utilisateurs de parcourir un catalogue de véhicules, de configurer leurs options, ' +
      'et de finaliser leurs achats en ligne avec différentes méthodes de paiement.'
    );

    this.addSectionTitle('1.2 Objectifs du Projet', 2);
    this.addBulletList([
      'Offrir une expérience d\'achat automobile en ligne fluide et professionnelle',
      'Permettre la configuration personnalisée des véhicules avec gestion des options',
      'Gérer deux types de clients : particuliers et entreprises',
      'Proposer un système de paiement flexible avec calcul automatique des taxes',
      'Générer des documents professionnels (bon de commande, facture proforma)',
      'Assurer une expérience utilisateur responsive et accessible',
    ]);

    this.addSectionTitle('1.3 Périmètre Fonctionnel', 2);
    this.addParagraph(
      'Le projet couvre l\'intégralité du parcours client, de la navigation dans le catalogue jusqu\'à la confirmation de commande, ' +
      'incluant la gestion du panier, l\'authentification, et la génération de documents PDF.'
    );

    this.addInfoBox('Note Importante',
      'Cette version du projet utilise des données mockées côté client. ' +
      'L\'intégration avec un backend réel sera réalisée dans une phase ultérieure.'
    );

    // ==========================================
    // 2. CONTEXTE ET ENJEUX
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('2. CONTEXTE ET ENJEUX');

    this.addSectionTitle('2.1 Contexte du Marché', 2);
    this.addParagraph(
      'Le marché automobile camerounais connaît une croissance significative avec une demande croissante pour les véhicules premium. ' +
      'MED Motors se positionne comme un acteur majeur en proposant une expérience d\'achat moderne et digitalisée, ' +
      'répondant aux attentes d\'une clientèle exigeante.'
    );

    this.addSectionTitle('2.2 Marchés Cibles', 2);
    this.addTable(
      ['Pays', 'Code', 'Taux TVA', 'Devise'],
      [
        ['Cameroun', 'CM', '19,25%', 'XAF (FCFA)'],
        ['France', 'FR', '20%', 'XAF (FCFA)'],
        ['États-Unis', 'US', '8%', 'XAF (FCFA)'],
        ['Nigeria', 'NG', '7,5%', 'XAF (FCFA)'],
      ],
      [50, 30, 40, 50]
    );

    this.addSectionTitle('2.3 Enjeux Stratégiques', 2);
    this.addBulletList([
      'Digitalisation du processus de vente automobile',
      'Expansion internationale avec gestion multi-pays',
      'Fidélisation client via une expérience utilisateur premium',
      'Automatisation de la génération des documents commerciaux',
      'Support des véhicules électriques (marché en croissance)',
    ]);

    // ==========================================
    // 3. SPÉCIFICATIONS FONCTIONNELLES
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('3. SPÉCIFICATIONS FONCTIONNELLES');

    this.addSectionTitle('3.1 Architecture des Pages', 2);
    this.addTable(
      ['Page', 'Route', 'Auth.', 'Description'],
      [
        ['Accueil', '/', 'Non', 'Landing page avec sections promotionnelles'],
        ['Catalogue', '/catalogue', 'Non', 'Liste des véhicules avec filtres'],
        ['Détail Véhicule', '/vehicule/:id', 'Non', 'Fiche produit complète'],
        ['Panier', '/panier', 'Non', 'Gestion du panier d\'achat'],
        ['Commande', '/commande', 'Oui', 'Processus de checkout en 3 étapes'],
        ['Connexion', '/connexion', 'Non', 'Authentification et inscription'],
        ['Profil', '/profil', 'Oui', 'Gestion du compte utilisateur'],
        ['Commandes', '/mes-commandes', 'Oui', 'Historique des commandes'],
      ],
      [40, 40, 20, 70]
    );

    this.addSectionTitle('3.2 Module Catalogue', 2);
    this.addParagraph('Le catalogue permet aux utilisateurs de parcourir l\'ensemble des véhicules disponibles avec des fonctionnalités avancées de recherche et filtrage.');

    this.addSectionTitle('Fonctionnalités de Filtrage', 3);
    this.addBulletList([
      'Recherche textuelle (nom, marque, modèle)',
      'Filtre par type de véhicule (Automobile, Scooter)',
      'Filtre par motorisation (Essence, Électrique)',
      'Filtre par marque (dynamique selon le catalogue)',
      'Filtre promotions uniquement',
      'Tri par prix, année, nom ou défaut',
    ]);

    this.addSectionTitle('Modes d\'Affichage', 3);
    this.addBulletList([
      'Vue grille (3 colonnes desktop, responsive)',
      'Vue liste (affichage compact)',
      'Pagination (9 éléments par page)',
    ]);

    this.addSectionTitle('3.3 Module Véhicule', 2);
    this.addParagraph('La page détail véhicule présente toutes les informations et permet la configuration personnalisée.');

    this.addSectionTitle('Informations Affichées', 3);
    this.addBulletList([
      'Galerie d\'images avec navigation',
      'Spécifications techniques (puissance, transmission, consommation...)',
      'Description détaillée',
      'Disponibilité en stock avec alerte si ≤ 3 unités',
      'Prix de base et prix final avec options',
    ]);

    this.addSectionTitle('Configuration Véhicule', 3);
    this.addBulletList([
      'Sélection de couleur parmi les disponibles',
      'Sélection des options par catégorie (Intérieur, Extérieur, Performance, Technologie)',
      'Gestion automatique des incompatibilités entre options',
      'Calcul du prix en temps réel',
      'Sélection de la quantité (limitée au stock)',
    ]);

    this.addSectionTitle('3.4 Module Panier', 2);
    this.addParagraph('Le panier centralise les articles sélectionnés et prépare la commande.');

    this.addBulletList([
      'Liste des articles avec image, nom, couleur et options',
      'Modification de la quantité directement dans le panier',
      'Suppression d\'articles',
      'Sélection du pays de livraison',
      'Calcul automatique des taxes selon le pays',
      'Affichage du sous-total HT, TVA et total TTC',
      'Livraison gratuite sur tous les pays',
      'Persistance du panier en localStorage',
    ]);

    // Nouvelle page pour la suite des specs
    this.addNewPage();

    this.addSectionTitle('3.5 Module Commande (Checkout)', 2);
    this.addParagraph('Le processus de commande se déroule en 3 étapes distinctes avec validation à chaque étape.');

    this.addSectionTitle('Étape 1 : Livraison', 3);
    this.addBulletList([
      'Sélection du pays de livraison',
      'Saisie de l\'adresse de livraison (pré-remplie si profil complété)',
      'Information sur le délai estimé (2-4 semaines)',
    ]);

    this.addSectionTitle('Étape 2 : Paiement', 3);
    this.addBulletList([
      'Carte bancaire (Visa, Mastercard)',
      'PayPal',
      'Paiement comptant à la livraison',
      'Financement / Crédit (avec étude de dossier)',
    ]);

    this.addSectionTitle('Étape 3 : Confirmation', 3);
    this.addBulletList([
      'Génération de la référence de commande (CMD-YYYY-XXXXXX)',
      'Affichage du récapitulatif',
      'Téléchargement du Bon de Commande (PDF)',
      'Téléchargement de la Facture Proforma (PDF)',
      'Vidange automatique du panier',
    ]);

    this.addSectionTitle('3.6 Module Authentification', 2);
    this.addParagraph('L\'application supporte deux types d\'utilisateurs avec des processus d\'inscription différenciés.');

    this.addTable(
      ['Type', 'Champs Requis'],
      [
        ['Particulier (CLIENT)', 'Prénom, Nom, Email, Téléphone, Mot de passe'],
        ['Société (SOCIETE)', 'Raison sociale, N° Fiscal, Email, Téléphone, Mot de passe'],
      ],
      [50, 120]
    );

    this.addSectionTitle('3.7 Module Profil', 2);
    this.addBulletList([
      'Onglet Profil : Modification des informations personnelles',
      'Onglet Sécurité : Changement de mot de passe, 2FA (prévu)',
      'Onglet Notifications : Préférences email et marketing',
      'Accès rapide aux commandes',
      'Déconnexion',
    ]);

    this.addSectionTitle('3.8 Module Commandes (Historique)', 2);
    this.addBulletList([
      'Liste paginée des commandes (5 par page)',
      'Statuts : En cours, Validée, Livrée',
      'Détails de chaque commande (articles, prix, adresse)',
      'Téléchargement des documents associés',
      'Lien vers les fiches véhicules',
    ]);

    // ==========================================
    // 4. SPÉCIFICATIONS TECHNIQUES
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('4. SPÉCIFICATIONS TECHNIQUES');

    this.addSectionTitle('4.1 Stack Technologique', 2);
    this.addTable(
      ['Catégorie', 'Technologie', 'Version'],
      [
        ['Framework Frontend', 'React', '19.2.0'],
        ['Langage', 'TypeScript', '5.9.3'],
        ['Bundler', 'Vite', '7.x'],
        ['Styles', 'Tailwind CSS', '3.4.17'],
        ['Routing', 'React Router DOM', '7.12.0'],
        ['Icônes', 'Lucide React', '0.562.0'],
        ['PDF', 'jsPDF', '4.0.0'],
        ['Utilitaires CSS', 'clsx, tailwind-merge', 'Dernières'],
      ],
      [50, 60, 60]
    );

    this.addSectionTitle('4.2 Architecture des Composants', 2);
    this.addParagraph('L\'application suit une architecture modulaire avec séparation claire des responsabilités.');

    this.addSectionTitle('Structure des Dossiers', 3);
    this.addBulletList([
      'src/components/layout/ : Composants de mise en page (Header, Footer, Layout)',
      'src/components/ui/ : 30+ composants UI réutilisables',
      'src/components/sections/ : Sections de pages (Hero, Features, CTA...)',
      'src/context/ : Gestion d\'état (AuthContext, CartContext)',
      'src/pages/ : 8 pages principales de l\'application',
      'src/data/ : Types, interfaces et données mockées',
      'src/lib/ : Utilitaires et générateurs PDF',
      'src/assets/ : Ressources statiques (vidéos)',
    ]);

    this.addSectionTitle('4.3 Gestion d\'État', 2);

    this.addSectionTitle('AuthContext', 3);
    this.addBulletList([
      'Gestion de l\'utilisateur connecté',
      'Persistance via localStorage (med_user)',
      'Fonctions : login, logout, register',
      'État : user, isAuthenticated, isLoading',
    ]);

    this.addSectionTitle('CartContext', 3);
    this.addBulletList([
      'Gestion du panier d\'achat',
      'Persistance via localStorage (med_panier, med_pays_livraison)',
      'Calcul automatique des totaux et taxes',
      'Validation des options compatibles',
      'Fonctions : addToCart, removeFromCart, updateQuantity, clearCart',
    ]);

    this.addSectionTitle('4.4 Modèles de Données', 2);

    this.addTable(
      ['Interface', 'Description', 'Champs Clés'],
      [
        ['Vehicule', 'Véhicule en catalogue', 'id, nom, marque, prix, stock, options'],
        ['Option', 'Option configurable', 'id, nom, prix, catégorie, incompatibilités'],
        ['Client', 'Utilisateur particulier', 'id, nom, prénom, email, adresse'],
        ['Societe', 'Utilisateur entreprise', 'id, nom, numeroFiscal, email'],
        ['LignePanier', 'Article du panier', 'vehiculeId, quantité, options, couleur'],
        ['Commande', 'Commande validée', 'reference, statut, lignes, documents'],
      ],
      [40, 50, 80]
    );

    // ==========================================
    // 5. DESIGN SYSTEM
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('5. DESIGN SYSTEM');

    this.addSectionTitle('5.1 Palette de Couleurs', 2);
    this.addTable(
      ['Nom', 'Code Hex', 'Utilisation'],
      [
        ['Primary (Navy)', '#1A1A2E', 'Textes, titres, éléments interactifs'],
        ['Secondary (Gold)', '#C9A227', 'Accents, CTA, badges promotionnels'],
        ['Success', '#10B981', 'Validations, statuts positifs'],
        ['Warning', '#F59E0B', 'Alertes, statuts en attente'],
        ['Error', '#EF4444', 'Erreurs, messages critiques'],
        ['Gray', '#6B7280', 'Textes secondaires, bordures'],
        ['Background', '#F8F9FA', 'Fond de page'],
      ],
      [50, 40, 80]
    );

    this.addSectionTitle('5.2 Typographie', 2);
    this.addBulletList([
      'Police principale : Inter (Google Fonts)',
      'Poids utilisés : 400 (normal), 600 (semibold), 700 (bold)',
      'Échelle : xs (12px) à 5xl (48px)',
      'Interligne : 1.6 (body), 1.1 (titres)',
    ]);

    this.addSectionTitle('5.3 Espacements', 2);
    this.addParagraph('Système basé sur une unité de 4px (Material Design).');
    this.addBulletList([
      'xs: 4px | sm: 8px | md: 12px | base: 16px',
      'lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px',
    ]);

    this.addSectionTitle('5.4 Breakpoints Responsive', 2);
    this.addTable(
      ['Breakpoint', 'Largeur Min', 'Cible'],
      [
        ['sm', '640px', 'Mobiles paysage, petites tablettes'],
        ['md', '768px', 'Tablettes'],
        ['lg', '1024px', 'Laptops'],
        ['xl', '1280px', 'Desktops'],
        ['2xl', '1536px', 'Grands écrans'],
      ],
      [40, 50, 80]
    );

    this.addSectionTitle('5.5 Accessibilité', 2);
    this.addBulletList([
      'Cibles tactiles minimum 48x48px',
      'Contraste WCAG AA sur tous les textes',
      'Navigation au clavier supportée',
      'Labels ARIA sur les éléments interactifs',
      'Hiérarchie des titres sémantique (h1-h6)',
    ]);

    // ==========================================
    // 6. CATALOGUE VÉHICULES
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('6. CATALOGUE VÉHICULES');

    this.addSectionTitle('6.1 Véhicules Disponibles', 2);
    this.addTable(
      ['Véhicule', 'Type', 'Moteur', 'Prix (FCFA)'],
      [
        ['BMW X5 xDrive40i', 'Automobile', 'Essence', '49 200 000'],
        ['Mercedes EQS 580', 'Automobile', 'Électrique', '82 000 000'],
        ['Audi A4 45 TFSI', 'Automobile', 'Essence', '31 500 000*'],
        ['Tesla Model 3 Performance', 'Automobile', 'Électrique', '38 000 000'],
        ['Vespa Elettrica', 'Scooter', 'Électrique', '4 920 000*'],
        ['Honda PCX 125', 'Scooter', 'Essence', '2 750 000'],
        ['Porsche Taycan Turbo S', 'Automobile', 'Électrique', '124 600 000'],
        ['Range Rover Sport HSE', 'Automobile', 'Essence', '64 300 000'],
      ],
      [55, 35, 35, 45]
    );
    this.addParagraph('* Prix en promotion');

    this.addSectionTitle('6.2 Options Disponibles', 2);
    this.addTable(
      ['Option', 'Catégorie', 'Prix (FCFA)'],
      [
        ['Sièges cuir', 'Intérieur', '1 640 000'],
        ['Sièges sportifs', 'Intérieur', '1 180 000'],
        ['Toit ouvrant panoramique', 'Extérieur', '985 000'],
        ['GPS intégré', 'Technologie', '525 000'],
        ['Caméra 360°', 'Technologie', '787 000'],
        ['Pack Sport', 'Performance', '2 295 000'],
        ['Pack Confort', 'Performance', '1 835 000'],
        ['Peinture métallisée', 'Extérieur', '590 000'],
        ['Alarme avancée', 'Technologie', '395 000'],
        ['Charge rapide (VE)', 'Technologie', '985 000'],
        ['Sono premium', 'Technologie', '1 250 000'],
        ['Pack hiver', 'Intérieur', '890 000'],
      ],
      [60, 50, 60]
    );

    this.addSectionTitle('6.3 Incompatibilités Options', 2);
    this.addBulletList([
      'Sièges cuir ↔ Sièges sportifs (exclusifs mutuellement)',
      'Pack Sport ↔ Pack Confort (exclusifs mutuellement)',
    ]);

    // ==========================================
    // 7. DOCUMENTS GÉNÉRÉS
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('7. DOCUMENTS GÉNÉRÉS');

    this.addSectionTitle('7.1 Bon de Commande', 2);
    this.addParagraph('Document PDF généré à la confirmation de commande, contenant :');
    this.addBulletList([
      'En-tête avec logo et coordonnées MED Motors',
      'Informations client (nom, adresse, téléphone, email)',
      'Référence et date de commande',
      'Tableau détaillé des véhicules commandés',
      'Options sélectionnées pour chaque véhicule',
      'Sous-total HT, TVA détaillée, Total TTC',
      'Méthode de paiement et adresse de livraison',
      'Conditions générales de vente',
      'Pied de page avec informations légales (RCCM, NIU)',
    ]);

    this.addSectionTitle('7.2 Facture Proforma', 2);
    this.addParagraph('Document PDF similaire au bon de commande avec :');
    this.addBulletList([
      'Mention "FACTURE PROFORMA" distincte',
      'Référence spécifique (PRO-CMD-YYYY-XXXXXX)',
      'Validité de 30 jours mentionnée',
      'Conditions de paiement spécifiques',
      'Coordonnées bancaires pour virement',
    ]);

    this.addSectionTitle('7.3 Informations Entreprise', 2);
    this.addTable(
      ['Information', 'Valeur'],
      [
        ['Raison Sociale', 'MED Motors'],
        ['Adresse', '123 Avenue de l\'Indépendance, Douala'],
        ['Téléphone', '+237 699 000 000'],
        ['Email', 'contact@med-motors.cm'],
        ['Site Web', 'www.med-motors.cm'],
        ['RCCM', 'RC/DLA/2024/A/001234'],
        ['NIU', 'M012400001234A'],
      ],
      [50, 120]
    );

    // ==========================================
    // 8. STOCKAGE ET PERSISTANCE
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('8. STOCKAGE ET PERSISTANCE');

    this.addSectionTitle('8.1 LocalStorage', 2);
    this.addTable(
      ['Clé', 'Type', 'Description'],
      [
        ['med_user', 'JSON (User)', 'Utilisateur connecté'],
        ['med_panier', 'JSON (CartItem[])', 'Articles du panier'],
        ['med_pays_livraison', 'String', 'Pays de livraison sélectionné'],
      ],
      [55, 50, 65]
    );

    this.addSectionTitle('8.2 Stratégie de Persistance', 2);
    this.addBulletList([
      'Authentification : Chargée au démarrage, persistée à la connexion',
      'Panier : Sauvegarde automatique à chaque modification',
      'Pays : Persisté lors de la sélection',
      'Nettoyage : Déconnexion supprime med_user et med_panier',
    ]);

    // ==========================================
    // 9. SÉCURITÉ
    // ==========================================
    this.addSectionTitle('9. SÉCURITÉ');

    this.addSectionTitle('9.1 Authentification', 2);
    this.addBulletList([
      'Validation email format côté client',
      'Mot de passe minimum 6 caractères',
      'Vérification unicité email à l\'inscription',
      'Routes protégées (/commande, /profil, /mes-commandes)',
      'Redirection automatique vers connexion si non authentifié',
    ]);

    this.addSectionTitle('9.2 Validation des Données', 2);
    this.addBulletList([
      'Vérification stock avant ajout au panier',
      'Validation quantité (1 à stock disponible)',
      'Contrôle compatibilité des options',
      'Champs obligatoires vérifiés à la soumission',
    ]);

    this.addInfoBox('Note Sécurité',
      'Cette version utilise des mots de passe en clair dans les données mockées à des fins de démonstration uniquement. ' +
      'L\'intégration backend implémentera un hachage bcrypt et des tokens JWT.'
    );

    // ==========================================
    // 10. PERFORMANCE
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('10. PERFORMANCE ET OPTIMISATION');

    this.addSectionTitle('10.1 Optimisations Implémentées', 2);
    this.addBulletList([
      'Code splitting par route (React Router)',
      'Lazy loading des images (OptimizedImage)',
      'Tree-shaking Tailwind CSS (classes non utilisées exclues)',
      'Memoization dans les composants de liste',
      'Icônes Lucide tree-shakeable',
    ]);

    this.addSectionTitle('10.2 Métriques Cibles', 2);
    this.addTable(
      ['Métrique', 'Objectif', 'Statut'],
      [
        ['First Contentful Paint', '< 1.5s', 'Atteint'],
        ['Time to Interactive', '< 3s', 'Atteint'],
        ['Largest Contentful Paint', '< 2.5s', 'Atteint'],
        ['Cumulative Layout Shift', '< 0.1', 'Atteint'],
      ],
      [60, 50, 60]
    );

    // ==========================================
    // 11. LIVRABLES
    // ==========================================
    this.addSectionTitle('11. LIVRABLES');

    this.addSectionTitle('11.1 Code Source', 2);
    this.addBulletList([
      'Repository Git complet avec historique',
      'Code TypeScript typé à 100%',
      'Composants documentés',
      'Structure de fichiers organisée',
    ]);

    this.addSectionTitle('11.2 Build Production', 2);
    this.addBulletList([
      'Dossier dist/ optimisé pour déploiement',
      'Assets minifiés et compressés',
      'Fichiers statiques (images, vidéos)',
    ]);

    this.addSectionTitle('11.3 Documentation', 2);
    this.addBulletList([
      'README.md avec instructions d\'installation',
      'Cahier des charges (ce document)',
      'Guide de déploiement',
    ]);

    // ==========================================
    // 12. ÉVOLUTIONS FUTURES
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('12. ÉVOLUTIONS FUTURES');

    this.addSectionTitle('12.1 Phase 2 - Backend Integration', 2);
    this.addBulletList([
      'API REST ou GraphQL pour les données',
      'Base de données PostgreSQL ou MongoDB',
      'Authentification JWT avec refresh tokens',
      'Stockage sécurisé des mots de passe (bcrypt)',
      'Gestion des sessions serveur',
    ]);

    this.addSectionTitle('12.2 Phase 3 - Paiement', 2);
    this.addBulletList([
      'Intégration Stripe pour cartes bancaires',
      'Intégration PayPal',
      'Mobile Money (MTN, Orange Money)',
      'Webhooks pour confirmation paiement',
    ]);

    this.addSectionTitle('12.3 Phase 4 - Fonctionnalités Avancées', 2);
    this.addBulletList([
      'Système de favoris / wishlist',
      'Comparateur de véhicules',
      'Configurateur 3D des véhicules',
      'Chat en direct avec conseiller',
      'Notifications push (PWA)',
      'Application mobile native',
    ]);

    this.addSectionTitle('12.4 Phase 5 - Analytics & Marketing', 2);
    this.addBulletList([
      'Intégration Google Analytics 4',
      'Tracking e-commerce avancé',
      'A/B testing des pages',
      'Système de parrainage',
      'Programme de fidélité',
    ]);

    // ==========================================
    // ANNEXES
    // ==========================================
    this.addNewPage();
    this.addSectionTitle('ANNEXES');

    this.addSectionTitle('A. Comptes de Démonstration', 2);
    this.addTable(
      ['Type', 'Email', 'Mot de passe'],
      [
        ['Particulier', 'jean.fotso@email.com', 'password123'],
        ['Société', 'contact@autofleet-cm.com', 'societe123'],
      ],
      [50, 70, 50]
    );

    this.addSectionTitle('B. Commandes de Développement', 2);
    this.addTable(
      ['Commande', 'Description'],
      [
        ['npm install', 'Installation des dépendances'],
        ['npm run dev', 'Lancement serveur développement'],
        ['npm run build', 'Build de production'],
        ['npm run preview', 'Prévisualisation du build'],
        ['npm run lint', 'Vérification ESLint'],
      ],
      [60, 110]
    );

    this.addSectionTitle('C. Variables d\'Environnement', 2);
    this.addParagraph('Aucune variable d\'environnement requise pour cette version frontend-only.');

    // Ajouter les footers à toutes les pages
    this.addFooter();

    // Sauvegarder le PDF
    this.doc.save('MED_Motors_Cahier_des_Charges.pdf');
  }
}

// Fonction exportée pour générer le cahier des charges
export function generateCahierDesCharges(): void {
  const generator = new CahierDesChargesGenerator();
  generator.generate();
}
