import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Vehicule, Option } from '../services/types';
import { vehiculeService } from '../services';

export type PaysLivraison = 'CM' | 'FR' | 'US' | 'NG';

// Taux de TVA par pays
const TAUX_TVA: Record<PaysLivraison, number> = {
  CM: 0.1925, // 19.25% Cameroun
  FR: 0.20,   // 20% France
  US: 0.08,   // 8% USA (moyenne)
  NG: 0.075,  // 7.5% Nigeria
};

export interface CartItem {
  id: number;
  vehicule: Vehicule;
  quantite: number;
  optionsSelectionnees: Option[];
  couleurSelectionnee: string;
  prixUnitaire: number;
  prixOptions: number;
  sousTotal: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxes: number;
  total: number;
  paysLivraison: PaysLivraison;
  isLoading: boolean;
  addToCart: (
    vehicule: Vehicule,
    quantite: number,
    optionsSelectionnees: Option[],
    couleurSelectionnee: string
  ) => boolean;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantite: number) => void;
  clearCart: () => void;
  setPaysLivraison: (pays: PaysLivraison) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Calculer le prix du véhicule (avec réduction si solde)
const calculerPrixVehicule = (vehicule: Vehicule): number => {
  if (vehicule.solde && vehicule.facteurReduction && vehicule.facteurReduction > 0) {
    return vehicule.prixBase * (1 - vehicule.facteurReduction);
  }
  return vehicule.prixBase;
};

// Calculer le total des options
const calculerTotalOptions = (options: Option[]): number => {
  return options.reduce((sum, opt) => sum + opt.prix, 0);
};

// Calculer les taxes
const calculerTaxes = (montant: number, pays: PaysLivraison): number => {
  return Math.round(montant * TAUX_TVA[pays]);
};

// Structure pour localStorage (sans les objets complets)
interface StoredCartItem {
  id: number;
  vehiculeId: number;
  quantite: number;
  optionIds: number[];
  couleurSelectionnee: string;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paysLivraison, setPaysLivraisonState] = useState<PaysLivraison>('CM');
  const [isLoading, setIsLoading] = useState(true);

  // Charger le panier depuis localStorage et récupérer les données à jour
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = localStorage.getItem('med_panier_v2');
      const storedPays = localStorage.getItem('med_pays_livraison');

      if (storedPays && ['CM', 'FR', 'US', 'NG'].includes(storedPays)) {
        setPaysLivraisonState(storedPays as PaysLivraison);
      }

      if (storedCart) {
        try {
          const storedItems: StoredCartItem[] = JSON.parse(storedCart);
          const loadedItems: CartItem[] = [];

          for (const stored of storedItems) {
            try {
              // Récupérer le véhicule à jour depuis l'API
              const vehicule = await vehiculeService.getById(stored.vehiculeId);

              // Récupérer les options sélectionnées
              const optionsSelectionnees = (vehicule.options || []).filter(
                opt => stored.optionIds.includes(opt.idOption)
              );

              const prixUnitaire = calculerPrixVehicule(vehicule);
              const prixOptions = calculerTotalOptions(optionsSelectionnees);
              const sousTotal = (prixUnitaire + prixOptions) * stored.quantite;

              loadedItems.push({
                id: stored.id,
                vehicule,
                quantite: stored.quantite,
                optionsSelectionnees,
                couleurSelectionnee: stored.couleurSelectionnee,
                prixUnitaire,
                prixOptions,
                sousTotal,
              });
            } catch (err) {
              // Véhicule non trouvé, on l'ignore
              console.warn(`Véhicule ${stored.vehiculeId} non trouvé, retiré du panier`);
            }
          }

          setItems(loadedItems);
        } catch {
          localStorage.removeItem('med_panier_v2');
        }
      }

      setIsLoading(false);
    };

    loadCart();
  }, []);

  // Sauvegarder le panier dans localStorage (seulement les IDs)
  useEffect(() => {
    if (!isLoading) {
      const storedItems: StoredCartItem[] = items.map(item => ({
        id: item.id,
        vehiculeId: item.vehicule.idVehicule,
        quantite: item.quantite,
        optionIds: item.optionsSelectionnees.map(opt => opt.idOption),
        couleurSelectionnee: item.couleurSelectionnee,
      }));
      localStorage.setItem('med_panier_v2', JSON.stringify(storedItems));
    }
  }, [items, isLoading]);

  useEffect(() => {
    localStorage.setItem('med_pays_livraison', paysLivraison);
  }, [paysLivraison]);

  const addToCart = (
    vehicule: Vehicule,
    quantite: number,
    optionsSelectionnees: Option[],
    couleurSelectionnee: string
  ): boolean => {
    const stockQty = vehicule.stock?.quantite || 0;
    if (stockQty < quantite) return false;

    const prixUnitaire = calculerPrixVehicule(vehicule);
    const prixOptions = calculerTotalOptions(optionsSelectionnees);
    const sousTotal = (prixUnitaire + prixOptions) * quantite;

    const newItem: CartItem = {
      id: Date.now(),
      vehicule,
      quantite,
      optionsSelectionnees,
      couleurSelectionnee,
      prixUnitaire,
      prixOptions,
      sousTotal,
    };

    setItems(prev => [...prev, newItem]);
    return true;
  };

  const removeFromCart = (itemId: number) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantite: number) => {
    if (quantite < 1) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;

        const stockQty = item.vehicule.stock?.quantite || 0;
        if (stockQty < quantite) return item;

        const sousTotal = (item.prixUnitaire + item.prixOptions) * quantite;
        return { ...item, quantite, sousTotal };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const setPaysLivraison = (pays: PaysLivraison) => {
    setPaysLivraisonState(pays);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0);
  const subtotal = items.reduce((sum, item) => sum + item.sousTotal, 0);
  const taxes = calculerTaxes(subtotal, paysLivraison);
  const total = subtotal + taxes;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        taxes,
        total,
        paysLivraison,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setPaysLivraison,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
