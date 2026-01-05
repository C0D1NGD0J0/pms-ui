"use client";

import { Loading } from "@components/Loading";
import { usePathname, useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { IUnifiedPermissions } from "@interfaces/permission.interface";

export interface PageAccessOptions {
  route?: string;
  fallback?: ComponentType | (() => React.ReactElement | null);
  redirectTo?: string;
  loadingMessage?: string;
  showLoadingLogo?: boolean;
  customLoader?: ComponentType;
  bypassPermissionCheck?: boolean;
  requiredPermission?: (permissions: IUnifiedPermissions) => boolean;
}

const DefaultUnauthorized = () => (
  <div
    className="unauthorized-container"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      textAlign: "center",
      padding: "2rem",
    }}
  >
    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
    <h2 style={{ marginBottom: "1rem", color: "#dc3545" }}>Access Denied</h2>
    <p style={{ color: "#6c757d", marginBottom: "2rem" }}>
      You do not have permission to access this page.
    </p>
    <button className="btn btn-primary" onClick={() => window.history.back()}>
      Go Back
    </button>
  </div>
);

export const withPageAccess = <P extends object>(
  Component: ComponentType<P>,
  options: PageAccessOptions = {}
) => {
  const WrappedComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const permissions = useUnifiedPermissions();
    const { canAccessPage, isAuthenticated, currentRole } = permissions;

    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    const {
      route,
      fallback: Fallback = DefaultUnauthorized,
      redirectTo,
      loadingMessage = "Checking permissions...",
      showLoadingLogo = false,
      customLoader: CustomLoader,
      bypassPermissionCheck = false,
      requiredPermission,
    } = options;

    useEffect(() => {
      const checkAccess = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (bypassPermissionCheck) {
            setHasAccess(true);
            setIsLoading(false);
            return;
          }

          if (!isAuthenticated()) {
            setHasAccess(false);
            setIsLoading(false);
            return;
          }

          if (requiredPermission) {
            const accessGranted = requiredPermission(permissions);
            setHasAccess(accessGranted);
          } else {
            const routeToCheck = route || pathname;
            const accessGranted = canAccessPage(routeToCheck);
            setHasAccess(accessGranted);
          }
        } catch (error) {
          console.error("Error checking page access:", error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkAccess();
    }, [
      pathname,
      route,
      canAccessPage,
      isAuthenticated,
      bypassPermissionCheck,
      currentRole,
    ]);

    useEffect(() => {
      if (!isLoading && !hasAccess && redirectTo) {
        router.push(redirectTo);
      }
    }, [isLoading, hasAccess, redirectTo, router]);

    if (isLoading) {
      if (CustomLoader) {
        return <CustomLoader />;
      }

      return (
        <Loading
          description={loadingMessage}
          size="fullscreen"
          showLogo={showLoadingLogo}
        />
      );
    }

    if (!hasAccess) {
      if (redirectTo) {
        return (
          <Loading
            description="Redirecting..."
            size="fullscreen"
            showLogo={showLoadingLogo}
          />
        );
      }

      return <Fallback />;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPageAccess(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

export const usePageAccess = (
  options: {
    route?: string;
    requiredPermission?: (permissions: IUnifiedPermissions) => boolean;
  } = {}
) => {
  const pathname = usePathname();
  const permissions = useUnifiedPermissions();
  const { canAccessPage, isAuthenticated, currentRole } = permissions;
  const { route, requiredPermission } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!isAuthenticated()) {
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        if (requiredPermission) {
          const accessGranted = requiredPermission(permissions);
          setHasAccess(accessGranted);
        } else {
          const routeToCheck = route || pathname;
          const accessGranted = canAccessPage(routeToCheck);
          setHasAccess(accessGranted);
        }
      } catch (error) {
        console.error("Error checking page access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [pathname, route, canAccessPage, isAuthenticated, currentRole]);

  return { hasAccess, isLoading, routeChecked: route || pathname };
};
