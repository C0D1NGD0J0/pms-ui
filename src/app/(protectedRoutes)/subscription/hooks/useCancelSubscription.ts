import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { subscriptionService } from "@services/subscription";
import { useNotification } from "@hooks/useNotification";
import { logExternalError } from "@utils/errorHandler";

interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    status: string;
    canceledAt: string;
    planName: string;
  };
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const { handleMutationError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: (cuid: string): Promise<CancelSubscriptionResponse> => {
      return subscriptionService.cancelSubscription(cuid);
    },
    onSuccess: (response) => {
      openNotification(
        "success",
        "Subscription Canceled",
        response.message || "Your subscription has been canceled successfully."
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
