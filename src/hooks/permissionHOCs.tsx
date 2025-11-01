/**
 * Simplified HOC System - 2 HOCs only
 * 1. withPermissionCheck - Unified permission checking
 * 2. withClientAccess - Client isolation for multi-tenant security
 */

import { redirect } from "next/navigation";
import { useAuth } from "@store/auth.store";
import { UserRole } from "@utils/permissions";
import React, { ComponentType, use } from "react";

import { useUnifiedPermissions } from "./useUnifiedPermissions";

// ============================================================================
// HOC 1: withPermissionCheck - Unified Permission Checking
// ============================================================================

export interface PermissionCheckOptions {
  // Role-based checks
  roles?: string[];
  minRole?: UserRole;

  // Permission-based checks
  permission?: string;
  permissions?: {
    can?: string[];
    canAll?: string[];
    canAny?: string[];
  };

  // Field-level checks
  field?: string;
  resource?: string;

  // Action-level checks
  action?: string;

  // Display options
  fallback?: ComponentType;
  hideIfUnauthorized?: boolean;
  disableIfUnauthorized?: boolean;
}

/**
 * Unified HOC for all permission checking needs
 *
 * @example Role-based
 * const AdminButton = withPermissionCheck(Button, { roles: ['admin'] })
 *
 * @example Permission-based
 * const EditButton = withPermissionCheck(Button, { permission: 'property.update' })
 *
 * @example Field-level
 * const EmailField = withPermissionCheck(Input, { field: 'email', resource: 'user' })
 *
 * @example Action-level
 * const DeleteButton = withPermissionCheck(Button, { action: 'delete', resource: 'property' })
 */
export const withPermissionCheck = <P extends object>(
  Component: ComponentType<P>,
  options: PermissionCheckOptions
) => {
  const WrappedComponent = (props: P) => {
    const permissions = useUnifiedPermissions();

    // Check role-based permissions
    if (options.roles && options.roles.length > 0) {
      const hasRole = options.roles.some(
        (role) => permissions.getRoleTitle() === role
      );
      if (!hasRole) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }
    }

    // Check minimum role level
    if (options.minRole !== undefined) {
      if (!permissions.hasRoleLevel(options.minRole)) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }
    }

    // Check single permission
    if (options.permission) {
      if (!permissions.can(options.permission)) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }
    }

    // Check multiple permissions
    if (options.permissions) {
      const { can, canAll, canAny } = options.permissions;

      if (can && !permissions.can(can[0])) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }

      if (canAll && !permissions.canAll(canAll)) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }

      if (canAny && !permissions.canAny(canAny)) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }
    }

    // Check field-level permissions
    if (options.field) {
      const isDisabled = permissions.isFieldDisabled(
        options.field,
        options.resource ?? ""
      );
      if (isDisabled && options.hideIfUnauthorized) return null;
      if (isDisabled) {
        return <Component {...props} disabled={true} />;
      }
    }

    // Check action-level permissions
    if (options.action) {
      const canPerformAction = permissions.canPerformAction(
        options.action,
        options.resource
      );
      if (!canPerformAction) {
        if (options.fallback) {
          const Fallback = options.fallback;
          return <Fallback />;
        }
        if (options.hideIfUnauthorized) return null;
        if (options.disableIfUnauthorized) {
          return <Component {...props} disabled={true} />;
        }
        return null;
      }
    }

    // All checks passed
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPermissionCheck(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

// ============================================================================
// HOC 2: withClientAccess - Client Isolation
// ============================================================================

export interface ClientAccessOptions {
  /**
   * The parameter key to check (default: 'cuid')
   */
  paramKey?: string;

  /**
   * Where to redirect unauthorized users (default: '/dashboard')
   */
  redirectTo?: string;

  /**
   * Show error message before redirect (default: false)
   */
  showError?: boolean;

  /**
   * Custom error message
   */
  errorMessage?: string;
}

/**
 * HOC to enforce client isolation in multi-tenant routes
 * Prevents user1-cuid1 from accessing user2-cuid3 resources
 *
 * @example
 * const StaffPage = withClientAccess(StaffPageComponent)
 *
 * @example With custom redirect
 * const AccountPage = withClientAccess(AccountPageComponent, {
 *   redirectTo: '/unauthorized',
 *   showError: true
 * })
 */
export const withClientAccess = <
  P extends { params: Promise<{ cuid: string }> }
>(
  Component: ComponentType<P>,
  options?: ClientAccessOptions
) => {
  const WrappedComponent = (props: P) => {
    const { params } = props;
    const { cuid: urlCuid } = use(params);
    const { client } = useAuth();

    const paramKey = options?.paramKey || "cuid";
    const redirectPath = options?.redirectTo || "/dashboard";
    const showError = options?.showError || false;
    const errorMessage =
      options?.errorMessage ||
      "You do not have access to this client's resources.";

    // Verify user belongs to the client they're trying to access
    if (!client?.cuid || client.cuid !== urlCuid) {
      // Log unauthorized access attempt
      console.warn(
        `Unauthorized access attempt: User client=${client?.cuid}, URL ${paramKey}=${urlCuid}`
      );

      if (showError) {
        // TODO: Show toast/notification with errorMessage
        console.error(errorMessage);
      }

      // Redirect to safe location
      redirect(redirectPath);
    }

    // Access granted - user belongs to this client
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withClientAccess(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};
