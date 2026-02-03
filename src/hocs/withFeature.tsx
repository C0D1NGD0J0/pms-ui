import React from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { useEntitlements } from "@src/hooks/contexts";

interface WithFeatureOptions {
  feature: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Higher-Order Component for feature-gating entire pages
 *
 * @example
 * ```typescript
 * const APIKeysPage = () => <div>API Keys</div>;
 *
 * export default withFeature(APIKeysPage, {
 *   feature: 'api.access',
 *   fallback: <UpgradeRequired feature="API Access" />
 * });
 * ```
 */
export function withFeature<P extends object>(
  Component: React.ComponentType<P>,
  options: WithFeatureOptions
) {
  const FeatureGatedComponent = (props: P) => {
    const { hasFeature, isLoading } = useEntitlements();
    const router = useRouter();

    // Show loading while checking entitlements
    if (isLoading) {
      return <Loading description="Checking access..." />;
    }

    // Check if user has the required feature
    const allowed = hasFeature(options.feature);

    if (!allowed) {
      // If redirect URL is provided, redirect
      if (options.redirectTo) {
        router.push(options.redirectTo);
        return null;
      }

      // Otherwise, show fallback component
      if (options.fallback) {
        return <>{options.fallback}</>;
      }

      // Default fallback
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>This feature is not available on your current plan.</p>
        </div>
      );
    }

    // User has access, render the component
    return <Component {...props} />;
  };

  // Set display name for debugging
  FeatureGatedComponent.displayName = `withFeature(${Component.displayName || Component.name || "Component"})`;

  return FeatureGatedComponent;
}
