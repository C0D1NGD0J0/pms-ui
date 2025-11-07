/**
 * Common interfaces used across the application
 * This file contains base interfaces that are shared between different modules
 */

// Unified Role Type (consolidating IUserRoleType and IUserRole)
export type UserRole =
  | "admin"
  | "tenant"
  | "manager"
  | "staff"
  | "landlord"
  | "vendor";

// Unified Pagination Interface (consolidating PaginateResult and IPaginationResponse)
export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  hasMoreResource?: boolean;
}

export interface StatsDistribution {
  name: string;
  value: number;
  percentage: number;
}

export interface ServerResponse<T> {
  success: boolean;
  msg?: string;
  data: T;
}

export type ServerResponseWithPagination<T> = {
  success: boolean;
  msg?: string;
  data: {
    items: T;
    pagination: PaginationResult;
  };
};

export interface ErrorReturnData {
  success: boolean;
  msg: string;
  errors?: { path: string; message: string }[];
}

// Theme interfaces
export type Theme = "light" | "dark";
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Filter Option Interface (used for dropdowns/selects)
export interface FilterOption {
  label: string;
  value: string;
}

export interface NestedQueryParams {
  pagination?: PaginationQuery;
  filter?: FilterParams;
}

export type PaginationQuery = {
  page: number;
  limit: number;
  total?: number;
  sortBy?: string;
  order?: "asc" | "desc" | "";
};

export interface FilterParams {
  search?: string;
  status?: "active" | "inactive" | string;
  [key: string]: any;
}

export interface ParsedError {
  message: string;
  fieldErrors: Record<string, string[]>;
  statusCode?: number;
  hasValidationErrors?: boolean;
}
