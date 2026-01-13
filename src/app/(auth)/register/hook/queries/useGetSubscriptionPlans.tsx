import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@src/services/subscription";

export const useGetSubscriptionPlans = () => {
  const query = useQuery({
    queryKey: ["/subscription_plans"],
    queryFn: async () => {
      const resp = await subscriptionService.getSubscriptionPlans();
      return resp;
    },
  });

  return {
    data: query.data,
    totalCount: query.data?.pagination?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
