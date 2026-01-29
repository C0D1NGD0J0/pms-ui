import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@services/subscription";

/**
 * Fetches subscription usage and limits for entitlements checking
 * Data includes: properties, units, seats usage and limits
 */
export function useEntitlementsUsage(cuid: string | undefined) {
  return useQuery({
    queryKey: ["entitlementsUsage", cuid],
    queryFn: () => {
      if (!cuid) throw new Error("No cuid provided");
      return subscriptionService.getPlanUsage(cuid);
    },
    enabled: !!cuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
