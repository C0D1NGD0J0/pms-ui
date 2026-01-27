import { useMutation } from "@tanstack/react-query";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { subscriptionService } from "@services/subscription";

interface InitPaymentParams {
  cuid: string;
  priceId?: string;
  lookupKey?: string;
  billingInterval?: "monthly" | "annual";
}

interface UseInitSubscriptionPaymentOptions {
  onSuccess?: (checkoutUrl: string) => void;
  autoRedirect?: boolean;
}

interface InitPaymentResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

export function useInitSubscriptionPayment(
  options: UseInitSubscriptionPaymentOptions = {}
) {
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
      const returnUrl = `${baseUrl}/subscription/onboarding`;

      return subscriptionService.initSubscriptionPayment(cuid, {
        priceId,
        lookupKey,
        billingInterval,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
      });
    },
    onSuccess: (response) => {
      console.log("onSuccess triggered", {
        response,
        hasCheckoutUrl: !!response.data?.checkoutUrl,
        hasDirectCheckoutUrl: !!(response as any).checkoutUrl,
        autoRedirect,
        customOnSuccess: !!customOnSuccess,
      });

      // Handle both response formats:
      // 1. { success, message, data: { checkoutUrl, sessionId } }
      // 2. { checkoutUrl, sessionId } (if axios interceptor unwraps)
      const checkoutUrl =
        response.data?.checkoutUrl || (response as any).checkoutUrl;

      if (checkoutUrl) {
        console.log("About to redirect to:", checkoutUrl);

        if (customOnSuccess) {
          customOnSuccess(checkoutUrl);
        } else if (autoRedirect) {
          // Full page redirect to Stripe (external URL) - window.location is correct here
          console.log("Executing window.location.href redirect...");
          window.location.href = checkoutUrl;
        }
      } else {
        console.error("No checkout URL found in response:", response);
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
