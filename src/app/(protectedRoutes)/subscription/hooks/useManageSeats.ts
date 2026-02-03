import { useNotification } from "@hooks/useNotification";
import { subscriptionService } from "@services/subscription";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  SUBSCRIPTION_QUERY_KEYS,
  CURRENT_USER_QUERY_KEY,
} from "@utils/constants";

interface ManageSeatsParams {
  cuid: string;
  seatDelta: number;
}

export function useManageSeats() {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: ({ cuid, seatDelta }: ManageSeatsParams) =>
      subscriptionService.manageSeats(cuid, seatDelta),
    onSuccess: (response, { cuid, seatDelta }) => {
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_QUERY_KEYS.getPlanUsage(cuid),
      });
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_QUERY_KEYS.getClientDetails(cuid),
      });
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_QUERY_KEYS.getSubscriptionUsage(cuid),
      });

      const action = seatDelta > 0 ? "added" : "removed";
      const count = Math.abs(seatDelta);
      message.success(
        `Successfully ${action} ${count} seat${count !== 1 ? "s" : ""}`
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message;

      if (
        errorMessage?.includes("Cannot remove") &&
        errorMessage?.includes("archive")
      ) {
        message.error(errorMessage);
      } else {
        message.error(errorMessage || "Failed to manage seats");
      }
    },
  });
}
