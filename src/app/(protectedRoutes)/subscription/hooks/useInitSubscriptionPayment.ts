import { useErrorHandler } from "@hooks/useErrorHandler";
import { subscriptionService } from "@services/subscription";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface InitPaymentParams {
  cuid: string;
  priceId?: string;
  lookupKey?: string;
  billingInterval?: "monthly" | "annual";
}

interface UseInitSubscriptionPaymentOptions {
  onSuccess?: (checkoutUrl?: string) => void;
  autoRedirect?: boolean;
}

interface InitPaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    checkoutUrl?: string;
    sessionId?: string;
    message?: string;
  };
}

export function useInitSubscriptionPayment(
  options: UseInitSubscriptionPaymentOptions = {}
) {
  const queryClient = useQueryClient();
  const { handleMutationError } = useErrorHandler();
  const { onSuccess: customOnSuccess, autoRedirect = true } = options;

  const mutation = useMutation({
    mutationFn: async ({
      cuid,
      priceId,
      lookupKey,
      billingInterval,
    }: InitPaymentParams): Promise<InitPaymentResponse> => {
      const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "";
      const returnUrl = `${baseUrl}/subscription/onboarding?returning_from_payment=true`;

      return subscriptionService.initSubscriptionPayment(cuid, {
        priceId,
        lookupKey,
        billingInterval,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
      });
    },
    onSuccess: (response, variables) => {
      console.log("onSuccess triggered", {
        response,
        hasCheckoutUrl: !!response.data?.checkoutUrl,
        hasDirectCheckoutUrl: !!(response as any).checkoutUrl,
        autoRedirect,
        customOnSuccess: !!customOnSuccess,
      });

      const checkoutUrl =
        response.data?.checkoutUrl || (response as any).checkoutUrl;

      if (checkoutUrl) {
        // Initial payment - redirect to Stripe
        if (customOnSuccess) {
          customOnSuccess(checkoutUrl);
        } else if (autoRedirect) {
          console.log("Executing window.location.href redirect...");
          window.location.href = checkoutUrl;
        }
      } else {
        // Subscription update - no redirect needed
        console.log("Subscription updated successfully");

        // Invalidate queries to refresh subscription data
        queryClient.invalidateQueries({ queryKey: ["clientDetails", variables.cuid] });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        // Call custom success handler if provided
        if (customOnSuccess) {
          customOnSuccess(undefined);
        }
      }
    },
    onError: (error) =>
      handleMutationError(error, "Failed to initialize payment"),
  });

  return {
    initPayment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}
