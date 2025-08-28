import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@services/vendors";
import { VENDOR_QUERY_KEYS } from "@utils/constants";

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

export const useGetVendorStats = (cuid: string) => {
  const query = useQuery({
    queryKey: VENDOR_QUERY_KEYS.getVendorStats(cuid),
    queryFn: async () => {
      const resp = await vendorService.getVendorStats(cuid);
      return resp as VendorStats;
    },
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
