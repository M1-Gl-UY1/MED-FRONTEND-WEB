import { jsPDF } from 'jspdf';

// Formatter le prix - version compacte pour PDF (sans devise pour les colonnes)
const formatPriceShort = (price: number): string => {
  const value = price || 0;
  // Pour les très grands montants, utiliser une notation compacte
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} Mrd`;
  }
  if (value >= 100000000) {
    return `${(value / 1000000).toFixed(0)} M`;
  }
  if (value >= 10000000) {
    return `${(value / 1000000).toFixed(1)} M`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} M`;
  }
  // Format avec séparateur de milliers (sans devise)
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatter le prix complet pour les totaux (toujours avec devise)
const formatPriceFull = (price: number): string => {
  const value = price || 0;
  // Pour les très grands montants dans les totaux
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)} Mrd XAF`;
  }
  if (value >= 100000000) {
    return `${(value / 1000000).toFixed(1)} M XAF`;
  }
  if (value >= 10000000) {
    return `${(value / 1000000).toFixed(2)} M XAF`;
  }
  // Format standard avec séparateur
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' XAF';
};

// Types pour la génération de PDF
interface ClientInfo {
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  pays: string;
  type: 'CLIENT' | 'SOCIETE';
  numeroTaxe?: string;
}

interface VehicleItem {
  nom: string;
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
  quantite: number;
  prixUnitaireHT: number;
  options?: { nom: string; prix: number }[];
}

interface OrderInfo {
  reference: string;
  date: string;
  paysLivraison: string;
  adresseLivraison: string;
  typePaiement: string;
}

// Couleurs de la marque
const COLORS = {
  primary: [26, 26, 46] as [number, number, number],      // #1A1A2E
  secondary: [201, 162, 39] as [number, number, number],  // #C9A227
  gray: [108, 117, 125] as [number, number, number],      // #6C757D
  lightGray: [248, 249, 250] as [number, number, number], // #F8F9FA
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
};

// Informations de l'entreprise
const COMPANY_INFO = {
  name: 'MED Auto',
  slogan: 'L\'Excellence Automobile',
  address: '123 Avenue de l\'Indépendance',
  city: 'Douala, Cameroun',
  phone: '+237 699 000 000',
  email: 'contact@med-auto.cm',
  website: 'www.med-auto.cm',
  rccm: 'RC/DLA/2024/A/001234',
  niu: 'M012400001234A',
};

// Fonction utilitaire pour formater la date
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Fonction utilitaire pour obtenir le label du pays
function getPaysLabel(code: string): string {
  const pays: Record<string, string> = {
    CM: 'Cameroun',
    FR: 'France',
    US: 'États-Unis',
    NG: 'Nigeria',
  };
  return pays[code] || code;
}

// Fonction utilitaire pour obtenir le label du mode de paiement
function getMethodePaiementLabel(code: string): string {
  const methodes: Record<string, string> = {
    CARTE_BANCAIRE: 'Carte Bancaire',
    PAYPAL: 'PayPal',
    COMPTANT: 'Paiement Comptant',
    CREDIT: 'Crédit',
  };
  return methodes[code] || code;
}

// Classe principale pour la génération de PDF
class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  // Dessiner l'en-tête
  private drawHeader(title: string, subtitle: string): void {
    // Bande de couleur en haut
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, 45, 'F');

    // Logo/Nom de l'entreprise
    this.doc.setTextColor(...COLORS.secondary);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(COMPANY_INFO.name, this.margin, 18);

    // Slogan
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text(COMPANY_INFO.slogan, this.margin, 26);

    // Informations de contact (à droite)
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    const rightX = this.pageWidth - this.margin;
    this.doc.text(COMPANY_INFO.phone, rightX, 15, { align: 'right' });
    this.doc.text(COMPANY_INFO.email, rightX, 20, { align: 'right' });
    this.doc.text(COMPANY_INFO.website, rightX, 25, { align: 'right' });

    // Titre du document
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 38);

    // Sous-titre
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(subtitle, rightX, 38, { align: 'right' });

    this.currentY = 55;
  }

  // Dessiner une section d'information
  private drawInfoSection(
    leftTitle: string,
    leftContent: string[],
    rightTitle: string,
    rightContent: string[]
  ): void {
    const boxWidth = (this.pageWidth - this.margin * 3) / 2;
    const startY = this.currentY;

    // Boîte gauche
    this.doc.setFillColor(...COLORS.lightGray);
    this.doc.roundedRect(this.margin, startY, boxWidth, 45, 3, 3, 'F');

    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(leftTitle, this.margin + 5, startY + 8);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.gray);
    leftContent.forEach((line, index) => {
      this.doc.text(line, this.margin + 5, startY + 16 + index * 5);
    });

    // Boîte droite
    const rightX = this.margin * 2 + boxWidth;
    this.doc.setFillColor(...COLORS.lightGray);
    this.doc.roundedRect(rightX, startY, boxWidth, 45, 3, 3, 'F');

    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(rightTitle, rightX + 5, startY + 8);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...COLORS.gray);
    rightContent.forEach((line, index) => {
      this.doc.text(line, rightX + 5, startY + 16 + index * 5);
    });

    this.currentY = startY + 52;
  }

  // Dessiner le tableau des articles
  private drawItemsTable(items: VehicleItem[], tauxTVA: number): { subtotal: number; tva: number; total: number } {
    const startY = this.currentY;
    const tableWidth = this.pageWidth - this.margin * 2;
    // Colonnes: Description (flexible), Qté (petit), Prix Unit (moyen), Total (moyen)
    const colWidths = [70, 12, 44, 44]; // Total = 170mm sur 210mm - 40mm marges

    // En-tête du tableau
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(this.margin, startY, tableWidth, 10, 'F');

    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');

    let xPos = this.margin + 2;
    this.doc.text('Description', xPos, startY + 7);
    xPos += colWidths[0];
    this.doc.text('Qté', xPos, startY + 7);
    xPos += colWidths[1];
    this.doc.text('Prix Unit. HT', xPos, startY + 7);
    xPos += colWidths[2];
    this.doc.text('Total HT', xPos, startY + 7);

    // Lignes du tableau
    let currentRowY = startY + 10;
    let subtotal = 0;

    items.forEach((item, index) => {
      const rowHeight = 20 + (item.options?.length || 0) * 4;
      const lineTotal = item.prixUnitaireHT * item.quantite;
      subtotal += lineTotal;

      // Fond alterné
      if (index % 2 === 0) {
        this.doc.setFillColor(252, 252, 252);
        this.doc.rect(this.margin, currentRowY, tableWidth, rowHeight, 'F');
      }

      // Bordure
      this.doc.setDrawColor(230, 230, 230);
      this.doc.rect(this.margin, currentRowY, tableWidth, rowHeight, 'S');

      this.doc.setTextColor(...COLORS.primary);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');

      xPos = this.margin + 2;
      // Tronquer le nom si trop long
      const nomComplet = `${item.marque} ${item.nom}`;
      const nomTronque = nomComplet.length > 30 ? nomComplet.substring(0, 28) + '...' : nomComplet;
      this.doc.text(nomTronque, xPos, currentRowY + 6);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLORS.gray);
      this.doc.text(`${item.modele} - ${item.annee}`, xPos, currentRowY + 11);
      this.doc.text(`Couleur: ${item.couleur}`, xPos, currentRowY + 16);

      // Options
      if (item.options && item.options.length > 0) {
        item.options.forEach((opt, optIndex) => {
          this.doc.setFontSize(7);
          this.doc.text(`+ ${opt.nom} (${formatPriceShort(opt.prix)})`, xPos + 2, currentRowY + 20 + optIndex * 4);
        });
      }

      // Quantité (centrée dans sa colonne)
      xPos = this.margin + 2 + colWidths[0];
      this.doc.setTextColor(...COLORS.primary);
      this.doc.setFontSize(9);
      this.doc.text(item.quantite.toString(), xPos + 4, currentRowY + 10);

      // Prix unitaire (aligné à droite dans sa colonne)
      xPos += colWidths[1];
      const prixUnitEnd = xPos + colWidths[2] - 2;
      this.doc.text(formatPriceShort(item.prixUnitaireHT), prixUnitEnd, currentRowY + 10, { align: 'right' });

      // Total ligne (aligné à droite dans sa colonne)
      xPos += colWidths[2];
      const totalEnd = xPos + colWidths[3] - 2;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(formatPriceShort(lineTotal), totalEnd, currentRowY + 10, { align: 'right' });

      currentRowY += rowHeight;
    });

    // Totaux
    const totalsStartY = currentRowY + 5;
    const totalsWidth = 88; // Largeur des colonnes prix
    const totalsX = this.pageWidth - this.margin - totalsWidth;
    const tva = subtotal * (tauxTVA / 100);
    const total = subtotal + tva;

    // Sous-total HT
    this.doc.setFillColor(...COLORS.lightGray);
    this.doc.rect(totalsX, totalsStartY, totalsWidth, 9, 'F');
    this.doc.setTextColor(...COLORS.gray);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Sous-total HT', totalsX + 3, totalsStartY + 6);
    // Valeur alignée à droite avec padding
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(formatPriceFull(subtotal), totalsX + totalsWidth - 4, totalsStartY + 6, { align: 'right' });

    // TVA
    this.doc.setFont('helvetica', 'normal');
    this.doc.rect(totalsX, totalsStartY + 9, totalsWidth, 9, 'F');
    this.doc.text(`TVA (${tauxTVA}%)`, totalsX + 3, totalsStartY + 15);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(formatPriceFull(tva), totalsX + totalsWidth - 4, totalsStartY + 15, { align: 'right' });

    // Total TTC - boîte plus haute pour le montant principal
    this.doc.setFillColor(...COLORS.secondary);
    this.doc.rect(totalsX, totalsStartY + 18, totalsWidth, 14, 'F');
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TOTAL TTC', totalsX + 3, totalsStartY + 27);
    this.doc.setFontSize(11);
    this.doc.text(formatPriceFull(total), totalsX + totalsWidth - 4, totalsStartY + 27, { align: 'right' });

    this.currentY = totalsStartY + 40;

    return { subtotal, tva, total };
  }

  // Dessiner les conditions et mentions légales
  private drawFooter(type: 'BON_COMMANDE' | 'FACTURE_PROFORMA'): void {
    const startY = this.currentY + 5;

    // Titre section
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(this.margin, startY, this.pageWidth - this.margin * 2, 8, 'F');
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CONDITIONS ET MENTIONS LÉGALES', this.margin + 3, startY + 6);

    // Contenu
    this.doc.setTextColor(...COLORS.gray);
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');

    const conditions = type === 'BON_COMMANDE' ? [
      '1. Ce bon de commande constitue un engagement ferme et définitif après signature.',
      '2. Un acompte de 30% est requis à la commande. Le solde est dû à la livraison.',
      '3. Délai de livraison estimé : 2 à 6 semaines selon disponibilité du véhicule.',
      '4. La garantie constructeur s\'applique selon les conditions du fabricant.',
      '5. Toute annulation après validation entraîne des frais de 10% du montant total.',
    ] : [
      '1. Cette facture proforma est un document informatif et ne constitue pas une facture définitive.',
      '2. Les prix indiqués sont valables 30 jours à compter de la date d\'émission.',
      '3. La facture définitive sera émise après confirmation de la commande et paiement.',
      '4. TVA applicable selon la réglementation du pays de livraison.',
      '5. Document non comptable - À usage informatif uniquement.',
    ];

    conditions.forEach((line, index) => {
      this.doc.text(line, this.margin + 3, startY + 14 + index * 4);
    });

    // Pied de page
    const footerY = this.pageHeight - 15;
    this.doc.setDrawColor(...COLORS.secondary);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);

    this.doc.setTextColor(...COLORS.gray);
    this.doc.setFontSize(7);
    this.doc.text(
      `${COMPANY_INFO.name} - RCCM: ${COMPANY_INFO.rccm} - NIU: ${COMPANY_INFO.niu}`,
      this.pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    this.doc.text(
      `${COMPANY_INFO.address}, ${COMPANY_INFO.city} | ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}`,
      this.pageWidth / 2,
      footerY + 4,
      { align: 'center' }
    );
  }

  // Générer un bon de commande
  public generateBonCommande(
    client: ClientInfo,
    order: OrderInfo,
    items: VehicleItem[],
    tauxTVA: number
  ): void {
    // En-tête
    this.drawHeader(
      'BON DE COMMANDE',
      `N° ${order.reference} | ${formatDate(order.date)}`
    );

    // Informations client et commande
    const clientContent = client.type === 'CLIENT'
      ? [
          `${client.prenom} ${client.nom}`,
          client.email,
          client.telephone,
          client.adresse,
          `${client.ville}, ${client.pays}`,
        ]
      : [
          client.nom,
          `N° Fiscal: ${client.numeroTaxe}`,
          client.email,
          client.telephone,
          `${client.ville}, ${client.pays}`,
        ];

    const orderContent = [
      `Référence: ${order.reference}`,
      `Date: ${formatDate(order.date)}`,
      `Livraison: ${getPaysLabel(order.paysLivraison)}`,
      `Adresse: ${order.adresseLivraison}`,
      `Paiement: ${getMethodePaiementLabel(order.typePaiement)}`,
    ];

    this.drawInfoSection(
      client.type === 'CLIENT' ? 'INFORMATIONS CLIENT' : 'INFORMATIONS SOCIÉTÉ',
      clientContent,
      'DÉTAILS COMMANDE',
      orderContent
    );

    // Tableau des articles
    this.drawItemsTable(items, tauxTVA);

    // Pied de page
    this.drawFooter('BON_COMMANDE');

    // Télécharger
    this.doc.save(`BonCommande_${order.reference}.pdf`);
  }

  // Générer une facture proforma
  public generateFactureProforma(
    client: ClientInfo,
    order: OrderInfo,
    items: VehicleItem[],
    tauxTVA: number
  ): void {
    // En-tête
    this.drawHeader(
      'FACTURE PROFORMA',
      `N° PRO-${order.reference} | ${formatDate(order.date)}`
    );

    // Informations client et commande
    const clientContent = client.type === 'CLIENT'
      ? [
          `${client.prenom} ${client.nom}`,
          client.email,
          client.telephone,
          client.adresse,
          `${client.ville}, ${client.pays}`,
        ]
      : [
          client.nom,
          `N° Fiscal: ${client.numeroTaxe}`,
          client.email,
          client.telephone,
          `${client.ville}, ${client.pays}`,
        ];

    const orderContent = [
      `Référence: PRO-${order.reference}`,
      `Date d'émission: ${formatDate(order.date)}`,
      `Validité: 30 jours`,
      `Destination: ${getPaysLabel(order.paysLivraison)}`,
      `Mode de paiement: ${getMethodePaiementLabel(order.typePaiement)}`,
    ];

    this.drawInfoSection(
      client.type === 'CLIENT' ? 'DESTINATAIRE' : 'SOCIÉTÉ DESTINATAIRE',
      clientContent,
      'INFORMATIONS PROFORMA',
      orderContent
    );

    // Tableau des articles
    this.drawItemsTable(items, tauxTVA);

    // Pied de page
    this.drawFooter('FACTURE_PROFORMA');

    // Télécharger
    this.doc.save(`FactureProforma_PRO-${order.reference}.pdf`);
  }
}

// Fonctions exportées pour générer les PDFs
export function generateBonCommande(
  client: ClientInfo,
  order: OrderInfo,
  items: VehicleItem[],
  tauxTVA: number = 19.25
): void {
  const generator = new PDFGenerator();
  generator.generateBonCommande(client, order, items, tauxTVA);
}

export function generateFactureProforma(
  client: ClientInfo,
  order: OrderInfo,
  items: VehicleItem[],
  tauxTVA: number = 19.25
): void {
  const generator = new PDFGenerator();
  generator.generateFactureProforma(client, order, items, tauxTVA);
}

export type { ClientInfo, VehicleItem, OrderInfo };
