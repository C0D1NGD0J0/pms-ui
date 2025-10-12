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

// Alternative pagination format for backward compatibility
export interface PaginationResponse {
  total: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  hasMoreResource: boolean;
}

// Generic query parameters interface
export interface QueryParams {
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

// Stats distribution interface (consolidating StatsDistribution)
export interface StatsDistribution {
  name: string;
  value: number;
  percentage: number;
}

// Server response interfaces
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

export type PaginationQuery = {
  page: number;
  limit: number;
  total?: number;
  sortBy?: string;
  sort?: "asc" | "desc" | "";
};

// Generic filter interface that extends pagination
export interface FilterQuery<TSortBy = string, TStatus = string>
  extends Omit<PaginationQuery, "sortBy"> {
  status?: TStatus;
  sortBy?: TSortBy;
}

export interface ParsedError {
  message: string;
  fieldErrors: Record<string, string[]>;
  statusCode?: number;
  hasValidationErrors?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
}
