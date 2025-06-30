import { useAuth } from "@store/index";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { IPropertyDocument } from "@interfaces/property.interface";

export function usePropertyData(pid: string) {
  const { client } = useAuth();

  const query = useQuery<IPropertyDocument>({
    enabled: !!pid && !!client?.csub,
    queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client?.csub || "", pid),
    queryFn: () => propertyService.getClientProperty(client!.csub, pid),
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
