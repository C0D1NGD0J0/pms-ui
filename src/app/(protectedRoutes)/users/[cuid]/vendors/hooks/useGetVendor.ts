import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@services/vendors";
import { VENDOR_QUERY_KEYS } from "@utils/constants";
import { VendorDetailResponse } from "@interfaces/user.interface";

export const useGetVendor = (cuid: string, vuid: string) => {
  const query = useQuery<VendorDetailResponse>({
    enabled: !!cuid && !!vuid,
    queryKey: VENDOR_QUERY_KEYS.getVendorByUid(cuid, vuid),
    queryFn: async () => {
      const response = await vendorService.getVendorDetails(cuid, vuid);
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
