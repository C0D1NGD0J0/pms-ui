"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TabItem } from "@components/Tab/interface";
import { DocumentsTab } from "@components/UserDetail";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

import { useGetLeaseByLuid } from "../../hooks/index";
import { ActivityTab } from "../components/ActivityTab";
import { FinancialTab } from "../components/FinancialTab";
import { useGetLeasePreview } from "../../hooks/useLeasePreview";
import { LeaseDetailsTab } from "../components/LeaseDetailsTab";
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

  const handleBack = () => {
    router.back();
  };

  const handleViewChanges = () => {
    setIsChangesModalOpen(true);
  };

  const closeChangesModal = () => {
    setIsChangesModalOpen(false);
  };

  const handleApproveChanges = async (notes?: string) => {
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
  };

  const handleRejectChanges = async (reason: string) => {
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
  };

  const handleModalSuccess = () => {
    closeChangesModal();
    // TODO: Invalidate queries or refetch data
  };

  const handleSendForSignature = async () => {
    setIsSendingSignature(true);
    // TODO: Implement API call to send for signature
    // await leaseService.sendForSignature(cuid, luid);
    setTimeout(() => {
      setIsSendingSignature(false);
      setShowSignatureModal(false);
      // Show success notification
    }, 1500);
  };

  const handlePreviewLease = () => {
    setShowPreviewModal(true);
  };

  const handleGeneratePreview = () => {
    fetchPreview();
  };

  const isDraftStatus = lease?.status === "draft";

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
              documents={responseData.documents.map((doc) => ({
                id: doc.key,
                title: doc.documentType
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                type: doc.documentType,
                subtitle: `${doc.mimeType} • ${(doc.size / 1024).toFixed(
                  0
                )} KB • Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`,
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
  };
}
