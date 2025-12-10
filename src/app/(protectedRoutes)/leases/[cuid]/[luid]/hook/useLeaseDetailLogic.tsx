"use client";

import { leaseService } from "@services/lease";
import { TabItem } from "@components/Tab/interface";
import { DocumentsTab } from "@components/UserDetail";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotification } from "@src/hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState, use } from "react";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

import { useGetLeaseByLuid } from "../../hooks/index";
import { ActivityTab } from "../components/ActivityTab";
import { FinancialTab } from "../components/FinancialTab";
import { LeaseDetailsTab } from "../components/LeaseDetailsTab";
import { useGetLeasePreview } from "../../hooks/useLeasePreview";
import { PropertyTenantTab } from "../components/PropertyTenantTab";

interface UseLeaseDetailLogicProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export function useLeaseDetailLogic({ params }: UseLeaseDetailLogicProps) {
  const router = useRouter();
  const permissions = useUnifiedPermissions();
  const { luid, cuid } = use(params);
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const {
    data: responseData,
    isLoading,
    error,
  } = useGetLeaseByLuid(cuid, luid);
  const lease = responseData?.lease;

  const { previewHtml, isLoadingPreview, fetchPreview } = useGetLeasePreview(
    cuid,
    luid
  );

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSendingSignature, setIsSendingSignature] = useState(false);
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [showManualActivationModal, setShowManualActivationModal] =
    useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showCancelSignatureModal, setShowCancelSignatureModal] =
    useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const showChanges = searchParams.get("showChanges");
    if (
      showChanges === "true" &&
      responseData?.lease?.pendingChangesPreview &&
      !isChangesModalOpen
    ) {
      setIsChangesModalOpen(true);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("showChanges");
      router.replace(newUrl.pathname, { scroll: false });
    }
  }, [
    searchParams,
    responseData?.lease?.pendingChangesPreview,
    isChangesModalOpen,
    router,
  ]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleViewChanges = useCallback(() => {
    setIsChangesModalOpen(true);
  }, []);

  const closeChangesModal = useCallback(() => {
    setIsChangesModalOpen(false);
  }, []);

  const handleApproveChanges = useCallback(async (notes?: string) => {
    // TODO: Implement lease approval API call
    // await leaseService.approveLease(cuid, luid, { notes });
    console.log("Approving lease changes with notes:", notes);

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Lease changes approved");
        resolve();
      }, 1000);
    });
  }, []);

  const handleRejectChanges = useCallback(async (reason: string) => {
    // TODO: Implement lease rejection API call
    // await leaseService.rejectLease(cuid, luid, { reason });
    console.log("Rejecting lease changes with reason:", reason);

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Lease changes rejected");
        resolve();
      }, 1000);
    });
  }, []);

  const handleModalSuccess = useCallback(() => {
    setIsChangesModalOpen(false);
    // TODO: Invalidate queries or refetch data
  }, []);

  const handleSendForSignature = useCallback(async () => {
    setIsSendingSignature(true);
    // TODO: Implement API call to send for signature
    // await leaseService.sendForSignature(cuid, luid);
    setTimeout(() => {
      setIsSendingSignature(false);
      setShowSignatureModal(false);
      // Show success notification
    }, 1500);
  }, []);

  const handlePreviewLease = useCallback(() => {
    setShowPreviewModal(true);
  }, []);

  const handleGeneratePreview = useCallback(() => {
    fetchPreview();
  }, [fetchPreview]);

  const manualActivationMutation = useMutation({
    mutationFn: (data: { notes?: string }) =>
      leaseService.manuallyActivateLease(cuid, luid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lease", cuid, luid] });
      openNotification(
        "success",
        "Lease Activated",
        "Lease has been manually activated. Tenant can now access their portal."
      );
      setShowManualActivationModal(false);
    },
    onError: (error: any) => {
      openNotification(
        "error",
        "Activation Failed",
        error?.response?.data?.message ||
          "Failed to activate lease. Please try again."
      );
    },
  });

  const terminateMutation = useMutation({
    mutationFn: (data: {
      terminationDate: string;
      reason: string;
      refundAmount?: number;
      notes?: string;
    }) => leaseService.terminateLease(cuid, luid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lease", cuid, luid] });
      openNotification(
        "success",
        "Lease Terminated",
        "Lease has been terminated. Security deposit processing has been initiated."
      );
      setShowTerminateModal(false);
    },
    onError: (error: any) => {
      openNotification(
        "error",
        "Termination Failed",
        error?.response?.data?.message ||
          "Failed to terminate lease. Please try again."
      );
    },
  });

  const cancelSignatureMutation = useMutation({
    mutationFn: () => leaseService.signatureRequest(cuid, luid, "cancel"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lease", cuid, luid] });
      openNotification(
        "success",
        "Signature Request Cancelled",
        "The signature request has been cancelled successfully."
      );
      setShowCancelSignatureModal(false);
    },
    onError: (error: any) => {
      openNotification(
        "error",
        "Cancellation Failed",
        error?.response?.data?.message ||
          "Failed to cancel signature request. Please try again."
      );
    },
  });

  const handleManualActivation = useCallback(
    async (notes?: string) => {
      await manualActivationMutation.mutateAsync({ notes });
    },
    [manualActivationMutation]
  );

  const handleTerminateLease = useCallback(
    async (data: {
      terminationDate: string;
      reason: string;
      refundAmount?: number;
      notes?: string;
    }) => {
      await terminateMutation.mutateAsync(data);
    },
    [terminateMutation]
  );

  const handleCancelSignatureRequest = useCallback(async () => {
    await cancelSignatureMutation.mutateAsync();
  }, [cancelSignatureMutation]);

  const isDraftStatus = lease?.status === "draft";
  const isPendingSignatureStatus = lease?.status === "pending_signature";
  const isActiveStatus = lease?.status === "active";
  const isTerminatedStatus = lease?.status === "terminated";
  const isExpiredStatus = lease?.status === "expired";
  const isCancelledStatus = lease?.status === "cancelled";
  const isReadOnlyStatus =
    isTerminatedStatus || isExpiredStatus || isCancelledStatus;

  const tabItems: TabItem[] = lease
    ? [
        {
          id: "details",
          label: "Lease Details",
          icon: <i className="bx bx-info-circle"></i>,
          content: <LeaseDetailsTab leaseData={lease} />,
        },
        {
          id: "property",
          label: "Property & Tenant",
          icon: <i className="bx bx-building"></i>,
          content: (
            <PropertyTenantTab
              tenantInfo={lease.tenant}
              propertyInfo={responseData.property}
              unitInfo={responseData.unit}
              additionalOccupants={lease?.coTenants || []}
            />
          ),
        },
        {
          id: "financial",
          label: "Financial",
          icon: <i className="bx bx-dollar"></i>,
          content: (
            <FinancialTab financialSummary={responseData.financialSummary} />
          ),
        },
        {
          id: "documents",
          label: "Documents",
          icon: <i className="bx bx-file"></i>,
          content: (
            <DocumentsTab
              userType="tenant"
              documents={responseData?.documents?.map((doc) => ({
                id: doc.key,
                title: doc.documentType
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                type: doc.documentType,
                subtitle: `${doc.mimeType} • ${(doc.size / 1024).toFixed(
                  0
                )} KB • Uploaded ${new Date(
                  doc.uploadedAt
                ).toLocaleDateString()}`,
                icon: doc.documentType.includes("lease") ? "lease" : "document",
                status: "valid" as const,
                url: doc.url,
              }))}
            />
          ),
        },
        {
          id: "activity",
          label: "Activity",
          icon: <i className="bx bx-time"></i>,
          content: <ActivityTab activities={responseData.activity} />,
        },
      ]
    : [];

  return {
    cuid,
    luid,
    lease,
    responseData,
    isLoading,
    error,
    permissions,
    previewHtml,
    isLoadingPreview,
    showSignatureModal,
    setShowSignatureModal,
    showPreviewModal,
    setShowPreviewModal,
    isSendingSignature,
    isChangesModalOpen,
    isDraftStatus,
    isPendingSignatureStatus,
    isActiveStatus,
    isReadOnlyStatus,
    showManualActivationModal,
    setShowManualActivationModal,
    showTerminateModal,
    setShowTerminateModal,
    showCancelSignatureModal,
    setShowCancelSignatureModal,
    tabItems,
    handleBack,
    handleViewChanges,
    closeChangesModal,
    handleApproveChanges,
    handleRejectChanges,
    handleModalSuccess,
    handleSendForSignature,
    handlePreviewLease,
    handleGeneratePreview,
    handleManualActivation,
    handleTerminateLease,
    handleCancelSignatureRequest,
    isManualActivationLoading: manualActivationMutation.isPending,
    isTerminateLoading: terminateMutation.isPending,
    isCancelSignatureLoading: cancelSignatureMutation.isPending,
  };
}
