import { EmployeeInfo } from "./invitation.interface";

export type IUserRoleType = "manager" | "vendor" | "tenant" | "staff" | "admin";

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
  userType?: 'employee' | 'vendor' | 'tenant';
  
  // Type-specific information (conditional based on userType)
  employeeInfo?: EmployeeInfo;
  vendorInfo?: FilteredVendorInfo;
  tenantInfo?: TenantInfo;
}

/**
 * Extended vendor info that includes additional fields from getUsersByRole
 */
export interface FilteredVendorInfo {
  isLinkedAccount?: boolean;
  linkedVendorId?: string;
  isPrimaryVendor?: boolean;
  [key: string]: any;
}

/**
 * Tenant information placeholder
 * TODO: Define based on tenant model when available
 */
export interface TenantInfo {
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

export interface IUsersResponse {
  data: {
    users: FilteredUser[];
    pagination: PaginateResult;
  };
}