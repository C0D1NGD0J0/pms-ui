import React from "react";
import { create } from "zustand";
import { propertyService } from "@services/index";
import { createJSONStorage, persist } from "zustand/middleware";

interface PropertyFormStaticData {
  propertyTypes: string[];
  propertyStatuses: string[];
  occupancyStatuses: string[];
  documentTypes: string[];
  currencies: Array<{ value: string; label: string }>;
  specifications: {
    [key: string]: {
      type: string;
      isRequired: boolean;
      min: number;
    };
  };
}

interface UnitFormStaticData {
  unitTypes: Array<{ value: string; label: string }>;
  unitStatus: Array<{ value: string; label: string }>;
  unitAmenities: Array<{ value: string; label: string }>;
  unitUtilities: Array<{ value: string; label: string }>;
  currencies: Array<{ value: string; label: string }>;
  prefixOptions: Array<{
    value: string;
    label: string;
    example?: string;
  }>;
}

interface ClientFormStaticData {
  accountType: Array<{ value: string; label: string }>;
  idType: Array<{ value: string; label: string }>;
  timezones: Array<{ value: string; label: string }>;
}

interface AllStaticData {
  propertyForm: PropertyFormStaticData;
  unitForm: UnitFormStaticData;
  clientForm: ClientFormStaticData;
}

interface StaticDataState {
  lastFetched: number | null;
  data: AllStaticData | null;
  error: string | null;
  loading: boolean;
  actions: {
    clearCache: () => void;
    fetchAllStaticData: () => Promise<void>;
    isDataStale: (maxAge?: number) => boolean;
  };
}

const DEFAULT_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export const useFormStaticDataStore = create<StaticDataState>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      lastFetched: null,

      actions: {
        fetchAllStaticData: async () => {
          const state = get();
          if (state.loading) return;
          set({ loading: true, error: null });
          try {
            const staticData = await propertyService.getAllStaticData();
            set({
              data: staticData,
              loading: false,
              error: null,
              lastFetched: Date.now(),
            });
          } catch (error) {
            console.error("Failed to fetch static data:", error);
            set({
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch static data",
            });
          }
        },

        clearCache: () => {
          set({
            data: null,
            error: null,
            lastFetched: null,
          });
        },

        isDataStale: (maxAge = DEFAULT_CACHE_TTL) => {
          const state = get();
          if (!state.lastFetched) return true;
          return Date.now() - state.lastFetched > maxAge;
        },
      },
    }),
    {
      name: "static-data-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        data: state.data,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

export const usePropertyFormStaticData = () => {
  const { data, loading, error, actions } = useFormStaticDataStore();

  // Auto-fetch if no data and not currently loading
  React.useEffect(() => {
    if (!data && !loading && !error) {
      actions.fetchAllStaticData();
    }
    // Auto-refresh if data is stale
    else if (data && actions.isDataStale() && !loading) {
      actions.fetchAllStaticData();
    }
  }, [data, loading, error, actions]);

  return {
    data: {
      propertyTypes: data?.propertyForm?.propertyTypes || [],
      propertyStatuses: data?.propertyForm?.propertyStatuses || [],
      occupancyStatuses: data?.propertyForm?.occupancyStatuses || [],
      documentTypes: data?.propertyForm?.documentTypes || [],
      currencies: data?.propertyForm?.currencies || [],
      specifications: data?.propertyForm?.specifications || {},
    },
    loading,
    error,
    refetch: actions.fetchAllStaticData,
  };
};

export const useUnitFormStaticData = () => {
  const { data, loading, error, actions } = useFormStaticDataStore();

  React.useEffect(() => {
    if (!data && !loading && !error) {
      actions.fetchAllStaticData();
    } else if (data && actions.isDataStale() && !loading) {
      actions.fetchAllStaticData();
    }
  }, [data, loading, error, actions]);

  return {
    data: {
      unitTypes: data?.unitForm?.unitTypes || [],
      unitStatus: data?.unitForm?.unitStatus || [],
      unitAmenities: data?.unitForm?.unitAmenities || [],
      unitUtilities: data?.unitForm?.unitUtilities || [],
      currencies: data?.unitForm?.currencies || [],
      prefixOptions: data?.unitForm?.prefixOptions || [],
    },
    loading,
    error,
    refetch: actions.fetchAllStaticData,
  };
};

export const useClientFormStaticData = () => {
  const { data, loading, error, actions } = useFormStaticDataStore();

  // Auto-fetch if no data and not currently loading
  React.useEffect(() => {
    if (!data && !loading && !error) {
      actions.fetchAllStaticData();
    }
    // Auto-refresh if data is stale
    else if (data && actions.isDataStale() && !loading) {
      actions.fetchAllStaticData();
    }
  }, [data, loading, error, actions]);

  return {
    accountType: data?.clientForm?.accountType || [],
    idType: data?.clientForm?.idType || [],
    timezones: data?.clientForm?.timezones || [],
    loading,
    error,
    refetch: actions.fetchAllStaticData,
  };
};

export type {
  PropertyFormStaticData,
  UnitFormStaticData,
  ClientFormStaticData,
  AllStaticData,
};
