import { EmployeeInfo } from "./invitation.interface";

// TODO: When backend types are accessible, replace with proper imports:
// import type { VendorInfo } from '@shared/interfaces/profile.interface';
type VendorInfo = any; // Use actual VendorInfo from backend when available

export type IUserRoleType =
  | "admin"
  | "tenant"
  | "manager"
  | "staff"
  | "landlord"
  | "vendor";

/**
 * Individual user structure returned by getFilteredUsers
 * This is the formatted user object that the frontend receives
 */
export interface FilteredUser {
  // Basic user information
  id: string;
  email: string;
  displayName: string;
  roles: IUserRoleType[];
  isConnected: boolean;
  createdAt: Date | string;
  isActive: boolean;

  // Profile information (optional, from populated profile)
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  phoneNumber?: string;

  // User type indicator
  userType?: "employee" | "vendor" | "tenant";

  // Type-specific information (conditional based on userType)
  employeeInfo?: EmployeeInfo;
  vendorInfo?: FilteredVendorInfo;
  tenantInfo?: TenantInfo;
}

/**
 * Extended vendor info specific to filtered users response
 * This extends the base VendorInfo with additional fields
 */
export interface FilteredVendorInfo extends VendorInfo {
  isLinkedAccount?: boolean;
  linkedVendorId?: string;
  isPrimaryVendor?: boolean;
  companyName?: string;
  serviceType?: string;
  contactPerson?: string;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  averageResponseTime?: string;
  averageServiceCost?: number;
}

/**
 * Tenant information interface
 * TODO: Import from backend when available
 */
export interface TenantInfo {
  leaseStartDate?: Date | string;
  leaseEndDate?: Date | string;
  unitNumber?: string;
  rentAmount?: number;
  paymentStatus?: "current" | "overdue" | "pending";
  [key: string]: any;
}

export interface IEmployeeTableData {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
  department?: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: IUserRoleType[];
  startDate?: Date | string;
  employeeId?: string;
}

// Pagination result interface to match backend response
export interface PaginateResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IListResponseWithPagination {
  items: FilteredUser[];
  pagination: PaginateResult;
}

/**
 * Response structure from getFilteredUsers method
 */
export interface GetFilteredUsersResponse {
  success: boolean;
  data: {
    users: FilteredUser[];
    pagination: PaginateResult;
  };
  message: string;
}

/**
 * Filter options for querying users
 * Matches the backend IUserFilterOptions with additional frontend-specific fields
 */
export interface UserFilterOptions {
  role?: IUserRoleType | IUserRoleType[] | string; // Can be single, array, or comma-separated string
  type?: "employee" | "tenant" | "vendor";
  department?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

/**
 * Helper function to format role parameter for API request
 * Handles single role, array of roles, or comma-separated string
 */
export function formatRoleParameter(
  role: IUserRoleType | IUserRoleType[] | string
): string {
  if (Array.isArray(role)) {
    return role.join(",");
  }
  return role;
}

/**
 * Type guard to check if a user is an employee
 */
export function isEmployee(
  user: FilteredUser
): user is FilteredUser & { employeeInfo: EmployeeInfo } {
  return user.userType === "employee" && user.employeeInfo !== undefined;
}

/**
 * Type guard to check if a user is a vendor
 */
export function isVendor(
  user: FilteredUser
): user is FilteredUser & { vendorInfo: FilteredVendorInfo } {
  return user.userType === "vendor" && user.vendorInfo !== undefined;
}

/**
 * Type guard to check if a user is a tenant
 */
export function isTenant(
  user: FilteredUser
): user is FilteredUser & { tenantInfo: TenantInfo } {
  return user.userType === "tenant" && user.tenantInfo !== undefined;
}
