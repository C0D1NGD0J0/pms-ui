import { leaseService } from "@services/lease";
import { useQuery } from "@tanstack/react-query";
import { LEASE_QUERY_KEYS } from "@utils/constants";

export function useGetLeaseByLuid(
  cuid: string,
  luid: string,
  includeFormattedData: boolean = true
) {
  const query = useQuery({
    enabled: !!cuid && !!luid,
    queryKey: LEASE_QUERY_KEYS.getLeaseByLuid(cuid, luid),
    queryFn: async () => {
      const filters = {
        meta: {
          includeFormattedData,
        },
      };
      const result = await leaseService.getLeaseByLuid(cuid, luid, filters);
      return result;
    },
    staleTime: 2.5 * 60 * 1000,
  });

  return {
    data: query.data,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
  };
}
