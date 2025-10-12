import { useState } from "react";
import { USER_QUERY_KEYS } from "@src/utils";
import { useQuery } from "@tanstack/react-query";
import { IFilteredTenantsParams, tenantService } from "@src/services";
import {
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
} from "@app/(protectedRoutes)/shared-hooks/constants";

export const useGetTenants = (
  cuid: string,
  initialParams?: IFilteredTenantsParams
) => {
  const baseParams: IFilteredTenantsParams = {
    status: initialParams?.status || "active",
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    sortBy: initialParams?.sortBy || "",
    search: initialParams?.search || "",
    sort: initialParams?.sort || "desc",
  };
  const [queryParams, setQueryParams] = useState<IFilteredTenantsParams>(
    baseParams || { page: 1, limit: 10 }
  );

  const query = useQuery({
    queryKey: [USER_QUERY_KEYS.getClientTenants, cuid, queryParams],
    queryFn: async () => {
      const tenantQuery = {
        ...(queryParams.page && { page: queryParams.page }),
        ...(queryParams.limit && { limit: queryParams.limit }),
        ...(queryParams.sortBy && { sortBy: queryParams.sortBy }),
        ...(queryParams.sort && { sort: queryParams.sort }),
        ...(queryParams.search && { search: queryParams.search }),
        ...(queryParams.status && { status: queryParams.status }),
      };
      const resp = await tenantService.getTenants(cuid, tenantQuery);
      return resp;
    },
  });

  const updateQueryParams = (newParams: Partial<IFilteredTenantsParams>) => {
    setQueryParams((prev: IFilteredTenantsParams) => ({
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

  const handleSearch = (search: string) => {
    updateQueryParams({ search, page: 1 });
  };

  const handleStatusFilter = (status: "active" | "inactive" | "") => {
    updateQueryParams({ status: status || undefined, page: 1 });
  };

  const sortOptions = COMMON_SORT_OPTIONS;
  const statusOptions = COMMON_STATUS_OPTIONS;

  return {
    tenants: query.data?.items || [],
    totalCount: query.data?.pagination?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    pagination: {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      sort: queryParams.sort,
    },
    queryParams,
    updateQueryParams,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
    handleSearch,
    handleStatusFilter,
    // Filter options
    sortOptions,
    statusOptions,
  };
};
