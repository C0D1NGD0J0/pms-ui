import { EmployeeInfo, VendorInfo } from "./invitation.interface";
import {
  StatsDistribution,
  PaginationResult,
  UserRole,
} from "./common.interface";

// Re-export UserRole as IUserRoleType for backward compatibility
export type IUserRoleType = UserRole;

export interface EmployeeDetailResponse {
  profile: {
    firstName: string;
    lastName: string;
    fullName: string;
    avatar: {
      url: string;
    };
    phoneNumber: string;
    email: string;
    about: string;
    contact: {
      phone: string;
      email: string;
    };
    uid: string;
    displayName: string;
    roles: string[];
    isActive: boolean;
    userType: "employee";
  };
  status: string;
  properties: any[];
  tasks: any[];
  documents: any[];
  employeeInfo: {
    employeeId: string;
    hireDate: string;
    tenure: string;
    employmentType: string;
    department: string;
    position: string;
    directManager: string;
    skills: string[];
    officeInfo: {
      address: string;
      city: string;
      workHours: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    stats: {
      propertiesManaged: number;
      unitsManaged: number;
      tasksCompleted: number;
      onTimeRate: string;
      rating: string;
      activeTasks: number;
    };
    performance: {
      taskCompletionRate: string;
      tenantSatisfaction: string;
      avgOccupancyRate: string;
      avgResponseTime: string;
    };
    tags: string[];
  };
}

/**
 * Individual user structure returned by getFilteredUsers
 * This is the formatted user object that the frontend receives
 */
export interface FilteredUser {
  // Basic user information
  uid: string;
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
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  averageResponseTime?: string;
  averageServiceCost?: number;
}

export interface TenantInfo {
  employerInfo?: Array<{
    cuid: string;
    companyName: string;
    position: string;
    monthlyIncome: number;
    contactPerson: string;
    companyAddress: string;
    contactEmail: string;
  }>;
  activeLeases?: Array<{
    cuid: string;
    confirmedDate: Date | string;
    confirmed: boolean;
    leaseId: string;
  }>;
  backgroundChecks?: Array<{
    cuid: string;
    status: string;
    checkedDate: Date | string;
    expiryDate?: Date | string;
    notes?: string;
  }>;
  rentalReferences?: Array<{
    landlordName: string;
    propertyAddress: string;
    [key: string]: any;
  }>;
  pets?: Array<{
    type: string;
    breed: string;
    isServiceAnimal: boolean;
    [key: string]: any;
  }>;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email: string;
  };
  leaseHistory?: Array<{
    propertyName: string;
    unitNumber: string;
    leaseStart: Date | string;
    leaseEnd: Date | string;
    rentAmount: number;
    status: "completed" | "active" | "terminated";
  }>;
  paymentHistory?: Array<{
    date: Date | string;
    amount: number;
    type: "rent" | "fee" | "deposit";
    status: "paid" | "late" | "pending";
    dueDate: Date | string;
  }>;
  maintenanceRequests?: Array<{
    requestId: string;
    date: Date | string;
    type: string;
    status: "pending" | "in_progress" | "completed";
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
  }>;
  notes?: Array<{
    date: Date | string;
    author: string;
    note: string;
    type: "general" | "payment" | "maintenance" | "lease";
  }>;
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

// Use PaginationResult from common.interface.ts as PaginateResult for backward compatibility
export type PaginateResult = PaginationResult;

export interface IListResponseWithPagination {
  items: FilteredUserTableData[];
  pagination: PaginateResult;
}

/**
 * User statistics for filtered users response
 */
export interface IUserStats {
  departmentDistribution: StatsDistribution[];
  roleDistribution: StatsDistribution[];
  totalFilteredUsers: number;
}

/**
 * Minimal employee info for table display
 */
export interface FilteredUserEmployeeInfo {
  jobTitle?: string;
  department?: string;
  startDate?: Date | string;
}

/**
 * Minimal vendor info for table display
 */
export interface FilteredUserVendorInfo {
  averageResponseTime?: string;
  averageServiceCost?: number;
  businessType?: string;
  companyName?: string;
  completedJobs?: number;
  contactPerson?: string;
  isLinkedAccount?: boolean;
  isPrimaryVendor?: boolean;
  linkedVendorId?: string;
  rating?: number;
  vuid: string;
  reviewCount?: number;
  serviceType?: string;
}

/**
 * Minimal tenant info for table display
 */
export interface FilteredUserTenantInfo {
  unitNumber?: string;
  leaseStatus?: string;
  rentStatus?: string;
  propertyName?: string;
  leaseStartDate?: string | Date;
  leaseEndDate?: string | Date;
  monthlyRent?: number;
}

/**
 * Lightweight user data for table display only
 * Contains only the fields needed for table rendering
 */
export interface FilteredUserTableData {
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  phoneNumber?: string;
  isActive: boolean;
  isConnected: boolean;
  employeeInfo?: FilteredUserEmployeeInfo;
  vendorInfo?: FilteredUserVendorInfo;
  tenantInfo?: FilteredUserTenantInfo;
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
 * Structured response for getClientUserInfo
 */
export interface IUserDetailResponse {
  profile: {
    firstName: string;
    lastName: string;
    fullName: string;
    avatar: any;
    phoneNumber: string;
    email: string;
    about: string;
    contact: {
      phone: string;
      email: string;
    };
    uid: string;
    displayName: string;
    roles: string[];
    isActive: boolean;
    userType: "employee" | "vendor" | "tenant";
  };
  employeeInfo?: IEmployeeDetailInfo;
  vendorInfo?: IVendorDetailInfo;
  tenantInfo?: ITenantDetailInfo;
  userType: "vendor" | "employee";
  properties: any[];
  documents: any[];
  status: string;
  tasks: any[];
  services?: any[]; // Services for vendor users
}

/**
 * Vendor detail information for getClientUserInfo response
 */
export interface IVendorDetailInfo {
  servicesOffered: {
    plumbing?: boolean;
    electrical?: boolean;
    hvac?: boolean;
    cleaning?: boolean;
    landscaping?: boolean;
    painting?: boolean;
    carpentry?: boolean;
    roofing?: boolean;
    security?: boolean;
    pestControl?: boolean;
    applianceRepair?: boolean;
    maintenance?: boolean;
    other?: boolean;
  };
  stats: {
    completedJobs: number;
    activeJobs: number;
    rating: string;
    responseTime: string;
    onTimeRate: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    expirationDate: Date | null;
    coverageAmount: number;
  };
  contactPerson: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  serviceAreas: {
    baseLocation: string;
    maxDistance: number;
  };
  linkedVendorId: string | null;
  registrationNumber: string;
  isLinkedAccount: boolean;
  isPrimaryVendor: boolean;
  yearsInBusiness: number;
  businessType: string;
  companyName: string;
  tags: string[];
  taxId: string;
  // Additional fields that might be used in the UI
  businessAddress?: string;
  businessHours?: string;
  totalRevenue?: string;
  totalProjects?: number;
  activeProjects?: number;
  performance?: {
    avgResponseTime: string;
    completionRate: string;
    customerRating: string;
    repeatRate: string;
  };
  linkedUsers?: Array<{
    uid: string;
    displayName: string;
    email: string;
    isActive: boolean;
    phoneNumber?: string;
  }>;
}

/**
 * Employee detail information for getClientUserInfo response
 */
export interface IEmployeeDetailInfo {
  employeeId: string;
  hireDate: string;
  tenure: string;
  employmentType: string;
  department: string;
  position: string;
  directManager: string;
  skills: string[];
  officeInfo: {
    address: string;
    city: string;
    workHours: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  stats: {
    propertiesManaged: number;
    unitsManaged: number;
    tasksCompleted: number;
    onTimeRate: string;
    rating: string;
    activeTasks: number;
  };
  performance: {
    taskCompletionRate: string;
    tenantSatisfaction: string;
    avgOccupancyRate: string;
    avgResponseTime: string;
  };
  tags: string[];
}

export type ITenantDetailInfo = TenantInfo;

export type VendorDetailResponse = IUserDetailResponse;

export interface UserFilterOptions {
  role?: IUserRoleType | IUserRoleType[] | string;
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

export interface IFilteredTenantsParams {
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export interface EmployeeQueryParams {
  role?: IUserRoleType;
  department?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export interface UserStatsQueryParams {
  role?: IUserRoleType | IUserRoleType[];
  department?: string;
}
