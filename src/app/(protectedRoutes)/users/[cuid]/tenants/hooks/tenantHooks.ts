import { useState } from "react";
import { userService } from "@services/index";
import { useNotification } from "@hooks/useNotification";
import { IFilteredTenantsParams } from "@interfaces/user.interface";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
  USER_QUERY_KEYS,
} from "@src/utils";

export const useGetClientTenant = (
  cuid: string,
  uid: string,
  include?: string[]
) => {
  const query = useQuery({
    enabled: !!cuid && !!uid,
    queryKey: [...USER_QUERY_KEYS.getClientTenant(cuid, uid), include],
    queryFn: async () => {
      const response = await userService.getClientTenantDetails(
        cuid,
        uid,
        include
      );
      return response;
    },
  });

  return {
    tenant: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};

export const useUpdateTenant = (cuid: string, uid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: (data: any) => userService.updateTenant(cuid, uid, data),
    onSuccess: () => {
      message.success("Tenant updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [`/users/${cuid}/filtered-tenants`],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update tenant"
      );
    },
  });
};

export const useDeactivateTenant = (cuid: string, uid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: () => userService.deactivateTenant(cuid, uid),
    onSuccess: () => {
      message.success("Tenant deactivated successfully!");
      queryClient.invalidateQueries({
        queryKey: [`/users/${cuid}/filtered-tenants`],
      });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getClientTenant(cuid, uid),
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to deactivate tenant"
      );
    },
  });
};

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
      const resp = await userService.getTenants(cuid, tenantQuery);
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

  const handleSortDirectionChange = () => {
    const currentSort = queryParams.sort || "desc";
    const newSort = currentSort === "asc" ? "desc" : "asc";
    updateQueryParams({ sort: newSort });
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
    handleSortDirectionChange,
    handleSortByChange,
    handleSearch,
    handleStatusFilter,
    // Filter options
    sortOptions,
    statusOptions,
  };
};
