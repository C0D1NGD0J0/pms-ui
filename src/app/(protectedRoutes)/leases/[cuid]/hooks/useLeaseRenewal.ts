import { leaseService } from "@services/lease";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  LeaseRenewalFormValues,
  LeaseRenewalResponse,
} from "@interfaces/lease.interface";

export function useLeaseRenewal(cuid: string, luid: string) {
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();

  return useMutation({
    mutationFn: async (renewalData: LeaseRenewalFormValues) => {
      const result = await leaseService.renewLease(cuid, luid, renewalData);
      return result.data as LeaseRenewalResponse;
    },
    onSuccess: (_data) => {
      void _data;
      // Invalidate original lease query
      queryClient.invalidateQueries({
        queryKey: [`/leases/${cuid}/${luid}`],
      });

      // Invalidate lease list
      queryClient.invalidateQueries({
        queryKey: [`/leases/${cuid}`],
      });

      openNotification(
        "success",
        "Lease Renewal Created",
        "The renewal lease has been created successfully. Next step: Send for signatures."
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create lease renewal";

      openNotification("error", "Renewal Failed", errorMessage);
    },
  });
}
