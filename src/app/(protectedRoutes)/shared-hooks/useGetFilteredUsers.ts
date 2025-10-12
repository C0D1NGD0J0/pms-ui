import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@utils/constants";
import { IUserRoleType } from "@interfaces/user.interface";
import { IFilteredUsersParams, userService } from "@src/services/users";

import {
  COMMON_DEPARTMENT_OPTIONS,
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
  ALL_ROLE_OPTIONS,
  TYPE_OPTIONS,
} from "./constants";

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
      const userQuery: IFilteredUsersParams = {
        ...(queryParams.page && { page: queryParams.page }),
        ...(queryParams.limit && { limit: queryParams.limit }),
        ...(queryParams.sortBy && { sortBy: queryParams.sortBy }),
        ...(queryParams.sort && { sort: queryParams.sort }),
        ...(queryParams.search && { search: queryParams.search }),
        ...(queryParams.role && { role: queryParams.role }),
        ...(queryParams.department && { department: queryParams.department }),
        ...(queryParams.status && { status: queryParams.status }),
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

  const handleSortChange = (sort: "asc" | "desc") => {
    updateQueryParams({ sort });
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
    handleSortChange,
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
