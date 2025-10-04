import { userService } from "@services/users";
import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@utils/constants";

export const useGetProfileInfo = (cuid: string, otherUserUid?: string) => {
  const query = useQuery({
    enabled: !!cuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryKey: USER_QUERY_KEYS.getUserProfile(cuid, otherUserUid ?? ""),
    queryFn: async () => {
      const response = await userService.getProfileDetails(cuid, otherUserUid);
      return response;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};
