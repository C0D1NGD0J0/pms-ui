"use client";

import { useCallback, useMemo } from "react";
import {
  getAccessibleNavigation as getAccessibleNavigationItems,
  belongsToDepartment,
  canAccessNavigation,
  PermissionContext,
  canPerformAction,
  buildPermission,
  isResourceOwner,
  canAccessRoute,
  canManageRole,
  NavigationKey,
  hasRoleLevel,
  getRoleName,
  UserRole,
} from "@utils/permissions";

import { useCurrentUser } from "./useCurrentUser";

/**
 * Unified Permission Hook
 * Simple, contextual permission checking with helper methods
 */
export const useUnifiedPermissions = () => {
  const { user: currentUser } = useCurrentUser();

  // Get user role from current user
  const currentRole = useMemo((): UserRole | null => {
    if (!currentUser?.client?.role) return null;
    const roleString = currentUser.client.role.toLowerCase();

    // Map string roles to enum values
    const roleMap: Record<string, UserRole> = {
      admin: UserRole.ADMIN,
      manager: UserRole.MANAGER,
      staff: UserRole.STAFF,
      employee: UserRole.STAFF, // Alternative naming
      tenant: UserRole.TENANT,
      vendor: UserRole.VENDOR,
    };

    return roleMap[roleString] || null;
  }, [currentUser?.client?.role]);

  // User context for permission checks with flexible key selection
  const getUserContext = useCallback(
    (key: "id" | "uid" | "sub" = "sub"): PermissionContext => ({
      userId: key === "sub" ? currentUser?.sub : currentUser?.uid,
      clientId: currentUser?.client?.cuid,
      departments: [],
    }),
    [currentUser]
  );

  /**
   * Core permission checker - main entry point
   */
  const can = useCallback(
    (permission: string, context?: PermissionContext): boolean => {
      if (!currentRole) return false;

      const mergedContext = { ...getUserContext(), ...context };
      return canPerformAction(currentRole, permission, mergedContext);
    },
    [currentRole]
  );

  /**
   * Navigation access checker
   */
  const canAccess = useCallback(
    (navigationKey: NavigationKey): boolean => {
      if (!currentRole) return false;
      return canAccessNavigation(currentRole, navigationKey);
    },
    [currentRole]
  );

  /**
   * Route access checker
   */
  const canAccessPage = useCallback(
    (route: string): boolean => {
      if (!currentRole) return false;
      return canAccessRoute(currentRole, route);
    },
    [currentRole]
  );

  /**
   * Ownership checker
   */
  const isOwner = useCallback(
    (key: "id" | "uid" | "sub", resourceOwnerId?: string): boolean => {
      return isResourceOwner(resourceOwnerId, getUserContext(key).userId);
    },
    [getUserContext]
  );

  /**
   * Department membership checker
   */
  const inDepartment = useCallback(
    (departments: string[]): boolean => {
      return belongsToDepartment(getUserContext().departments, departments);
    },
    [getUserContext]
  );

  /**
   * Role level checker
   */
  const hasRole = useCallback(
    (minimumRole: UserRole): boolean => {
      if (!currentRole) return false;
      return hasRoleLevel(currentRole, minimumRole);
    },
    [currentRole]
  );

  /**
   * Multiple permission checker
   */
  const canAll = useCallback(
    (permissions: string[], context?: PermissionContext): boolean => {
      return permissions.every((permission) => can(permission, context));
    },
    [can]
  );

  /**
   * Any permission checker
   */
  const canAny = useCallback(
    (permissions: string[], context?: PermissionContext): boolean => {
      return permissions.some((permission) => can(permission, context));
    },
    [can]
  );

  /**
   * Role management checker
   */
  const canManage = useCallback(
    (targetRole: UserRole): boolean => {
      if (!currentRole) return false;
      return canManageRole(currentRole, targetRole);
    },
    [currentRole]
  );

  // === PROPERTY HELPER METHODS ===
  const canCreateProperty = useCallback(
    (context?: PermissionContext) => can("property.create", context),
    [can]
  );

  const canViewProperty = useCallback(
    (context?: PermissionContext) => can("property.read", context),
    [can]
  );

  const canEditProperty = useCallback(
    (propertyCreatorId?: string, ownerId?: string) =>
      can("property.update", {
        resourceOwner: ownerId,
        resourceId: propertyCreatorId,
      }),
    [can]
  );

  const canDeleteProperty = useCallback(
    (context?: PermissionContext) => can("property.delete", context),
    [can]
  );

  // === USER MANAGEMENT HELPER METHODS ===
  const canCreateUser = useCallback(
    (context?: PermissionContext) => can("user.create", context),
    [can]
  );

  const canViewUsers = useCallback(
    (context?: PermissionContext) => can("user.read", context),
    [can]
  );

  const canEditUser = useCallback(
    (userId?: string, targetUserId?: string) =>
      can("user.update", { resourceOwner: targetUserId, resourceId: userId }),
    [can]
  );

  const canDeleteUser = useCallback(
    (context?: PermissionContext) => can("user.delete", context),
    [can]
  );

  const canInviteUsers = useCallback(
    (context?: PermissionContext) => can("user.invite", context),
    [can]
  );

  // === LEASE HELPER METHODS ===
  const canCreateLease = useCallback(
    (context?: PermissionContext) => can("lease.create", context),
    [can]
  );

  const canViewLease = useCallback(
    (context?: PermissionContext) => can("lease.read", context),
    [can]
  );

  const canEditLease = useCallback(
    (leaseId?: string, ownerId?: string) =>
      can("lease.update", { resourceOwner: ownerId, resourceId: leaseId }),
    [can]
  );

  const canDeleteLease = useCallback(
    (context?: PermissionContext) => can("lease.delete", context),
    [can]
  );

  // === MAINTENANCE HELPER METHODS ===
  const canCreateMaintenance = useCallback(
    (context?: PermissionContext) => can("maintenance.create", context),
    [can]
  );

  const canViewMaintenance = useCallback(
    (context?: PermissionContext) => can("maintenance.read", context),
    [can]
  );

  const canEditMaintenance = useCallback(
    (maintenanceId?: string, ownerId?: string) =>
      can("maintenance.update", {
        resourceOwner: ownerId,
        resourceId: maintenanceId,
      }),
    [can]
  );

  const canDeleteMaintenance = useCallback(
    (context?: PermissionContext) => can("maintenance.delete", context),
    [can]
  );

  // === CLIENT/SETTINGS HELPER METHODS ===
  const canViewClient = useCallback(
    (context?: PermissionContext) => can("client.read", context),
    [can]
  );

  const canEditClient = useCallback(
    (context?: PermissionContext) => can("client.update", context),
    [can]
  );

  const canManageClientSettings = useCallback(
    (context?: PermissionContext) => can("client.settings", context),
    [can]
  );

  // === REPORT HELPER METHODS ===
  const canCreateReport = useCallback(
    (context?: PermissionContext) => can("report.create", context),
    [can]
  );

  const canViewReports = useCallback(
    (context?: PermissionContext) => can("report.read", context),
    [can]
  );

  const canEditReport = useCallback(
    (context?: PermissionContext) => can("report.update", context),
    [can]
  );

  const canDeleteReport = useCallback(
    (context?: PermissionContext) => can("report.delete", context),
    [can]
  );

  // === FIELD-LEVEL PERMISSION HELPERS ===
  const canEditField = useCallback(
    (
      resource: string,
      fieldName: string,
      context?: PermissionContext
    ): boolean => {
      // Check specific field permission first
      const fieldPermission = buildPermission(resource, "update", "own");
      if (can(fieldPermission, context)) return true;

      // Check general edit permission
      const editPermission = buildPermission(resource, "update");
      if (can(editPermission, context)) {
        // Apply role-based field restrictions
        return canEditFieldByRole(fieldName);
      }

      return false;
    },
    [can, currentRole]
  );

  const canEditFieldByRole = useCallback(
    (fieldName: string): boolean => {
      if (!currentRole) return false;

      // Admin can edit everything
      if (currentRole === UserRole.ADMIN) return true;

      // Manager can edit most things
      if (currentRole === UserRole.MANAGER) return true;

      // Staff has limited edit access
      if (currentRole === UserRole.STAFF) {
        const staffEditableFields = [
          "notes",
          "status",
          "description",
          "priority",
          "comments",
        ];
        return staffEditableFields.includes(fieldName);
      }

      // Tenants can edit their profile fields only
      if (currentRole === UserRole.TENANT) {
        const tenantEditableFields = [
          "phone",
          "preferences",
          "emergency_contact",
          "profile_picture",
        ];
        return tenantEditableFields.includes(fieldName);
      }

      // Vendors can edit service-related fields
      if (currentRole === UserRole.VENDOR) {
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
    [currentRole]
  );

  const isFieldDisabled = useCallback(
    (
      resource: string,
      fieldName: string,
      context?: PermissionContext
    ): boolean => {
      return !canEditField(resource, fieldName, context);
    },
    [canEditField]
  );

  // === UTILITY GETTERS ===
  const getAccessibleNavigation = useCallback((): string[] => {
    if (!currentRole) return [];
    return getAccessibleNavigationItems(currentRole);
  }, [currentRole]);

  const getRoleTitle = useCallback((): string => {
    if (!currentRole) return "Unknown";
    return getRoleName(currentRole);
  }, [currentRole]);

  const isAuthenticated = useCallback((): boolean => {
    return !!currentUser && !!currentRole;
  }, [currentUser, currentRole]);

  // === CONVENIENCE ROLE CHECKERS ===
  const isAdmin = useMemo(() => currentRole === UserRole.ADMIN, [currentRole]);
  const isManager = useMemo(
    () => currentRole === UserRole.MANAGER,
    [currentRole]
  );
  const isStaff = useMemo(() => currentRole === UserRole.STAFF, [currentRole]);
  const isTenant = useMemo(
    () => currentRole === UserRole.TENANT,
    [currentRole]
  );
  const isVendor = useMemo(
    () => currentRole === UserRole.VENDOR,
    [currentRole]
  );

  const isStaffOrAbove = useMemo(() => hasRole(UserRole.STAFF), [hasRole]);
  const isManagerOrAbove = useMemo(() => hasRole(UserRole.MANAGER), [hasRole]);

  return {
    // Core methods
    can,
    canAccess,
    canAccessPage,
    isOwner,
    inDepartment,
    hasRole,
    canAll,
    canAny,
    canManage,
    getUserContext,

    // Property methods
    canCreateProperty,
    canViewProperty,
    canEditProperty,
    canDeleteProperty,

    // User methods
    canCreateUser,
    canViewUsers,
    canEditUser,
    canDeleteUser,
    canInviteUsers,

    // Lease methods
    canCreateLease,
    canViewLease,
    canEditLease,
    canDeleteLease,

    // Maintenance methods
    canCreateMaintenance,
    canViewMaintenance,
    canEditMaintenance,
    canDeleteMaintenance,

    // Client/Settings methods
    canViewClient,
    canEditClient,
    canManageClientSettings,

    // Report methods
    canCreateReport,
    canViewReports,
    canEditReport,
    canDeleteReport,

    // Field-level methods
    canEditField,
    isFieldDisabled,

    // Utility methods
    getAccessibleNavigation,
    getRoleTitle,
    isAuthenticated,

    // Convenience properties
    currentUser,
    currentRole,
    isAdmin,
    isManager,
    isStaff,
    isTenant,
    isVendor,
    isStaffOrAbove,
    isManagerOrAbove,
  };
};

// Re-export types for convenience
export type { UserRole, PermissionContext, NavigationKey };
