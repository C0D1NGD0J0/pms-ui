"use client";

import { useAuth } from "@store/auth.store";
import { useEntitlementsUsage } from "@hooks/useEntitlementsUsage";
import React, { createContext, useContext, ReactNode, useMemo } from "react";

interface UsageInfo {
  current: number;
  limit: number;
  remaining: number;
  percentage: number;
  isNearLimit: boolean;
}

interface EntitlementsContextValue {
  // Data
  features: Record<string, boolean>;
  limits: { properties: number; units: number; seats: number };
  usage: { properties: number; units: number; seats: number };
  status: string;
  isLoading: boolean;

  // Helpers
  hasFeature: (feature: string) => boolean;
  canCreate: (resource: "property" | "unit" | "user") => boolean;
  isLimitReached: (resource: "property" | "unit" | "user") => boolean;
  getUsageInfo: (resource: "property" | "unit" | "user") => UsageInfo;
  showUpgradeModal: (reason: string) => void;
}

// ============================================================================
// DEFAULTS
// ============================================================================

const DEFAULT_LIMITS = {
  properties: 1,
  units: 1,
  seats: 1,
};

const DEFAULT_USAGE = {
  properties: 0,
  units: 0,
  seats: 0,
};

// ============================================================================
// CONTEXT
// ============================================================================

const EntitlementsContext = createContext<EntitlementsContextValue | null>(
  null
);

interface EntitlementsProviderProps {
  children: ReactNode;
}

export function EntitlementsProvider({ children }: EntitlementsProviderProps) {
  const { user, client } = useAuth();
  const {
    data: usageData,
    isLoading,
    error,
  } = useEntitlementsUsage(client?.cuid);

  const value: EntitlementsContextValue = useMemo(() => {
    // Extract data from currentUser and usage API
    const features = user?.subscription?.features || {};
    const limits =
      usageData?.data?.limits || (usageData as any)?.limits || DEFAULT_LIMITS;
    const usage =
      usageData?.data?.usage || (usageData as any)?.usage || DEFAULT_USAGE;
    const status = user?.subscription?.status || "inactive";

    // Helper: Check if user has a specific feature
    const hasFeature = (feature: string): boolean => {
      return features[feature] === true;
    };

    // Helper: Check if user can create a new resource
    const canCreate = (resource: "property" | "unit" | "user"): boolean => {
      // Block if account is canceled or past due
      if (status === "canceled" || status === "past_due") {
        return false;
      }

      // Map resource to data keys
      const resourceMap: Record<
        "property" | "unit" | "user",
        "properties" | "units" | "seats"
      > = {
        property: "properties",
        unit: "units",
        user: "seats",
      };

      const key = resourceMap[resource];

      // Check if under limit
      return usage[key] < limits[key];
    };

    // Helper: Check if limit is reached
    const isLimitReached = (
      resource: "property" | "unit" | "user"
    ): boolean => {
      const resourceMap: Record<
        "property" | "unit" | "user",
        "properties" | "units" | "seats"
      > = {
        property: "properties",
        unit: "units",
        user: "seats",
      };

      const key = resourceMap[resource];
      return usage[key] >= limits[key];
    };

    // Helper: Get usage information for a resource
    const getUsageInfo = (
      resource: "property" | "unit" | "user"
    ): UsageInfo => {
      const resourceMap: Record<
        "property" | "unit" | "user",
        "properties" | "units" | "seats"
      > = {
        property: "properties",
        unit: "units",
        user: "seats",
      };

      const key = resourceMap[resource];
      const current = usage[key] || 0;
      const limit = limits[key] || 1;
      const remaining = Math.max(0, limit - current);
      const percentage = limit > 0 ? (current / limit) * 100 : 0;
      const isNearLimit = current >= limit * 0.8;

      return {
        current,
        limit,
        remaining,
        percentage,
        isNearLimit,
      };
    };

    // Helper: Show upgrade modal (placeholder for now)
    const showUpgradeModal = (reason: string) => {
      // TODO: Implement upgrade modal
      console.log("[Entitlements] Upgrade needed:", reason);
      alert(reason + "\n\nPlease upgrade your plan to continue.");
    };

    return {
      features,
      limits,
      usage,
      status,
      isLoading,
      hasFeature,
      canCreate,
      isLimitReached,
      getUsageInfo,
      showUpgradeModal,
    };
  }, [user, usageData, isLoading, error]);

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlements() {
  const context = useContext(EntitlementsContext);

  if (!context) {
    throw new Error(
      "useEntitlements must be used within an EntitlementsProvider"
    );
  }

  return context;
}
