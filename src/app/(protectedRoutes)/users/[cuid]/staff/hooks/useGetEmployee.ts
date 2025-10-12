import { userService } from "@services/users";
import { USER_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { EmployeeDetailResponse } from "@interfaces/user.interface";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

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
