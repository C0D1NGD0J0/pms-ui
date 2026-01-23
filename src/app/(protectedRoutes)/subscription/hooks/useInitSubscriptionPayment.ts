import { useMutation } from "@tanstack/react-query";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { subscriptionService } from "@services/subscription";

interface InitPaymentParams {
  cuid: string;
  priceId?: string;
  lookupKey?: string;
  billingInterval?: "monthly" | "annual";
}

export function useInitSubscriptionPayment() {
  const { handleMutationError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async ({
      cuid,
      priceId,
      lookupKey,
      billingInterval,
    }: InitPaymentParams) => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const successUrl = `${baseUrl}/client/${cuid}/account_settings?tab=subscription&payment=success`;
      const cancelUrl = `${baseUrl}/client/${cuid}/account_settings?tab=subscription&payment=canceled`;

      return subscriptionService.initSubscriptionPayment(cuid, {
        priceId,
        lookupKey,
        billingInterval,
        successUrl,
        cancelUrl,
      });
    },
    onSuccess: (data) => {
      // if (data.success && data.data.checkoutUrl) {
      //   window.location.href = data.data.checkoutUrl;
      // }
      console.log("Payment initialized:", data);
    },
    onError: (error) =>
      handleMutationError(error, "Failed to initialize payment"),
  });

  return {
    initPayment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
