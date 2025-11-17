import { useState } from "react";
import { useAuth } from "@store/index";
import { leaseService } from "@services/lease";
import { UseFormReturnType } from "@mantine/form";
import { LEASE_QUERY_KEYS } from "@src/utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LeaseFormValues } from "@interfaces/lease.interface";

export function useLeasePreview() {
  const { client } = useAuth();
  const { openNotification } = useNotification();
  const [html, setHtml] = useState<string>("");

  const previewMutation = useMutation({
    mutationFn: (data: Partial<LeaseFormValues>) => {
      console.log("Generating preview with data:", data);
      return leaseService.previewLeaseTemplate(client?.cuid || "", data);
    },
    onSuccess: (result) => {
      if (result.html) {
        setHtml(result.html);
      } else {
        openNotification(
          "error",
          "Preview Failed",
          "Failed to generate lease preview"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate preview. Please try again.";
      openNotification("error", "Preview Failed", errorMessage);
    },
  });

  const fetchPreview = async (
    leaseForm: UseFormReturnType<LeaseFormValues>
  ) => {
    if (!client?.cuid) {
      openNotification("error", "Error", "Client information not found");
      return;
    }

    const validation = leaseForm.validate();
    if (validation.hasErrors) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix all form errors before previewing"
      );
      return;
    }

    const previewData = {
      templateType: leaseForm.values.templateType,
      propertyId: leaseForm.values.property.id,
      tenantName:
        leaseForm.values.tenantInfo.firstName &&
        leaseForm.values.tenantInfo.lastName
          ? `${leaseForm.values.tenantInfo.firstName} ${leaseForm.values.tenantInfo.lastName}`
          : "[Tenant Name] - will be swapped upon creation of lease",
      tenantEmail:
        leaseForm.values.tenantInfo.email ||
        "[Tenant Email] - will be swapped upon creation of lease",
      tenantPhone: "[Tenant Phone] - will be swapped upon creation of lease",
      propertyAddress: leaseForm.values.property.address,
      unitNumber: leaseForm.values.property.unitId,
      leaseType: leaseForm.values.type,
      startDate: leaseForm.values.duration.startDate,
      endDate: leaseForm.values.duration.endDate,
      monthlyRent: Number(leaseForm.values.fees.monthlyRent),
      securityDeposit: Number(leaseForm.values.fees.securityDeposit),
      rentDueDay: Number(leaseForm.values.fees.rentDueDay),
      currency: leaseForm.values.fees.currency,
      utilitiesIncluded: leaseForm.values.utilitiesIncluded,
      coTenants: leaseForm.values.coTenants?.filter(
        (ct) => ct.name && ct.email && ct.phone
      ),
      petPolicy: leaseForm.values.petPolicy,
      renewalOptions: leaseForm.values.renewalOptions,
      signingMethod: leaseForm.values.signingMethod,
    };

    await previewMutation.mutateAsync(previewData);
  };

  const fetchPreviewByLuid = async (luid: string) => {
    if (!client?.cuid) {
      openNotification("error", "Error", "Client information not found");
      return;
    }

    await previewMutation.mutateAsync({ luid });
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
