import { useErrorHandler } from "@hooks/useErrorHandler";
import { useNotification } from "@hooks/useNotification";
import { subscriptionService } from "@services/subscription";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useDowngradeSubscription() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useErrorHandler();
  const { openNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async (cuid: string) => {
      return subscriptionService.downgradeToEssential(cuid);
    },
    onSuccess: () => {
      openNotification(
        "success",
        "Plan Downgraded",
        "Your subscription has been downgraded to the Essential plan."
      );
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["clientInfo"] });
      window.location.reload();
    },
    onError: (error) =>
      handleMutationError(error, "Failed to downgrade subscription"),
  });

  return {
    downgrade: mutation.mutate,
    isDowngrading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
