import { useAuth } from "@store/index";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { ClientPropertyResponse } from "@interfaces/property.interface";

export function usePropertyData(pid: string) {
  const { client } = useAuth();

  const query = useQuery<ClientPropertyResponse>({
    enabled: !!pid && !!client?.cuid,
    queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client?.cuid || "", pid),
    queryFn: () => propertyService.getClientProperty(client!.cuid, pid),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
