"use client";

import { Icon } from "@components/Icon";
import { useAuth } from "@store/auth.store";
import { useRouter } from "next/navigation";
import { Modal } from "@components/FormElements";
import { Button } from "@components/FormElements";
import { useEntitlementsUsage } from "@hooks/useEntitlementsUsage";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

interface UsageInfo {
  current: number;
  limit: number;
  remaining: number;
  percentage: number;
  isNearLimit: boolean;
}

interface EntitlementsContextValue {
  // Data
  entitlements: Record<string, boolean>;
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
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState("");
  const {
    data: usageData,
    isLoading,
    error,
  } = useEntitlementsUsage(client?.cuid);

  const value: EntitlementsContextValue = useMemo(() => {
    // Extract data from currentUser and usage API
    const entitlements = user?.subscription?.entitlements || {};
    const limits =
      usageData?.limits || DEFAULT_LIMITS;
    const usage =
      usageData?.usage || DEFAULT_USAGE;
    const status = user?.subscription?.plan?.status || "inactive";

    // Helper: Check if user has a specific feature
    const hasFeature = (feature: string): boolean => {
      return (entitlements as Record<string, any>)[feature] === true;
    };

    // Helper: Check if user can create a new resource
    const canCreate = (resource: "property" | "unit" | "user"): boolean => {
      // Block if account is inactive or expired
      if (status === "inactive" || status === "expired") {
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

    // Helper: Show upgrade modal
    const showUpgradeModal = (reason: string) => {
      setModalReason(reason);
      setShowModal(true);
    };

    return {
      entitlements,
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

  const handleViewPlans = () => {
    setShowModal(false);
    router.push("/subscription");
  };

  const handleContactSales = () => {
    setShowModal(false);
    router.push("/contact-sales");
  };

  return (
    <EntitlementsContext.Provider value={value}>
      {children}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upgrade Required"
      >
        <div style={{ padding: "1.5rem", textAlign: "center" }}>
          <Icon
            name="bx-lock-alt"
            size="4rem"
            color="var(--secondary-color)"
            style={{ marginBottom: "1rem" }}
          />

          <h3 style={{ marginBottom: "1rem" }}>{modalReason}</h3>

          <p style={{ marginBottom: "2rem", lineHeight: "1.6" }}>
            Upgrade your plan to unlock this feature and get access to more
            resources, advanced features, and priority support.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              label="View Plans & Upgrade"
              onClick={handleViewPlans}
              className="btn-primary"
              icon={<Icon name="bx-rocket" />}
            />
            <Button
              label="Contact Sales"
              onClick={handleContactSales}
              className="btn-outline"
              icon={<Icon name="bx-phone" />}
            />
          </div>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            Have questions? Our team is here to help you choose the right plan.
          </p>
        </div>
      </Modal>
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
