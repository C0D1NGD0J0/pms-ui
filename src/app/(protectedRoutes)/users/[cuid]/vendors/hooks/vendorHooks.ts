import { useState } from "react";
import { useNotification } from "@hooks/useNotification";
import { vendorService, userService } from "@src/services";
import { IFilteredVendorsParams, VendorStats } from "@src/interfaces";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { COMMON_STATUS_OPTIONS, COMMON_SORT_OPTIONS } from "@utils/constants";
import {
  EmployeeDetailResponse,
  VendorDetailResponse,
} from "@interfaces/user.interface";
import {
  VENDOR_SERVICE_OPTIONS,
  VENDOR_QUERY_KEYS,
  USER_QUERY_KEYS,
} from "@utils/constants";

// Local VendorQueryParams interface
interface VendorQueryParams {
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export const useGetVendor = (
  cuid: string,
  vuid: string,
  isTeamMember: boolean = false
) => {
  const query = useQuery<VendorDetailResponse>({
    enabled: !!cuid && !!vuid,
    queryKey: VENDOR_QUERY_KEYS.getVendorByUid(cuid, vuid),
    queryFn: async () => {
      let response;
      console.log("isTeamMember:", isTeamMember);
      if (isTeamMember) {
        response = await userService.getUserEmployeeDetails(cuid, vuid);
      } else {
        response = await vendorService.getVendorDetails(cuid, vuid);
      }
      return response;
    },
  });

  return {
    vendor: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};

export const useUpdateVendor = (cuid: string, vuid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: (data: any) => vendorService.updateVendor(cuid, vuid, data),
    onSuccess: () => {
      message.success("Vendor updated successfully!");
      queryClient.invalidateQueries({
        queryKey: VENDOR_QUERY_KEYS.getVendorByUid(cuid, vuid),
      });
      queryClient.invalidateQueries({
        queryKey: [VENDOR_QUERY_KEYS.getClientVendors(cuid, {})],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update vendor"
      );
    },
  });
};

export const useGetVendors = (
  cuid: string,
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
    queryKey: VENDOR_QUERY_KEYS.getClientVendors(cuid, queryParams),
    queryFn: async () => {
      const vendorQuery: IFilteredVendorsParams = {
        ...(queryParams.status && { status: queryParams.status }),
        ...(queryParams.page && { page: queryParams.page }),
        ...(queryParams.limit && { limit: queryParams.limit }),
        ...(queryParams.sortBy && { sortBy: queryParams.sortBy }),
        ...(queryParams.sort && { sort: queryParams.sort }),
      };

      const resp = await vendorService.getFilteredVendors(cuid, vendorQuery);
      return resp;
    },
  });

  const updateQueryParams = (newParams: Partial<VendorQueryParams>) => {
    setQueryParams((prev: VendorQueryParams) => ({
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
    vendors: query.data?.items || [],
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
    handleSortDirectionChange,
    handleSortByChange,
    handleStatusFilter,
    handleServiceTypeFilter,

    sortOptions: COMMON_SORT_OPTIONS,
    serviceOptions: VENDOR_SERVICE_OPTIONS,
    statusOptions: COMMON_STATUS_OPTIONS,
  };
};

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

export const useGetUserOrVendor = (
  cuid: string,
  resourceId: string,
  userType: "employee" | "vendor"
) => {
  const query = useQuery<VendorDetailResponse | EmployeeDetailResponse>({
    enabled: !!cuid && !!resourceId && !!userType,
    queryKey:
      userType === "vendor"
        ? VENDOR_QUERY_KEYS.getVendorByUid(cuid, resourceId)
        : USER_QUERY_KEYS.getUserByUid(cuid, resourceId),
    queryFn: async () => {
      if (userType === "vendor") {
        return await vendorService.getVendorDetails(cuid, resourceId);
      } else {
        return await userService.getUserEmployeeDetails(cuid, resourceId);
      }
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    userType,
  };
};

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
    setQueryParams((prev: VendorQueryParams) => ({
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
    handleSortDirectionChange,
    handleSortByChange,
    handleStatusFilter,
    handleServiceTypeFilter,

    sortOptions: COMMON_SORT_OPTIONS,
    statusOptions: COMMON_STATUS_OPTIONS,
  };
};
