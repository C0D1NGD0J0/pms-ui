import { propertyService } from "@services/property";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useApproveProperty = (cuid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: ({ pid, notes }: { pid: string; notes?: string }) =>
      propertyService.approveProperty(cuid, pid, notes),
    onSuccess: (data, variables) => {
      message.success("Property approved successfully");
      queryClient.invalidateQueries({
        queryKey: ["property", cuid, variables.pid],
      });
      queryClient.invalidateQueries({
        queryKey: ["/properties", cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Failed to approve property"
      );
    },
  });
};

export const useRejectProperty = (cuid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: ({ pid, reason }: { pid: string; reason: string }) =>
      propertyService.rejectProperty(cuid, pid, reason),
    onSuccess: (data, variables) => {
      message.success("Property changes rejected");
      // Invalidate pending approvals queries
      queryClient.invalidateQueries({
        queryKey: ["pending-approvals", cuid],
      });
      // Invalidate property details
      queryClient.invalidateQueries({
        queryKey: ["property", cuid, variables.pid],
      });
      // Invalidate properties list
      queryClient.invalidateQueries({
        queryKey: ["/properties", cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Failed to reject property changes"
      );
    },
  });
};

export const useBulkApproveProperties = (cuid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: (propertyIds: string[]) =>
      propertyService.bulkApproveProperties(cuid, propertyIds),
    onSuccess: (data) => {
      const { approved = 0, total = 0 } = data?.data?.data || {};
      message.success(`${approved} of ${total} properties approved`);
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["pending-approvals", cuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["/properties", cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Failed to approve properties"
      );
    },
  });
};

export const useBulkRejectProperties = (cuid: string) => {
  const queryClient = useQueryClient();
  const { message } = useNotification();

  return useMutation({
    mutationFn: ({
      propertyIds,
      reason,
    }: {
      propertyIds: string[];
      reason: string;
    }) => propertyService.bulkRejectProperties(cuid, propertyIds, reason),
    onSuccess: (data) => {
      const { rejected = 0, total = 0 } = data?.data?.data || {};
      message.success(`${rejected} of ${total} properties rejected`);
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["pending-approvals", cuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["/properties", cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Failed to reject properties"
      );
    },
  });
};
