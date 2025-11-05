import { useAuth } from "@store/index";
import { leaseService } from "@services/lease";
import { useQuery } from "@tanstack/react-query";
import { LEASE_QUERY_KEYS } from "@utils/constants";
import {
  LeaseablePropertiesMetadata,
  LeaseableProperty,
} from "@interfaces/lease.interface";

interface LeaseablePropertiesResult {
  properties: LeaseableProperty[];
  metadata: LeaseablePropertiesMetadata | null;
}

export function useLeaseableProperties(fetchUnits: boolean = false) {
  const { client } = useAuth();

  return useQuery<LeaseablePropertiesResult>({
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

      return {
        properties: result.data.items || [],
        metadata: result.data.metadata || null,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
