import { StatsDistribution } from "./common.interface";

// Re-export QueryParams as VendorQueryParams for backward compatibility
export type { QueryParams as VendorQueryParams } from "./common.interface";

export interface VendorStatsQueryParams {
  status?: "active" | "inactive";
}

export interface VendorStats {
  businessTypeDistribution: StatsDistribution[];
  servicesDistribution: StatsDistribution[];
  totalVendors: number;
  // Legacy compatibility fields
  departmentDistribution: StatsDistribution[];
  roleDistribution: StatsDistribution[];
  totalFilteredUsers: number;
}

export interface IFilteredVendorsParams {
  status?: "active" | "inactive";
  businessType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}
