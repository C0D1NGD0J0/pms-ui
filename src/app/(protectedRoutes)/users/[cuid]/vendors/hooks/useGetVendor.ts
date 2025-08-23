import { userService } from "@services/users";
import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@utils/constants";
import { VendorDetailResponse } from "@interfaces/user.interface";

export const useGetVendor = (cuid: string, vendorId: string) => {
  const query = useQuery<VendorDetailResponse>({
    enabled: !!cuid && !!vendorId,
    queryKey: USER_QUERY_KEYS.getUserByUid(cuid, vendorId),
    queryFn: async () => {
      const response = await userService.getUserDetails(cuid, vendorId);
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