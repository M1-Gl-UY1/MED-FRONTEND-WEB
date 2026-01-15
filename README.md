# MED Motors - Frontend Web Client

Application web client pour MED Motors, une plateforme de vente de vehicules premium.

## Technologies

- **React 19** avec TypeScript
- **Vite** pour le bundling et le dev server
- **Tailwind CSS 4** pour le styling
- **React Router DOM** pour la navigation
- **Lucide React** pour les icones

## Fonctionnalites

### Pages principales
- **Accueil** - Hero, vehicules vedettes, categories, partenaires
- **Catalogue** - Liste des vehicules avec filtres et pagination
- **Detail vehicule** - Specifications, options, galerie d'images
- **Panier** - Gestion du panier avec calcul des taxes par pays
- **Commande** - Processus de checkout en 3 etapes
- **Authentification** - Connexion et inscription (Particulier/Societe)
- **Profil** - Gestion du compte utilisateur
- **Mes commandes** - Historique et suivi des commandes

### Design System

#### Theme Premium
- **Couleur primaire** : Navy (#1A1A2E)
- **Couleur secondaire** : Gold (#C9A227)
- **Typographie** : Inter (Google Fonts)

#### Espacements Material Design
Echelle de spacing cohérente basée sur Material Design :
- `4px` (xs) - micro espacements
- `8px` (sm) - espacements petits
- `12px` (md) - espacements moyens
- `16px` (base) - espacement de base
- `24px` (lg) - grands espacements
- `32px` (xl) - tres grands espacements
- `48px` (2xl) - sections
- `64px` (3xl) - grandes sections

#### Mobile-First & Accessibilite
- Design responsive avec breakpoints : `sm (640px)`, `md (768px)`, `lg (1024px)`, `xl (1280px)`
- Touch targets minimum de `48px` pour l'accessibilite mobile
- Navigation accessible avec ARIA labels

### Gestion d'etat
- **AuthContext** - Authentification utilisateur
- **CartContext** - Panier avec persistance localStorage

### Donnees
L'application utilise des donnees mock pour la demonstration :
- Vehicules (SUV, Berlines, Utilitaires)
- Options (Packs, Equipements)
- Utilisateurs (Clients, Societes)
- Commandes et documents

### Calcul des taxes
TVA par pays de livraison :
- Cameroun : 19.25%
- France : 20%
- Etats-Unis : 8%
- Nigeria : 7.5%

## Installation

```bash
# Installer les dependances
npm install

# Lancer le serveur de developpement
npm run dev

# Build pour la production
npm run build

# Preview du build
npm run preview
```

## Structure du projet

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # Composants reutilisables
├── context/             # Contextes React (Auth, Cart)
├── data/                # Donnees mock
├── lib/                 # Utilitaires
├── pages/               # Pages de l'application
└── index.css            # Styles globaux Tailwind
```

## Comptes de demonstration

### Particulier
- Email : `jean.fotso@email.com`
- Mot de passe : `password123`

### Societe
- Email : `contact@autofleet-cm.com`
- Mot de passe : `societe123`

## Devise

L'application utilise le Franc CFA (XAF) comme devise.
Format : `XX XXX XXX FCFA`
