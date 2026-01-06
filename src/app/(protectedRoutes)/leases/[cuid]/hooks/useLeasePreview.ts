import { useState } from "react";
import { leaseService } from "@services/lease";
import { UseFormReturnType } from "@mantine/form";
import { LEASE_QUERY_KEYS } from "@src/utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LeaseFormValues } from "@interfaces/lease.interface";

// TODO: This hook needs to be updated to use a valid preview endpoint
// Currently disabled as previewLeaseTemplate doesn't exist in service
export function useLeasePreview() {
  const { openNotification } = useNotification();
  const [html, setHtml] = useState<string>("");

  const previewMutation = useMutation({
    mutationFn: () => {
      // TODO: Replace with correct preview method when available
      throw new Error("Preview method not implemented");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate preview. Please try again.";
      openNotification("error", "Preview Failed", errorMessage);
    },
  });

  const fetchPreview = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _leaseForm: UseFormReturnType<LeaseFormValues>
  ) => {
    // TODO: Implement when preview endpoint is available
    openNotification(
      "error",
      "Not Implemented",
      "Preview feature not yet available"
    );
  };

  const fetchPreviewByLuid = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _luid: string
  ) => {
    // TODO: Implement when preview endpoint is available
    openNotification(
      "error",
      "Not Implemented",
      "Preview feature not yet available"
    );
  };

  const clearPreview = () => {
    setHtml("");
    previewMutation.reset();
  };

  return {
    html,
    isLoading: previewMutation.isPending,
    error: previewMutation.error,
    isSuccess: previewMutation.isSuccess,
    isError: previewMutation.isError,
    fetchPreview,
    fetchPreviewByLuid,
    clearPreview,
  };
}

export const useGetLeasePreview = (cuid: string, luid: string) => {
  const query = useQuery({
    queryKey: LEASE_QUERY_KEYS.previewLeaseHTMLFormat(cuid, luid),
    queryFn: async () => {
      const response = await leaseService.previewLeaseHTMLFormat(cuid, luid);
      return response;
    },
    enabled: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  return {
    previewHtml: query.data?.html || "",
    isLoadingPreview: query.isLoading,
    fetchPreviewByLuid: query.refetch,
    fetchPreview: query.refetch,
  };
};
