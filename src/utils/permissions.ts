/**
 * Unified Permission System
 * Simple, contextual, and type-safe permission management
 */

export enum UserRole {
  ADMIN = 5, // Full system access
  MANAGER = 4, // Department management
  STAFF = 3, // Regular operations
  TENANT = 2, // Tenant-specific features
  VENDOR = 1, // Service provider access
}

export interface PermissionContext {
  resourceOwner?: string;
  departments?: string[];
  assignedTo?: string[];
  clientId?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface Permission {
  action: string;
  resource?: string;
  scope?: "own" | "assigned" | "department" | "any";
}

export const NAVIGATION_PERMISSIONS = {
  dashboard: UserRole.VENDOR, // Everyone can access
  properties: UserRole.STAFF, // Staff and above
  "properties.create": UserRole.MANAGER, // Manager and above
  leases: UserRole.STAFF, // Staff and above
  "leases.create": UserRole.MANAGER, // Manager and above
  maintenance: UserRole.VENDOR, // Vendors and above
  users: UserRole.MANAGER, // Manager and above
  "users.tenants": UserRole.STAFF, // Staff and above
  "users.vendors": UserRole.STAFF, // Staff and above
  "users.employees": UserRole.STAFF, // Staff and above
  "users.add": UserRole.MANAGER, // Manager and above
  reports: UserRole.STAFF, // Staff and above
  "settings.client": UserRole.ADMIN, // Admin only
  "settings.profile": UserRole.VENDOR, // Everyone can access their profile
  wallet: UserRole.TENANT, // Tenants and above
  viewings: UserRole.TENANT, // Tenants and above
  service_requests: UserRole.VENDOR, // Vendors and above
} as const;

export const RESOURCE_PERMISSIONS = {
  // Property permissions
  "property.create": UserRole.MANAGER,
  "property.read": UserRole.STAFF,
  "property.update": UserRole.STAFF,
  "property.delete": UserRole.MANAGER,

  // User management permissions
  "user.create": UserRole.MANAGER,
  "user.read": UserRole.STAFF,
  "user.update": UserRole.MANAGER,
  "user.delete": UserRole.ADMIN,
  "user.invite": UserRole.MANAGER,

  // Lease permissions
  "lease.create": UserRole.MANAGER,
  "lease.read": UserRole.STAFF,
  "lease.update": UserRole.STAFF,
  "lease.delete": UserRole.MANAGER,

  // Maintenance permissions
  "maintenance.create": UserRole.VENDOR,
  "maintenance.read": UserRole.VENDOR,
  "maintenance.update": UserRole.VENDOR,
  "maintenance.delete": UserRole.MANAGER,

  // Report permissions
  "report.create": UserRole.STAFF,
  "report.read": UserRole.STAFF,
  "report.update": UserRole.STAFF,
  "report.delete": UserRole.MANAGER,

  // Client settings
  "client.read": UserRole.STAFF,
  "client.update": UserRole.ADMIN,
  "client.settings": UserRole.ADMIN,
} as const;

// Route protection mapping
export const PROTECTED_ROUTES = {
  "/dashboard": UserRole.VENDOR,
  "/properties": UserRole.STAFF,
  "/properties/new": UserRole.MANAGER,
  "/properties/[pid]": UserRole.STAFF,
  "/properties/[pid]/edit": UserRole.STAFF,
  "/users": UserRole.MANAGER,
  "/users/[cuid]/tenants": UserRole.MANAGER,
  "/users/[cuid]/vendors": UserRole.MANAGER,
  "/users/[cuid]/staff": UserRole.MANAGER,
  "/users/[cuid]/add-users": UserRole.MANAGER,
  "/leases": UserRole.STAFF,
  "/leases/[lid]": UserRole.STAFF,
  "/leases/[lid]/edit": UserRole.STAFF,
  "/maintenance": UserRole.VENDOR,
  "/service-requests": UserRole.VENDOR,
  "/reports": UserRole.STAFF,
  "/client/[cuid]/account_settings": UserRole.ADMIN,
  "/wallet/[cuid]": UserRole.TENANT,
  "/viewings": UserRole.TENANT,
} as const;

/**
 * Check if user role meets minimum requirement
 */
export const hasRoleLevel = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return userRole >= requiredRole;
};

/**
 * Parse permission string into components
 */
export const parsePermission = (permission: string): Permission => {
  const parts = permission.split(".");

  if (parts.length === 1) {
    return { action: parts[0] };
  }

  if (parts.length === 2) {
    return {
      resource: parts[0],
      action: parts[1],
    };
  }

  if (parts.length === 3) {
    return {
      resource: parts[0],
      action: parts[1],
      scope: parts[2] as Permission["scope"],
    };
  }

  return { action: permission };
};

/**
 * Build permission string from components
 */
export const buildPermission = (
  resource: string,
  action: string,
  scope?: Permission["scope"]
): string => {
  let permission = `${resource}.${action}`;
  if (scope) {
    permission += `.${scope}`;
  }
  return permission;
};

/**
 * Check if user can access navigation item
 */
export const canAccessNavigation = (
  userRole: UserRole,
  navigationKey: keyof typeof NAVIGATION_PERMISSIONS
): boolean => {
  const requiredRole = NAVIGATION_PERMISSIONS[navigationKey];
  console.log(userRole, "Required Role for", navigationKey, ":", requiredRole);
  return hasRoleLevel(userRole, requiredRole);
};

/**
 * Check if user can access route
 */
export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  // Try exact match first
  let requiredRole = PROTECTED_ROUTES[route as keyof typeof PROTECTED_ROUTES];

  // If no exact match, try pattern matching
  if (!requiredRole) {
    const routePatterns = Object.keys(PROTECTED_ROUTES);
    const matchingPattern = routePatterns.find((pattern) => {
      // Convert pattern to regex (replace [param] with actual values)
      const regex = new RegExp(
        "^" + pattern.replace(/\[.*?\]/g, "[^/]+") + "$"
      );
      return regex.test(route);
    });

    if (matchingPattern) {
      requiredRole =
        PROTECTED_ROUTES[matchingPattern as keyof typeof PROTECTED_ROUTES];
    }
  }

  // If route not protected, allow access
  if (!requiredRole) return true;

  return hasRoleLevel(userRole, requiredRole);
};

/**
 * Check resource permission with context
 */
export const canPerformAction = (
  userRole: UserRole,
  permission: string,
  context?: PermissionContext
): boolean => {
  const parsed = parsePermission(permission);
  const permissionKey = parsed.resource
    ? `${parsed.resource}.${parsed.action}`
    : parsed.action;

  // Check if permission exists in resource permissions
  const requiredRole =
    RESOURCE_PERMISSIONS[permissionKey as keyof typeof RESOURCE_PERMISSIONS];
  if (!requiredRole) return false;

  // Basic role check
  if (!hasRoleLevel(userRole, requiredRole)) return false;

  // If no context or scope, basic role check is sufficient
  if (!context || !parsed.scope) return true;

  // Apply scope-based context checks
  switch (parsed.scope) {
    case "own":
      return context.resourceOwner === context.userId;

    case "assigned":
      return Boolean(context.assignedTo?.includes(context.userId || ""));

    case "department":
      return (context.departments && context.departments.length > 0) || false;

    case "any":
    default:
      return true;
  }
};

/**
 * Check ownership of resource
 */
export const isResourceOwner = (
  resourceOwnerId?: string,
  currentUserId?: string
): boolean => {
  return (
    !!resourceOwnerId && !!currentUserId && resourceOwnerId === currentUserId
  );
};

/**
 * Check if user belongs to any of the specified departments
 */
export const belongsToDepartment = (
  userDepartments?: string[],
  requiredDepartments?: string[]
): boolean => {
  if (!userDepartments || !requiredDepartments) return false;
  return requiredDepartments.some((dept) => userDepartments.includes(dept));
};

/**
 * Get all accessible navigation items for role
 */
export const getAccessibleNavigation = (userRole: UserRole): string[] => {
  return Object.entries(NAVIGATION_PERMISSIONS)
    .filter(([, requiredRole]) => hasRoleLevel(userRole, requiredRole))
    .map(([navKey]) => navKey);
};

/**
 * Get role name as string
 */
export const getRoleName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: "Admin",
    [UserRole.MANAGER]: "Manager",
    [UserRole.STAFF]: "Staff",
    [UserRole.TENANT]: "Tenant",
    [UserRole.VENDOR]: "Vendor",
  };
  return roleNames[role] || "Unknown";
};

/**
 * Check if role can manage other role
 */
export const canManageRole = (
  managerRole: UserRole,
  targetRole: UserRole
): boolean => {
  // Admins can manage everyone
  if (managerRole === UserRole.ADMIN) return true;

  // Managers can manage staff, tenants, and vendors
  if (managerRole === UserRole.MANAGER) {
    return [UserRole.STAFF, UserRole.TENANT, UserRole.VENDOR].includes(
      targetRole
    );
  }

  // Staff can't manage anyone
  return false;
};

// Type helpers for better IDE support
export type NavigationKey = keyof typeof NAVIGATION_PERMISSIONS;
export type ResourcePermissionKey = keyof typeof RESOURCE_PERMISSIONS;
export type ProtectedRoute = keyof typeof PROTECTED_ROUTES;
