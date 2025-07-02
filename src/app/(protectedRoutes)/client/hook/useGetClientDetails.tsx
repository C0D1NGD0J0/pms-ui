import { clientService } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import { CLIENT_QUERY_KEYS } from "@utils/constants";
import { IClient } from "@interfaces/client.interface";

export function useGetClientDetails(csub: string, enabled: boolean = true) {
  const isValidCsub = Boolean(csub && csub.length >= 36);

  const query = useQuery<IClient>({
    enabled: enabled && isValidCsub,
    queryKey: CLIENT_QUERY_KEYS.getClientByCsub(csub),
    queryFn: () => clientService.getClientDetails(csub),
  });

  if (!isValidCsub) {
    return {
      data: undefined,
      isLoading: false,
      error: new Error("Invalid client subscription parameter"),
      isError: true,
      isSuccess: false,
      refetch: query.refetch,
    };
  }

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
