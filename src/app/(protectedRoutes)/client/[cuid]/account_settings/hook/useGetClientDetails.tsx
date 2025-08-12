import { clientService } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import { CLIENT_QUERY_KEYS } from "@utils/constants";
import { IClient } from "@interfaces/client.interface";

export function useGetClientDetails(cuid: string) {
  const isValidcuid = Boolean(cuid && cuid.length >= 10);

  const query = useQuery<IClient>({
    enabled: !!cuid,
    queryKey: CLIENT_QUERY_KEYS.getClientBycuid(cuid),
    queryFn: () => clientService.getClientDetails(cuid),
  });

  if (!isValidcuid) {
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
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
  };
}
