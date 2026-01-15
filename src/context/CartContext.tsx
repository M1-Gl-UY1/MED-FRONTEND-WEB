import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LignePanier, PaysLivraison } from '../data/mockData';
import {
  getVehiculeById,
  getOptionById,
  calculerPrixVehicule,
  calculerTotalOptions,
  calculerTaxes,
  verifierCompatibiliteOptions,
} from '../data/mockData';

export interface CartItem extends LignePanier {
  vehiculeNom: string;
  vehiculeImage: string;
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
  addToCart: (
    vehiculeId: number,
    quantite: number,
    optionsSelectionnees: number[],
    couleurSelectionnee: string
  ) => boolean;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantite: number) => void;
  updateOptions: (itemId: number, optionsSelectionnees: number[]) => void;
  clearCart: () => void;
  setPaysLivraison: (pays: PaysLivraison) => void;
  canAddOption: (itemId: number, optionId: number) => boolean;
  getIncompatibleOptions: (optionId: number, currentOptions: number[]) => number[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paysLivraison, setPaysLivraisonState] = useState<PaysLivraison>('CM');

  // Charger le panier depuis localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('med_panier');
    const storedPays = localStorage.getItem('med_pays_livraison');

    if (storedCart) {
      try {
        const parsedItems = JSON.parse(storedCart);
        setItems(parsedItems);
      } catch {
        localStorage.removeItem('med_panier');
      }
    }

    if (storedPays && ['CM', 'FR', 'US', 'NG'].includes(storedPays)) {
      setPaysLivraisonState(storedPays as PaysLivraison);
    }
  }, []);

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    localStorage.setItem('med_panier', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('med_pays_livraison', paysLivraison);
  }, [paysLivraison]);

  const calculateItemDetails = (
    vehiculeId: number,
    quantite: number,
    optionsSelectionnees: number[]
  ): Omit<CartItem, 'id' | 'couleurSelectionnee'> | null => {
    const vehicule = getVehiculeById(vehiculeId);
    if (!vehicule) return null;

    const prixUnitaire = calculerPrixVehicule(vehicule);
    const prixOptions = calculerTotalOptions(optionsSelectionnees);
    const sousTotal = (prixUnitaire + prixOptions) * quantite;

    return {
      vehiculeId,
      quantite,
      optionsSelectionnees,
      vehiculeNom: `${vehicule.marque} ${vehicule.nom}`,
      vehiculeImage: vehicule.image,
      prixUnitaire,
      prixOptions,
      sousTotal,
    };
  };

  const addToCart = (
    vehiculeId: number,
    quantite: number,
    optionsSelectionnees: number[],
    couleurSelectionnee: string
  ): boolean => {
    const vehicule = getVehiculeById(vehiculeId);
    if (!vehicule || vehicule.stock.quantite < quantite) return false;

    const itemDetails = calculateItemDetails(vehiculeId, quantite, optionsSelectionnees);
    if (!itemDetails) return false;

    const newItem: CartItem = {
      id: Date.now(),
      ...itemDetails,
      couleurSelectionnee,
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

        const vehicule = getVehiculeById(item.vehiculeId);
        if (!vehicule || vehicule.stock.quantite < quantite) return item;

        const sousTotal = (item.prixUnitaire + item.prixOptions) * quantite;
        return { ...item, quantite, sousTotal };
      })
    );
  };

  const updateOptions = (itemId: number, optionsSelectionnees: number[]) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;

        const prixOptions = calculerTotalOptions(optionsSelectionnees);
        const sousTotal = (item.prixUnitaire + prixOptions) * item.quantite;
        return { ...item, optionsSelectionnees, prixOptions, sousTotal };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const setPaysLivraison = (pays: PaysLivraison) => {
    setPaysLivraisonState(pays);
  };

  const canAddOption = (itemId: number, optionId: number): boolean => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    return verifierCompatibiliteOptions(optionId, item.optionsSelectionnees);
  };

  const getIncompatibleOptions = (optionId: number, currentOptions: number[]): number[] => {
    const option = getOptionById(optionId);
    if (!option) return [];
    return option.incompatibilites.filter(id => currentOptions.includes(id));
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
        addToCart,
        removeFromCart,
        updateQuantity,
        updateOptions,
        clearCart,
        setPaysLivraison,
        canAddOption,
        getIncompatibleOptions,
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
