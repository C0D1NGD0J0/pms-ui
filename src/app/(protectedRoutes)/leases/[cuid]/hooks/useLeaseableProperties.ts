import { useAuth } from "@store/index";
import { leaseService } from "@services/lease";
import { useQuery } from "@tanstack/react-query";
import { LEASE_QUERY_KEYS } from "@utils/constants";
import { LeaseableProperty } from "@interfaces/lease.interface";

export function useLeaseableProperties(fetchUnits: boolean = false) {
  const { client } = useAuth();

  return useQuery<LeaseableProperty[]>({
    enabled: !!client?.cuid,
    queryKey: LEASE_QUERY_KEYS.getLeaseableProperties(
      client?.cuid || "",
      fetchUnits
    ),
    queryFn: async () => {
      const result = await leaseService.getLeaseableProperties(
        client!.cuid,
        fetchUnits
      );
      console.log("Fetched Leaseable Properties:", result);
      return result || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
