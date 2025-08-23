import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@utils/constants";
import { IUserRoleType, IUserStats } from "@interfaces/user.interface";
import { IFilteredUsersParams, userService } from "@src/services/users";

export interface UserStatsQueryParams {
  role?: IUserRoleType | IUserRoleType[];
  department?: string;
}

export const useGetUserStats = (
  cuid: string,
  filterParams?: UserStatsQueryParams
) => {
  const query = useQuery({
    queryKey: USER_QUERY_KEYS.getUserStats(cuid, filterParams),
    queryFn: async () => {
      const userQuery: IFilteredUsersParams = {
        ...(filterParams?.role && { role: filterParams.role }),
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
