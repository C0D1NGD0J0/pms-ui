import { useCallback, useMemo } from "react";
import {
  getAccessibleNavigationItems,
  roleHasNavigationAccess,
  roleCanAccessRoute,
  roleCanInheritFrom,
  NavigationItem,
  ROLE_HIERARCHY,
  UserRole,
} from "@utils/navigationPermissions";

import { useCurrentUser } from "./useCurrentUser";

export interface PermissionCheckOptions {
  requireAll?: boolean; // If true, user must have ALL permissions; if false, user needs ANY permission
  checkInheritance?: boolean; // If true, check role hierarchy for permission inheritance
  context?: {
    resourceId?: string;
    ownerId?: string;
    assignedUsers?: string[];
    clientId?: string;
    userId?: string;
    [key: string]: unknown;
  };
}

export interface ScopedPermission {
  resource: string;
  action: string;
  scope: "any" | "mine" | "assigned" | "available";
}

export const usePermissions = () => {
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();

  // Get current user's role and permissions
  const currentRoleAndPermissions = useMemo(() => {
    if (!currentUser?.client?.role) return null;
    return {
      role: currentUser.client.role.toLowerCase() as UserRole,
      permissions: currentUser.permissions || [],
    };
  }, [currentUser?.client?.role, currentUser?.permissions]);

  const currentRole = currentRoleAndPermissions?.role || null;
  const userPermissions = useMemo(() => {
    return currentRoleAndPermissions?.permissions || [];
  }, [currentRoleAndPermissions]);

  // Permission context for advanced checks
  const permissionContext = useMemo(
    () => ({
      userId: currentUser?.sub,
      clientId: currentUser?.client?.cuid,
      role: currentRole,
    }),
    [currentUser?.sub, currentUser?.client?.cuid, currentRole]
  );

  /**
   * Parse scoped permission string (e.g., "property:read:any")
   */
  const parseScopedPermission = useCallback(
    (permission: string): ScopedPermission | null => {
      const parts = permission.split(":");
      if (parts.length < 2) return null;

      const [resource, action, scope = "any"] = parts;
      return {
        resource,
        action,
        scope: scope as ScopedPermission["scope"],
      };
    },
    []
  );

  /**
   * Check resource access based on context and scope
   */
  const checkResourceAccess = useCallback(
    (
      scopedPermission: ScopedPermission,
      context?: PermissionCheckOptions["context"]
    ): boolean => {
      const { scope } = scopedPermission;

      switch (scope) {
        case "any":
          return true; // User has access to all resources of this type

        case "mine":
          if (!context?.ownerId || !context?.userId) return false;
          return context.ownerId === context.userId;

        case "assigned":
          if (!context?.assignedUsers || !context?.userId) return false;
          return context.assignedUsers.includes(context.userId);

        case "available":
          return true; // Available scope allows read-only access

        default:
          return false;
      }
    },
    []
  );

  /**
   * Core permission checking with context awareness
   */
  const hasPermission = useCallback(
    (permission: string, options: PermissionCheckOptions = {}): boolean => {
      if (!currentUser) return false;

      const { checkInheritance = true, context } = options;

      // Parse scoped permission
      const scopedPerm = parseScopedPermission(permission);
      if (scopedPerm) {
        // Check if user has the base permission
        const basePermission = `${scopedPerm.resource}:${scopedPerm.action}`;
        const extendedPermission = `${scopedPerm.resource}:${scopedPerm.action}:${scopedPerm.scope}`;

        const hasBasePermission =
          userPermissions.includes(basePermission) ||
          userPermissions.includes(extendedPermission) ||
          userPermissions.includes(`${scopedPerm.action}:${scopedPerm.scope}`);

        if (hasBasePermission) {
          // Validate context if scope requires it
          const contextValid = checkResourceAccess(scopedPerm, {
            ...permissionContext,
            ...context,
          });

          if (contextValid) {
            return true;
          } else {
            return false;
          }
        }
      }

      // Direct permission check
      if (userPermissions.includes(permission)) {
        return true;
      }

      // Role hierarchy inheritance check
      if (checkInheritance && currentRole) {
        const currentLevel = ROLE_HIERARCHY[currentRole] || 0;
        if (currentLevel >= 3) {
          // Staff level and above have broader access
          return true;
        }
      }

      return false;
    },
    [
      currentUser,
      userPermissions,
      currentRole,
      parseScopedPermission,
      checkResourceAccess,
      permissionContext,
    ]
  );

  /**
   * Check if user has multiple permissions
   */
  const hasPermissions = useCallback(
    (permissions: string[], options: PermissionCheckOptions = {}): boolean => {
      if (!permissions.length) return true; // Empty permissions array means no restrictions

      const { requireAll = false } = options;

      if (requireAll) {
        return permissions.every((permission) =>
          hasPermission(permission, options)
        );
      } else {
        return permissions.some((permission) =>
          hasPermission(permission, options)
        );
      }
    },
    [hasPermission]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return currentRole === role;
    },
    [currentRole]
  );

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!currentRole) return false;
      return roles.includes(currentRole);
    },
    [currentRole]
  );

  /**
   * Check multiple permissions with context
   */
  const checkMultiplePermissions = useCallback(
    (
      permissionChecks: Array<{
        permission: string;
        context?: PermissionCheckOptions["context"];
      }>,
      requireAll = false
    ): boolean => {
      if (requireAll) {
        return permissionChecks.every(({ permission, context }) =>
          hasPermission(permission, { context })
        );
      } else {
        return permissionChecks.some(({ permission, context }) =>
          hasPermission(permission, { context })
        );
      }
    },
    [hasPermission]
  );

  /**
   * Enhanced action permission check with context
   */
  const canPerformAction = useCallback(
    (
      action: string,
      resource?: string,
      context?: PermissionCheckOptions["context"]
    ): boolean => {
      if (!currentUser) return false;

      const permission = resource ? `${resource}:${action}` : action;
      return hasPermission(permission, { context });
    },
    [currentUser, hasPermission]
  );

  /**
   * Resource-specific action check
   */
  const canPerformActionOnResource = useCallback(
    (
      resource: string,
      action: string,
      resourceId?: string,
      additionalContext?: Record<string, unknown>
    ): boolean => {
      const context = {
        resourceId,
        ...permissionContext,
        ...additionalContext,
      };

      return canPerformAction(action, resource, context);
    },
    [canPerformAction, permissionContext]
  );

  /**
   * Role-based field editing (legacy fallback)
   */
  const canEditFieldByRole = useCallback(
    (fieldName: string, role: UserRole | null): boolean => {
      if (!role) return false;

      // Admin can edit everything
      if (role === UserRole.ADMIN) return true;

      // Manager can edit most things
      if (role === UserRole.MANAGER) return true;

      // Staff has limited edit access
      if (role === UserRole.STAFF) {
        const staffEditableFields = [
          "notes",
          "status",
          "description",
          "priority",
          "comments",
        ];
        return staffEditableFields.includes(fieldName);
      }

      // Tenants can edit their own profile fields only
      if (role === UserRole.TENANT) {
        const tenantEditableFields = [
          "phone",
          "preferences",
          "emergency_contact",
          "profile_picture",
        ];
        return tenantEditableFields.includes(fieldName);
      }

      // Vendors can edit their service-related fields
      if (role === UserRole.VENDOR) {
        const vendorEditableFields = [
          "service_status",
          "completion_notes",
          "estimated_completion",
          "service_images",
          "work_log",
        ];
        return vendorEditableFields.includes(fieldName);
      }

      return false;
    },
    []
  );

  /**
   * Enhanced field editing check with dynamic permissions
   */
  const canEditField = useCallback(
    (
      fieldName: string,
      resource?: string,
      context: PermissionCheckOptions = {}
    ): boolean => {
      if (!currentUser) return false;

      // Check specific field permission first
      if (resource) {
        const fieldPermission = `${resource}:update:${fieldName}`;
        if (hasPermission(fieldPermission, context)) return true;
      }

      // Check general edit permission
      const editPermission = resource ? `${resource}:update` : "update";
      if (hasPermission(editPermission, context)) {
        // Apply role-based field restrictions
        return canEditFieldByRole(fieldName, currentRole);
      }

      return false;
    },
    [currentUser, hasPermission, currentRole, canEditFieldByRole]
  );

  /**
   * Check if a field should be disabled (visible but not editable)
   */
  const isFieldDisabled = useCallback(
    (fieldName: string, resource?: string): boolean => {
      if (!currentUser) return true;

      // If user can't edit the field, it should be disabled
      return !canEditField(fieldName, resource);
    },
    [currentUser, canEditField]
  );

  /**
   * Navigation access check
   */
  const canAccessNavigation = useCallback(
    (navItem: NavigationItem): boolean => {
      if (!currentRole) return false;
      return roleHasNavigationAccess(currentRole, navItem);
    },
    [currentRole]
  );

  /**
   * Route access check
   */
  const canAccessRoute = useCallback(
    (route: string): boolean => {
      if (!currentRole) return false;
      return roleCanAccessRoute(currentRole, route);
    },
    [currentRole]
  );

  /**
   * Role hierarchy check
   */
  const hasRoleLevel = useCallback(
    (minimumRole: UserRole): boolean => {
      if (!currentRole) return false;
      return roleCanInheritFrom(currentRole, minimumRole);
    },
    [currentRole]
  );

  /**
   * Get accessible navigation items
   */
  const getAccessibleNavigation = useCallback((): NavigationItem[] => {
    if (!currentRole) return [];
    return getAccessibleNavigationItems(currentRole);
  }, [currentRole]);

  /**
   * Get user role
   */
  const getUserRole = useCallback((): UserRole | null => {
    return currentRole;
  }, [currentRole]);

  /**
   * Check authentication status
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!currentUser && !!currentRole;
  }, [currentUser, currentRole]);

  return {
    // Core permission checks
    hasPermission,
    hasPermissions,
    hasRole,
    hasAnyRole,
    hasRoleLevel,

    // Navigation and route checks
    canAccessNavigation,
    canAccessRoute,
    getAccessibleNavigation,

    // Enhanced action and field-level checks
    canPerformAction,
    canPerformActionOnResource,
    checkMultiplePermissions,
    canEditField,
    isFieldDisabled,

    // User info
    getUserRole,
    isAuthenticated,
    currentUser,
    userPermissions,
    isLoading: isUserLoading,

    // Context
    permissionContext,

    // Convenience properties
    isAdmin: hasRole(UserRole.ADMIN),
    isManager: hasRole(UserRole.MANAGER),
    isStaff: hasRole(UserRole.STAFF),
    isTenant: hasRole(UserRole.TENANT),
    isVendor: hasRole(UserRole.VENDOR),
  };
};

// Export utility functions for external use
export const createPermissionString = (
  resource: string,
  action: string,
  scope: ScopedPermission["scope"] = "any"
): string => {
  return `${resource}:${action}:${scope}`;
};

export const parsePermissionString = (
  permission: string
): ScopedPermission | null => {
  const parts = permission.split(":");
  if (parts.length < 2) return null;

  const [resource, action, scope = "any"] = parts;
  return {
    resource,
    action,
    scope: scope as ScopedPermission["scope"],
  };
};
