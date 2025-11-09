import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@src/services/users";
import {
  UserStatsQueryParams,
  IUserRoleType,
  IUserStats,
} from "@interfaces/user.interface";
import {
  COMMON_DEPARTMENT_OPTIONS,
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
  ALL_ROLE_OPTIONS,
  USER_QUERY_KEYS,
  TYPE_OPTIONS,
} from "@utils/constants";

export interface FilteredUsersQueryParams {
  type?: "employee" | "tenant" | "vendor";
  role?: IUserRoleType | IUserRoleType[];
  department?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export const useGetFilteredUsers = (
  cuid: string,
  initialParams?: FilteredUsersQueryParams
) => {
  const [queryParams, setQueryParams] = useState<FilteredUsersQueryParams>(
    initialParams || { page: 1, limit: 10 }
  );

  // Use shared filter options
  const sortOptions = COMMON_SORT_OPTIONS;
  const typeOptions = TYPE_OPTIONS;
  const departmentOptions = COMMON_DEPARTMENT_OPTIONS;
  const roleOptions = ALL_ROLE_OPTIONS;
  const statusOptions = COMMON_STATUS_OPTIONS;

  const query = useQuery({
    queryKey: [USER_QUERY_KEYS.getClientUsers, cuid, queryParams],
    queryFn: async () => {
      const userQuery = {
        pagination: {
          page: queryParams.page || 1,
          limit: queryParams.limit || 10,
          ...(queryParams.sortBy && { sortBy: queryParams.sortBy }),
          ...(queryParams.sort && { order: queryParams.sort }),
        },
        filter: {
          ...(queryParams.search && { search: queryParams.search }),
          ...(queryParams.role && { role: queryParams.role }),
          ...(queryParams.department && { department: queryParams.department }),
          ...(queryParams.status && { status: queryParams.status }),
        },
      };
      const resp = await userService.getFilteredUsers(cuid, userQuery);
      return resp;
    },
  });

  const updateQueryParams = (newParams: Partial<FilteredUsersQueryParams>) => {
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

  const handleSortDirectionChange = () => {
    const currentSort = queryParams.sort || "desc"; // Default to desc if undefined
    const newSort = currentSort === "asc" ? "desc" : "asc";
    updateQueryParams({ sort: newSort });
  };

  const handleSortByChange = (sortBy: string) => {
    updateQueryParams({ sortBy });
  };

  const handleSearch = (search: string) => {
    updateQueryParams({ search, page: 1 });
  };

  const handleTypeFilter = (type: "employee" | "vendor" | "") => {
    if (type === "") return;
    updateQueryParams({ type: type || undefined, page: 1 });
  };

  const handleRoleFilter = (role: IUserRoleType | IUserRoleType[] | "") => {
    updateQueryParams({ role: role || undefined, page: 1 });
  };

  const handleDepartmentFilter = (department: string) => {
    updateQueryParams({ department: department || undefined, page: 1 });
  };

  const handleStatusFilter = (status: "active" | "inactive" | "") => {
    updateQueryParams({ status: status || undefined, page: 1 });
  };

  return {
    data: query.data?.items || [],
    totalCount: query.data?.pagination?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    queryParams,
    updateQueryParams,
    handlePageChange,
    handleLimitChange,
    handleSortDirectionChange,
    handleSortByChange,
    handleSearch,
    handleTypeFilter,
    handleRoleFilter,
    handleDepartmentFilter,
    handleStatusFilter,
    // Filter options
    sortOptions,
    typeOptions,
    departmentOptions,
    roleOptions,
    statusOptions,
  };
};

export const useGetUserStats = (
  cuid: string,
  filterParams?: UserStatsQueryParams
) => {
  const query = useQuery({
    queryKey: USER_QUERY_KEYS.getUserStats(cuid, filterParams),
    queryFn: async () => {
      const userQuery = {
        filter: {
          ...(filterParams?.role && { role: filterParams.role }),
        },
      };

      const resp = await userService.getUserStats(cuid, userQuery);
      return resp as IUserStats;
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
