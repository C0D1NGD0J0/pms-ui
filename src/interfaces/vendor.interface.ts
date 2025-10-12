export interface VendorQueryParams {
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export interface VendorStatsQueryParams {
  status?: "active" | "inactive";
}

export interface VendorStats {
  businessTypeDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  servicesDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  totalVendors: number;
  // Legacy compatibility fields
  departmentDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  roleDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
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
