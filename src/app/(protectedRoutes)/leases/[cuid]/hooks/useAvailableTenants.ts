import { userService } from "@services/users";
import { useQuery } from "@tanstack/react-query";
import { LEASE_QUERY_KEYS } from "@utils/constants";

export interface AvailableTenant {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: { url: string; filename: string };
}

export function useAvailableTenants({ cuid }: { cuid: string }) {
  return useQuery<AvailableTenant[]>({
    enabled: !!cuid,
    queryKey: LEASE_QUERY_KEYS.getAvailableTenants(cuid || ""),
    queryFn: async () => {
      const result = await userService.getAvailableTenants(cuid);
      return result || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}
