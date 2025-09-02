import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VendorQueryParams } from "@src/interfaces";
import { VENDOR_QUERY_KEYS } from "@utils/constants";
import { IFilteredVendorsParams, vendorService } from "@services/vendors";
import {
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
} from "@app/(protectedRoutes)/shared-hooks/constants";

export const useGetVendorTeamMembers = (
  cuid: string,
  vuid: string,
  initialParams?: VendorQueryParams
) => {
  const [queryParams, setQueryParams] = useState<VendorQueryParams>(
    initialParams || {
      status: "active",
      page: 1,
      limit: 10,
      sort: "asc",
    }
  );

  const query = useQuery({
    queryKey: VENDOR_QUERY_KEYS.getVendorTeamMembers(cuid, vuid, queryParams),
    queryFn: async () => {
      const vendorQuery: IFilteredVendorsParams = {
        ...(queryParams.status && { status: queryParams.status }),
        ...(queryParams.page && { page: queryParams.page }),
        ...(queryParams.limit && { limit: queryParams.limit }),
        ...(queryParams.sortBy && { sortBy: queryParams.sortBy }),
        ...(queryParams.sort && { sort: queryParams.sort }),
      };

      const resp = await vendorService.getVendorTeamMembers(
        cuid,
        vuid,
        vendorQuery
      );
      return resp;
    },
  });

  const updateQueryParams = (newParams: Partial<VendorQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleLimitChange = (limit: number) => {
    updateQueryParams({ limit, page: 1 });
  };

  const handleSortChange = (sort: "asc" | "desc") => {
    updateQueryParams({ sort });
  };

  const handleSortByChange = (sortBy: string) => {
    updateQueryParams({ sortBy });
  };

  const handleStatusFilter = (status: "active" | "inactive" | "") => {
    updateQueryParams({ status: status || undefined, page: 1 });
  };

  const handleServiceTypeFilter = (serviceType: string) => {
    updateQueryParams({
      sortBy: serviceType !== "all" ? serviceType : undefined,
      page: 1,
    });
  };

  return {
    teamMembers: query.data?.items || [],
    totalCount: query.data?.pagination?.total || 0,

    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
    queryParams,
    updateQueryParams,

    pagination: {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      sort: queryParams.sort,
    },

    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
    handleStatusFilter,
    handleServiceTypeFilter,

    sortOptions: COMMON_SORT_OPTIONS,
    statusOptions: COMMON_STATUS_OPTIONS,
  };
};
