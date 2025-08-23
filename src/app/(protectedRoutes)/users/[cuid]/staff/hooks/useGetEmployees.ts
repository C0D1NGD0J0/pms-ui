import { IUserRoleType } from "@interfaces/user.interface";
import {
  FilteredUsersQueryParams,
  useGetFilteredUsers,
} from "@app/(protectedRoutes)/shared-hooks/useGetFilteredUsers";
import {
  COMMON_DEPARTMENT_OPTIONS,
  COMMON_STATUS_OPTIONS,
  EMPLOYEE_ROLE_OPTIONS,
  COMMON_SORT_OPTIONS,
} from "@app/(protectedRoutes)/shared-hooks/constants";

export interface EmployeeQueryParams {
  role?: IUserRoleType;
  department?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

export const useGetEmployees = (
  cuid: string,
  initialParams?: EmployeeQueryParams
) => {
  const baseParams: FilteredUsersQueryParams = {
    type: "employee",
    role: initialParams?.role ? [initialParams.role] : ["staff", "manager"],
    department: initialParams?.department || "",
    status: initialParams?.status || "active",
    search: initialParams?.search || "",
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    sortBy: initialParams?.sortBy || "",
    sort: initialParams?.sort || "desc",
  };

  const baseHook = useGetFilteredUsers(cuid, baseParams);
  const handleRoleFilter = (role: IUserRoleType | "") => {
    if (role) {
      baseHook.updateQueryParams({ role: [role], page: 1 });
    } else {
      baseHook.updateQueryParams({ role: ["staff", "manager"], page: 1 });
    }
  };

  return {
    employees: baseHook.data,
    totalCount: baseHook.totalCount,

    // Loading states
    isLoading: baseHook.isLoading,
    isError: baseHook.isError,
    error: baseHook.error,

    // Actions
    refetch: baseHook.refetch,
    queryParams: {
      role: Array.isArray(baseHook.queryParams.role)
        ? baseHook.queryParams.role[0]
        : baseHook.queryParams.role,
      department: baseHook.queryParams.department,
      status: baseHook.queryParams.status,
      search: baseHook.queryParams.search,
      page: baseHook.queryParams.page,
      limit: baseHook.queryParams.limit,
      sortBy: baseHook.queryParams.sortBy,
      sort: baseHook.queryParams.sort,
    } as EmployeeQueryParams,

    // Backward compatibility pagination object
    pagination: {
      page: baseHook.queryParams.page || 1,
      limit: baseHook.queryParams.limit || 10,
      sortBy: baseHook.queryParams.sortBy,
      sort: baseHook.queryParams.sort,
    },

    // Handlers (delegate to base hook)
    handlePageChange: baseHook.handlePageChange,
    handleLimitChange: baseHook.handleLimitChange,
    handleSortChange: baseHook.handleSortChange,
    handleSortByChange: baseHook.handleSortByChange,
    handleSearch: baseHook.handleSearch,
    handleRoleFilter, // Custom employee role handler
    handleDepartmentFilter: baseHook.handleDepartmentFilter,
    handleStatusFilter: baseHook.handleStatusFilter,

    // Filter options (use shared constants)
    sortOptions: COMMON_SORT_OPTIONS,
    departmentOptions: COMMON_DEPARTMENT_OPTIONS,
    roleOptions: EMPLOYEE_ROLE_OPTIONS, // Employee-specific roles only
    statusOptions: COMMON_STATUS_OPTIONS,
  };
};
