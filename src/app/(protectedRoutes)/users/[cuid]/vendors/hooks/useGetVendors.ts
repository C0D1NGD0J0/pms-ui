import {
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
} from "@app/(protectedRoutes)/shared-hooks/constants";
import {
  FilteredUsersQueryParams,
  useGetFilteredUsers,
} from "@app/(protectedRoutes)/shared-hooks/useGetFilteredUsers";

export interface FilterOption {
  label: string;
  value: string;
}

export interface VendorQueryParams {
  serviceType?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export const VENDOR_SERVICE_OPTIONS = [
  { label: "HVAC", value: "hvac" },
  { label: "All Services", value: "all" },
  { label: "General", value: "general" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
];

export const useGetVendors = (
  cuid: string,
  initialParams?: VendorQueryParams
) => {
  const baseParams: FilteredUsersQueryParams = {
    type: "vendor",
    role: ["vendor"],
    status: initialParams?.status || "active",
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    sortBy: initialParams?.sortBy || "displayName",
    sort: initialParams?.sort || "asc",
  };

  const baseHook = useGetFilteredUsers(cuid, baseParams);
  const handleServiceTypeFilter = (serviceType: string) => {
    baseHook.updateQueryParams({
      sortBy: serviceType || "displayName",
      page: 1,
    });
  };

  return {
    vendors: baseHook.data,
    totalCount: baseHook.totalCount,

    isLoading: baseHook.isLoading,
    isError: baseHook.isError,
    error: baseHook.error,

    refetch: baseHook.refetch,
    queryParams: {
      serviceType:
        baseHook.queryParams.sortBy !== "displayName"
          ? baseHook.queryParams.sortBy
          : undefined,
      status: baseHook.queryParams.status,
      page: baseHook.queryParams.page,
      limit: baseHook.queryParams.limit,
      sortBy: baseHook.queryParams.sortBy,
      sort: baseHook.queryParams.sort,
    } as VendorQueryParams,

    pagination: {
      page: baseHook.queryParams.page || 1,
      limit: baseHook.queryParams.limit || 10,
      sortBy: baseHook.queryParams.sortBy,
      sort: baseHook.queryParams.sort,
    },

    handlePageChange: baseHook.handlePageChange,
    handleLimitChange: baseHook.handleLimitChange,
    handleSortChange: baseHook.handleSortChange,
    handleSortByChange: baseHook.handleSortByChange,
    handleSearch: baseHook.handleSearch,
    handleServiceTypeFilter,
    handleStatusFilter: baseHook.handleStatusFilter,

    sortOptions: COMMON_SORT_OPTIONS,
    serviceOptions: VENDOR_SERVICE_OPTIONS,
    statusOptions: COMMON_STATUS_OPTIONS,
  };
};
