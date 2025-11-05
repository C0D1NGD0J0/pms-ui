import { PermissionContext, NavigationKey, UserRole } from "@utils/permissions";

export interface IUnifiedPermissions {
  hasRoleLevel(minRole: UserRole): unknown;
  canPerformAction(action: string, resource: string | undefined): unknown;
  /**
   * Check if user has a specific permission
   * @param permission - Permission string (e.g., "property.create", "user.read")
   * @param context - Optional permission context
   */
  can: (permission: string, context?: PermissionContext) => boolean;

  /**
   * Check if user can access a navigation item
   * @param navigationKey - Navigation key to check
   */
  canAccess: (navigationKey: NavigationKey) => boolean;

  /**
   * Check if user can access a specific route/page
   * @param route - Route path to check
   */
  canAccessPage: (route: string) => boolean;

  /**
   * Check if user owns a specific resource
   * @param key - User identifier key ("id", "uid", or "sub")
   * @param resourceOwnerId - ID of the resource owner
   */
  isOwner: (key: "id" | "uid" | "sub", resourceOwnerId?: string) => boolean;

  /**
   * Check if user belongs to any of the specified departments
   * @param departments - Array of department names
   */
  inDepartment: (departments: string[]) => boolean;

  /**
   * Check if user has minimum role level
   * @param minimumRole - Minimum required role
   */
  hasRole: (minimumRole: UserRole) => boolean;

  /**
   * Check if user has all specified permissions
   * @param permissions - Array of permission strings
   * @param context - Optional permission context
   */
  canAll: (permissions: string[], context?: PermissionContext) => boolean;

  /**
   * Check if user has any of the specified permissions
   * @param permissions - Array of permission strings
   * @param context - Optional permission context
   */
  canAny: (permissions: string[], context?: PermissionContext) => boolean;

  /**
   * Check if user can manage another role
   * @param targetRole - Role to check management permissions for
   */
  canManage: (targetRole: UserRole) => boolean;

  /**
   * Get user permission context
   * @param key - User identifier key ("id", "uid", or "sub")
   */
  getUserContext: (key?: "id" | "uid" | "sub") => PermissionContext;

  /**
   * Check if user can create properties
   * @param context - Optional permission context
   */
  canCreateProperty: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view properties
   * @param context - Optional permission context
   */
  canViewProperty: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit a property
   * @param propertyCreatorId - ID of property creator
   * @param ownerId - ID of property owner
   */
  canEditProperty: (propertyCreatorId?: string, ownerId?: string) => boolean;

  /**
   * Check if user can delete properties
   * @param context - Optional permission context
   */
  canDeleteProperty: (context?: PermissionContext) => boolean;

  /**
   * Check if user can create users
   * @param context - Optional permission context
   */
  canCreateUser: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view users
   * @param context - Optional permission context
   */
  canViewUsers: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit a specific user
   * @param userId - ID of current user
   * @param targetUserId - ID of user to edit
   */
  canEditUser: (userId?: string, targetUserId?: string) => boolean;

  /**
   * Check if user can delete users
   * @param context - Optional permission context
   */
  canDeleteUser: (context?: PermissionContext) => boolean;

  /**
   * Check if user can invite users
   * @param context - Optional permission context
   */
  canInviteUsers: (context?: PermissionContext) => boolean;

  /**
   * Check if user can create leases
   * @param context - Optional permission context
   */
  canCreateLease: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view leases
   * @param context - Optional permission context
   */
  canViewLease: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit a lease
   * @param leaseId - ID of lease
   * @param ownerId - ID of lease owner
   */
  canEditLease: (leaseId?: string, ownerId?: string) => boolean;

  /**
   * Check if user can delete leases
   * @param context - Optional permission context
   */
  canDeleteLease: (context?: PermissionContext) => boolean;

  /**
   * Check if user can create maintenance requests
   * @param context - Optional permission context
   */
  canCreateMaintenance: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view maintenance requests
   * @param context - Optional permission context
   */
  canViewMaintenance: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit maintenance requests
   * @param maintenanceId - ID of maintenance request
   * @param ownerId - ID of maintenance request owner
   */
  canEditMaintenance: (maintenanceId?: string, ownerId?: string) => boolean;

  /**
   * Check if user can delete maintenance requests
   * @param context - Optional permission context
   */
  canDeleteMaintenance: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view client information
   * @param context - Optional permission context
   */
  canViewClient: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit client information
   * @param context - Optional permission context
   */
  canEditClient: (context?: PermissionContext) => boolean;

  /**
   * Check if user can manage client settings
   * @param context - Optional permission context
   */
  canManageClientSettings: (context?: PermissionContext) => boolean;

  /**
   * Check if user can create reports
   * @param context - Optional permission context
   */
  canCreateReport: (context?: PermissionContext) => boolean;

  /**
   * Check if user can view reports
   * @param context - Optional permission context
   */
  canViewReports: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit reports
   * @param context - Optional permission context
   */
  canEditReport: (context?: PermissionContext) => boolean;

  /**
   * Check if user can delete reports
   * @param context - Optional permission context
   */
  canDeleteReport: (context?: PermissionContext) => boolean;

  /**
   * Check if user can edit a specific field
   * @param resource - Resource name (e.g., "property", "user")
   * @param fieldName - Field name to check
   * @param context - Optional permission context
   */
  canEditField: (
    resource: string,
    fieldName: string,
    context?: PermissionContext
  ) => boolean;

  /**
   * Check if a field should be disabled for the user
   * @param resource - Resource name (e.g., "property", "user")
   * @param fieldName - Field name to check
   * @param context - Optional permission context
   */
  isFieldDisabled: (
    resource: string,
    fieldName: string,
    context?: PermissionContext
  ) => boolean;

  /**
   * Get all navigation items accessible to the user
   * @returns Array of navigation keys
   */
  getAccessibleNavigation: () => string[];

  /**
   * Get the display title for the user's role
   * @returns Role title string
   */
  getRoleTitle: () => string;

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated: () => boolean;

  /**
   * Current authenticated user object
   */
  currentUser: any; // Type would depend on your user interface

  /**
   * Current user's role
   */
  currentRole: UserRole | null;

  /**
   * True if user is an Admin
   */
  isAdmin: boolean;

  /**
   * True if user is a Manager
   */
  isManager: boolean;

  /**
   * True if user is Staff
   */
  isStaff: boolean;

  /**
   * True if user is a Tenant
   */
  isTenant: boolean;

  /**
   * True if user is a Vendor
   */
  isVendor: boolean;

  /**
   * True if user is Staff level or above
   */
  isStaffOrAbove: boolean;

  /**
   * True if user is Manager level or above
   */
  isManagerOrAbove: boolean;
}
