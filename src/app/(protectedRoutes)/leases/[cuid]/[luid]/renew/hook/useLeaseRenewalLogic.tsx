"use client";

import { useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { useGetRenewalFormData, useLeaseRenewal } from "@leases/hooks";
import { LeaseValidationResult, canRenewLease } from "@utils/leaseHelpers";

interface UseLeaseRenewalLogicProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export function useLeaseRenewalLogic({ params }: UseLeaseRenewalLogicProps) {
  const router = useRouter();
  const { cuid, luid } = use(params);
  const { currentRole } = useUnifiedPermissions();

  const {
    data: renewalResponse,
    isLoading: isLoadingRenewal,
    isError: isRenewalError,
  } = useGetRenewalFormData(cuid, luid);

  const renewalMutation = useLeaseRenewal(cuid, luid);

  const renewalMetadata = renewalResponse?.renewalMetadata;
  const renewalInitialValues = renewalResponse || null;

  const handleCreateRenewal = async (renewalData: any) => {
    try {
      const result = await renewalMutation.mutateAsync(renewalData);
      if (result.data?.luid) {
        router.push(`/leases/${cuid}/${result.data.luid}`);
      }
    } catch (error) {
      console.error("Failed to create renewal:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/leases/${cuid}/${luid}`);
  };

  const validationResult: LeaseValidationResult = useMemo(() => {
    if (renewalInitialValues?.status !== "draft_renewal") {
      return {
        canProceed: false,
        reason: "Lease is not eligible for renewal",
        action: "error",
      };
    }

    return renewalInitialValues
      ? canRenewLease(renewalInitialValues, currentRole)
      : {
          canProceed: false,
          reason: "No renewal data available",
          action: "error",
        };
  }, [renewalInitialValues, currentRole]);

  const renewalWindowInfo = renewalMetadata
    ? {
        daysUntilExpiry: renewalMetadata.daysUntilExpiry,
        renewalWindowDays: renewalMetadata.renewalWindowDays,
      }
    : null;

  return {
    cuid,
    luid,
    renewalInitialValues,
    isLoadingLease: isLoadingRenewal,
    isLeaseError: isRenewalError,
    isSubmitting: renewalMutation.isPending,
    validationResult,
    renewalWindowInfo,
    handleCreateRenewal,
    handleCancel,
  };
}
