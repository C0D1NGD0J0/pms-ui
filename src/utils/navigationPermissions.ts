/**
 * Simplified Navigation Permissions
 * Uses role hierarchy instead of complex permission mappings
 */

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff", // aka employee
  TENANT = "tenant",
  VENDOR = "vendor",
}

export enum NavigationItem {
  DASHBOARD = "dashboard",
  PROPERTIES = "properties",
  LEASES = "leases",
  MAINTENANCE = "maintenance",
  USERS = "users",
  CLIENT_SETTINGS = "client_settings",
  PROFILE_SETTINGS = "profile_settings",
  ACCOUNT_SETTINGS = "account_settings", // Added for useMenuItems.tsx
  REPORTS = "reports",
  // Additional navigation items used in useMenuItems.tsx
  WALLET = "wallet",
  VIEWINGS = "viewings",
  USERS_TENANTS = "users_tenants",
  USERS_VENDORS = "users_vendors",
  USERS_EMPLOYEES = "users_employees",
  USERS_ADD = "users_add",
  SERVICE_REQUESTS = "service_requests",
}

// Simple role hierarchy - higher roles inherit access from lower roles
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 5,
  [UserRole.MANAGER]: 4,
  [UserRole.STAFF]: 3,
  [UserRole.TENANT]: 2,
  [UserRole.VENDOR]: 1,
};

// Navigation access based on minimum role level required
export const NAVIGATION_ACCESS: Record<NavigationItem, UserRole> = {
  [NavigationItem.DASHBOARD]: UserRole.VENDOR, // Everyone can access dashboard
  [NavigationItem.PROPERTIES]: UserRole.STAFF, // Staff and above
  [NavigationItem.LEASES]: UserRole.STAFF, // Staff and above
  [NavigationItem.MAINTENANCE]: UserRole.VENDOR, // Vendors and above
  [NavigationItem.USERS]: UserRole.MANAGER, // Managers and above
  [NavigationItem.CLIENT_SETTINGS]: UserRole.MANAGER, // Managers and above
  [NavigationItem.REPORTS]: UserRole.STAFF, // Staff and above
  [NavigationItem.PROFILE_SETTINGS]: UserRole.VENDOR, // Vendors and above
  [NavigationItem.ACCOUNT_SETTINGS]: UserRole.VENDOR, // Everyone can access their account settings
  // Additional navigation items
  [NavigationItem.WALLET]: UserRole.TENANT, // Tenants and above
  [NavigationItem.VIEWINGS]: UserRole.TENANT, // Tenants and above
  [NavigationItem.USERS_TENANTS]: UserRole.MANAGER, // Managers and above
  [NavigationItem.USERS_VENDORS]: UserRole.MANAGER, // Managers and above
  [NavigationItem.USERS_EMPLOYEES]: UserRole.MANAGER, // Managers and above
  [NavigationItem.USERS_ADD]: UserRole.MANAGER, // Managers and above
  [NavigationItem.SERVICE_REQUESTS]: UserRole.VENDOR, // Vendors and above
};

// Basic route protection - maps routes to minimum role required
export const PROTECTED_ROUTES: Record<string, UserRole> = {
  "/dashboard": UserRole.VENDOR,
  "/client_settings/[cuid]": UserRole.MANAGER,
  "/properties": UserRole.STAFF,
  "/properties/new": UserRole.MANAGER,
  "/properties/[pid]": UserRole.STAFF,
  "/properties/[pid]/edit": UserRole.STAFF,
  "/users": UserRole.MANAGER,
  "/leases": UserRole.STAFF,
  "/leases/[lid]": UserRole.STAFF,
  "/leases/[lid]/edit": UserRole.STAFF,
  "/maintenance": UserRole.VENDOR,
  "/reports": UserRole.MANAGER,
};

/**
 * Check if user role can access navigation item
 */
export const roleHasNavigationAccess = (
  userRole: UserRole,
  navItem: NavigationItem
): boolean => {
  const requiredRole = NAVIGATION_ACCESS[navItem];
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Check if user role can access route
 */
export const roleCanAccessRoute = (
  userRole: UserRole,
  route: string
): boolean => {
  // Normalize route for matching (replace dynamic segments)
  const normalizedRoute = route.replace(/\/\[.*?\]/g, "/[param]");

  const requiredRole =
    PROTECTED_ROUTES[route] || PROTECTED_ROUTES[normalizedRoute];
  if (!requiredRole) return true; // Route not protected

  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Get all accessible navigation items for a role
 */
export const getAccessibleNavigationItems = (
  userRole: UserRole
): NavigationItem[] => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;

  return Object.entries(NAVIGATION_ACCESS)
    .filter(([, requiredRole]) => {
      const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
      return userLevel >= requiredLevel;
    })
    .map(([navItem]) => navItem as NavigationItem);
};

/**
 * Check if user role can inherit permissions from target role
 */
export const roleCanInheritFrom = (
  currentRole: UserRole,
  targetRole: UserRole
): boolean => {
  const currentLevel = ROLE_HIERARCHY[currentRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;

  return currentLevel >= targetLevel;
};
