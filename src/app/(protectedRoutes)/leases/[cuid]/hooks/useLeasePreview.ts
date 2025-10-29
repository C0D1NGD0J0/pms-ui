import { useState } from "react";
import { useAuth } from "@store/index";
import { leaseService } from "@services/lease";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { useNotification } from "@hooks/useNotification";
import { useMutation } from "@tanstack/react-query";

export function useLeasePreview() {
  const { client } = useAuth();
  const { openNotification } = useNotification();
  const [html, setHtml] = useState<string>("");

  const previewMutation = useMutation({
    mutationFn: (data: Partial<LeaseFormValues>) =>
      leaseService.previewLeaseTemplate(client?.cuid || "", data),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setHtml(result.data.html);
      } else {
        openNotification(
          "error",
          "Preview Failed",
          result.message || "Failed to generate lease preview"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to generate preview. Please try again.";
      openNotification("error", "Preview Failed", errorMessage);
    },
  });

  const fetchPreview = async (leaseForm: UseFormReturnType<LeaseFormValues>) => {
    if (!client?.cuid) {
      openNotification("error", "Error", "Client information not found");
      return;
    }

    // Validate form before preview
    const validation = leaseForm.validate();
    if (validation.hasErrors) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix all form errors before previewing"
      );
      return;
    }

    try {
      // Prepare preview data
      const previewData = {
        property: leaseForm.values.property,
        tenantInfo: leaseForm.values.tenantInfo,
        duration: leaseForm.values.duration,
        fees: leaseForm.values.fees,
        type: leaseForm.values.type,
        utilitiesIncluded: leaseForm.values.utilitiesIncluded,
        coTenants: leaseForm.values.coTenants?.filter(
          (ct) => ct.name && ct.email && ct.phone
        ),
        petPolicy: leaseForm.values.petPolicy,
        renewalOptions: leaseForm.values.renewalOptions,
      };

      await previewMutation.mutateAsync(previewData);
    } catch (error) {
      console.error("Error fetching lease preview:", error);
    }
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
    clearPreview,
  };
}
