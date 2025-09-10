import { userService } from "@services/users";
import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@utils/constants";
import { EmployeeDetailResponse } from "@interfaces/user.interface";

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
