import { useQuery } from "@tanstack/react-query";
import { SUBSCRIPTION_QUERY_KEYS } from "@utils/constants";
import { subscriptionService } from "@src/services/subscription";

export const useGetSubscriptionPlans = () => {
  const query = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.getSubscriptionPlans(),
    queryFn: async () => {
      const resp = await subscriptionService.getSubscriptionPlans();
      return resp;
    },
  });

  return {
    data: query.data,
    totalCount: query.data?.length || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
