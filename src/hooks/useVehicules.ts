import { useMemo, useCallback } from 'react';
import { useFetch } from './useFetch';
import { vehiculeService } from '../services';
import type { Vehicule, Option, VehiculeFilters } from '../services/types';

/**
 * Hook pour récupérer tous les véhicules
 */
export function useVehicules(filters?: VehiculeFilters) {
  const fetchFn = useCallback(async () => {
    if (filters) {
      return vehiculeService.search(filters);
    }
    return vehiculeService.getAllCustom();
  }, [filters]);

  const { data, loading, error, refetch } = useFetch<Vehicule[]>(
    fetchFn,
    [JSON.stringify(filters)]
  );

  return {
    vehicules: data || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer un véhicule par son ID
 */
export function useVehicule(id: number | undefined) {
  const fetchFn = useCallback(async () => {
    if (!id) throw new Error('ID requis');
    return vehiculeService.getById(id);
  }, [id]);

  const { data, loading, error, refetch } = useFetch<Vehicule>(
    fetchFn,
    [id],
    { enabled: !!id }
  );

  return {
    vehicule: data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les options
 */
export function useOptions() {
  const { data, loading, error, refetch } = useFetch<Option[]>(
    vehiculeService.getOptions,
    []
  );

  return {
    options: data || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les véhicules en promotion
 */
export function usePromotions() {
  const { data, loading, error, refetch } = useFetch<Vehicule[]>(
    vehiculeService.getPromotions,
    []
  );

  return {
    promotions: data || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les marques
 */
export function useMarques() {
  const { data, loading, error, refetch } = useFetch<string[]>(
    vehiculeService.getMarques,
    []
  );

  return {
    marques: data || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour la gestion des options avec compatibilité
 */
export function useOptionsCompatibilite(options: Option[]) {
  const verifierCompatibilite = useCallback(
    (optionId: number, optionsSelectionnees: number[]): boolean => {
      return vehiculeService.verifierCompatibilite(optionId, optionsSelectionnees, options);
    },
    [options]
  );

  const getOptionsIncompatibles = useCallback(
    (optionId: number): number[] => {
      return vehiculeService.getOptionsIncompatibles(optionId, options);
    },
    [options]
  );

  const optionsParCategorie = useMemo(() => {
    const grouped: Record<string, Option[]> = {};
    options.forEach(opt => {
      if (!grouped[opt.categorie]) {
        grouped[opt.categorie] = [];
      }
      grouped[opt.categorie].push(opt);
    });
    return grouped;
  }, [options]);

  return {
    verifierCompatibilite,
    getOptionsIncompatibles,
    optionsParCategorie,
  };
}

export default useVehicules;
