# MED Auto - Frontend Web Client

Application web client pour MED Auto, une plateforme de vente de vehicules premium.

## Technologies

- **React 19** avec TypeScript
- **Vite** pour le bundling et le dev server
- **Tailwind CSS 4** pour le styling
- **React Router DOM** pour la navigation
- **Axios** pour les requetes HTTP
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
Echelle de spacing coherente basee sur Material Design :
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

## Authentification JWT

### Configuration

L'application utilise l'authentification JWT avec le backend Spring Boot.

Variables d'environnement (`.env`) :
```env
# Production (Backend deploye sur Render)
VITE_API_BASE_URL=https://med-backend-zk8z.onrender.com
VITE_API_TIMEOUT=30000

# Developpement local (decommenter si necessaire)
# VITE_API_BASE_URL=http://localhost:8085
```

### Service d'authentification

Le service `auth.service.ts` gere :
- **Login unifie** via `/api/auth/login` (Client ou Societe)
- **Stockage du token** dans localStorage (`med_auth_token`)
- **Validation du token** au chargement via `/api/auth/me`
- **Rafraichissement du token** via `/api/auth/refresh`
- **Inscription** Client ou Societe

### Utilisation dans les composants

```tsx
import { useAuth } from '../context/AuthContext';

function MonComposant() {
  const { user, isAuthenticated, login, logout, register } = useAuth();

  const handleLogin = async () => {
    const success = await login('email@example.com', 'password');
    if (success) {
      // Utilisateur connecte
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Bienvenue {user?.nom}</p>
          <button onClick={logout}>Deconnexion</button>
        </>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

### Token automatique dans les requetes

Le token est automatiquement ajoute aux requetes via l'intercepteur Axios :

```typescript
// api.ts
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Gestion des erreurs 401

En cas de token invalide/expire, l'utilisateur est redirige vers `/connexion`.

## Structure du projet

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   ├── sections/        # Sections de pages (Hero, Features...)
│   └── ui/              # Composants reutilisables
├── context/
│   ├── AuthContext.tsx  # Authentification (JWT)
│   └── CartContext.tsx  # Panier
├── lib/
│   └── utils.ts         # Utilitaires (formatPrice, formatDate, etc.)
├── pages/               # Pages de l'application
├── services/
│   ├── api.ts           # Configuration Axios + token
│   ├── auth.service.ts  # Service authentification
│   ├── vehicule.service.ts
│   ├── commande.service.ts
│   ├── panier.service.ts
│   └── types.ts         # Types TypeScript
└── index.css            # Styles globaux Tailwind
```

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

## Demarrage

L'application demarre sur `http://localhost:5173`

> **Note** : Le frontend admin (MED-ADMIN) utilise le port 5174 pour eviter les conflits.

### Mode Production (Backend en ligne)
Le backend est deploye sur Render : `https://med-backend-zk8z.onrender.com`

1. Lancer le frontend : `npm run dev`
2. L'application se connecte automatiquement au backend en ligne
3. L'authentification JWT est active

### Mode Developpement Local
Pour utiliser un backend local :
1. Modifier `.env` : `VITE_API_BASE_URL=http://localhost:8085`
2. Demarrer le backend Spring Boot sur le port 8085
3. Lancer le frontend : `npm run dev`

### Gestion des erreurs
Si le backend n'est pas disponible, l'application affiche des messages d'erreur clairs a l'utilisateur lui demandant de verifier sa connexion internet ou de reessayer plus tard.

## Comptes de demonstration

Creer un compte via l'interface d'inscription ou utiliser un compte existant en base de donnees.

## Calcul des taxes

TVA par pays de livraison :
- Cameroun : 19.25%
- France : 20%
- Etats-Unis : 8%
- Nigeria : 7.5%

## Devise

L'application utilise le Franc CFA (XAF) comme devise.
Format : `XX XXX XXX FCFA`

## Routes

| Route | Page | Acces |
|-------|------|-------|
| `/` | Accueil | Public |
| `/catalogue` | Catalogue | Public |
| `/vehicule/:id` | Detail vehicule | Public |
| `/panier` | Panier | Public |
| `/checkout` | Validation commande | Authentifie |
| `/commandes` | Mes commandes | Authentifie |
| `/profil` | Mon profil | Authentifie |
| `/connexion` | Connexion/Inscription | Public |
| `/documents/:id` | Documents commande | Authentifie |

## Alignement des types avec le backend

Les types TypeScript (`src/services/types.ts`) sont alignes avec les entites du backend Spring Boot :

### StatutCommande
```typescript
type StatutCommande = 'ACTIF' | 'CONVERTI' | 'VALIDEE' | 'REFUSEE';
```

### TypeMethodePaiement
```typescript
type TypeMethodePaiement = 'CARTE_BANCAIRE' | 'PAYPAL' | 'COMPTANT' | 'CREDIT';
```

### Mapping des proprietes
| Frontend | Backend | Description |
|----------|---------|-------------|
| `idUtilisateur` | `id_utilisateur` | ID utilisateur (Client/Societe) |
| `numeroTaxe` | `numero_taxe` | Numero fiscal (Societe) |
| `sexe` | `sexe` | Genre (M/F) |
| `date` | `date_commande` | Date de commande |
| `total` | `total` | Montant TTC |
| `taxe` | `taxe` | Montant taxes |
| `typePaiement` | `type_paiement` | Mode de paiement |
| `lignesCommandes` | `lignes_commandes` | Lignes de commande |
| `optionsAchetees` | `options_achetees` | Options achetees |
| `optionsIncompatible` | `options_incompatible` | Options incompatibles |

### Couleurs des statuts
| Statut | Couleur | Label |
|--------|---------|-------|
| `ACTIF` | warning (jaune) | En cours |
| `CONVERTI` | info (bleu) | Convertie |
| `VALIDEE` | success (vert) | Validee |
| `REFUSEE` | error (rouge) | Refusee |
