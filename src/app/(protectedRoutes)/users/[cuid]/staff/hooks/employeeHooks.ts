import { userService } from "@services/users";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  FilteredUsersQueryParams,
  useGetFilteredUsers,
} from "@app/(protectedRoutes)/users/shared-hooks";
import {
  EmployeeDetailResponse,
  EmployeeQueryParams,
  IUserRoleType,
} from "@interfaces/user.interface";
import {
  COMMON_DEPARTMENT_OPTIONS,
  COMMON_STATUS_OPTIONS,
  EMPLOYEE_ROLE_OPTIONS,
  COMMON_SORT_OPTIONS,
  USER_QUERY_KEYS,
} from "@utils/constants";

export const useGetEmployeeInfo = (
  cuid: string,
  uid: string,
  isTeamMember: boolean = true
) => {
  const query = useQuery<EmployeeDetailResponse>({
    enabled: !!cuid && !!uid && isTeamMember,
    queryKey: USER_QUERY_KEYS.getUserByUid(cuid, uid),
    queryFn: async () => {
      const response = await userService.getUserEmployeeDetails(cuid, uid);
      return response;
    },
  });

  return {
    employee: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};

export const useUpdateEmployee = (cuid: string, uid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: (data: any) => userService.updateUserProfile(cuid, uid, data),
    onSuccess: () => {
      message.success("Employee updated successfully!");
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getUserByUid(cuid, uid),
      });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.getClientUsers, cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update employee"
      );
    },
  });
};

export const useRemoveEmployee = (cuid: string, uid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: () => userService.removeUser(cuid, uid),
    onSuccess: (response) => {
      message.success("Employee removed successfully!");

      // Invalidate employee lists
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.getClientUsers, cuid],
      });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getUserByUid(cuid, uid),
      });

      // Invalidate stats for employee charts
      queryClient.invalidateQueries({
        queryKey: ["userStats", cuid],
      });

      // Check if seat was freed (employee roles: super-admin, admin, manager, staff)
      const actions = response?.data?.actions || [];
      const hasSeatAction = actions.some((action: any) =>
        action.action?.includes('seat') || action.action?.includes('disconnect')
      );

      if (hasSeatAction) {
        // Invalidate subscription usage to update seat count
        queryClient.invalidateQueries({
          queryKey: ["subscriptionUsage", cuid],
        });
        queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });
        message.info("Seat count updated: 1 seat freed");
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message;

      if (errorMessage?.includes("Cannot archive yourself")) {
        message.error("You cannot remove yourself");
      } else {
        message.error(errorMessage || "Failed to remove employee");
      }
    },
  });
};

export const useReconnectEmployee = (cuid: string, uid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: () => userService.reconnectUser(cuid, uid),
    onSuccess: () => {
      message.success("Employee reconnected successfully!");

      // Invalidate employee lists
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.getClientUsers, cuid],
      });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getUserByUid(cuid, uid),
      });

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: ["userStats", cuid],
      });

      // Invalidate subscription usage (seat count will increment)
      queryClient.invalidateQueries({
        queryKey: ["subscriptionUsage", cuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reconnect employee"
      );
    },
  });
};

export const useGetEmployees = (
  cuid: string,
  initialParams?: EmployeeQueryParams
) => {
  const baseParams: FilteredUsersQueryParams = {
    type: "employee",
    role: initialParams?.role ? [initialParams.role] : ["staff", "manager"],
    department: initialParams?.department || "",
    status: initialParams?.status || "active",
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
    handleSortDirectionChange: baseHook.handleSortDirectionChange,
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
