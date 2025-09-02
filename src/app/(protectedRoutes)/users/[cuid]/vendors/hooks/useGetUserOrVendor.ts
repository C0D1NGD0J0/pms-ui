import { userService } from "@services/users";
import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@services/vendors";
import { VENDOR_QUERY_KEYS, USER_QUERY_KEYS } from "@utils/constants";
import {
  EmployeeDetailResponse,
  VendorDetailResponse,
} from "@interfaces/user.interface";

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
        return await userService.getUserDetails(cuid, resourceId);
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
