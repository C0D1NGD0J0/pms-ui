import { useErrorHandler } from "@hooks/useErrorHandler";
import { subscriptionService } from "@services/subscription";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface ManageSeatsParams {
  cuid: string;
  seatDelta: number;
}

export function useManageSeats() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useErrorHandler();

  return useMutation({
    mutationFn: ({ cuid, seatDelta }: ManageSeatsParams) =>
      subscriptionService.manageSeats(cuid, seatDelta),
    onSuccess: (_, { cuid }) => {
      queryClient.invalidateQueries({ queryKey: ["planUsage", cuid] });
      queryClient.invalidateQueries({ queryKey: ["clientDetails", cuid] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => handleMutationError(error, "Failed to manage seats"),
  });
}
