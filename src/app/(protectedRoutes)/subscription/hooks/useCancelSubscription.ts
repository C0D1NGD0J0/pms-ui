import { logExternalError } from "@utils/errorHandler";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { useNotification } from "@hooks/useNotification";
import { subscriptionService } from "@services/subscription";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const { handleMutationError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: (cuid: string) => subscriptionService.cancelSubscription(cuid),
    onSuccess: (response: any) => {
      openNotification(
        "success",
        "Subscription Canceled",
        response?.message || "Your subscription has been canceled successfully."
      );

      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["clientInfo"] });
    },
    onError: (error, cuid) => {
      handleMutationError(error, "Failed to cancel subscription");

      // Log to external services
      logExternalError(error, {
        additional: {
          action: "cancel_subscription",
          cuid,
        },
      });
    },
  });

  return {
    cancelSubscription: mutation.mutate,
    cancelSubscriptionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}
