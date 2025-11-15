"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, use } from "react";
import { TabContainer } from "@components/Tab";
import { Button } from "@components/FormElements";
import { Loading } from "@src/components/Loading";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { DocumentsTab } from "@components/UserDetail";
import { PanelsWrapper, PanelContent, Panel } from "@components/Panel";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { PendingChangesBanner } from "@src/components/PendingChangesBanner";

import { useGetLeaseByLuid } from "../hooks/index";
import { LeaseHeader } from "./components/LeaseHeader";
import { ActivityTab } from "./components/ActivityTab";
import { FinancialTab } from "./components/FinancialTab";
import { LeaseSidebar } from "./components/LeaseSidebar";
import { useGetLeasePreview } from "../hooks/useLeasePreview";
import { LeaseDetailsTab } from "./components/LeaseDetailsTab";
import { PropertyTenantTab } from "./components/PropertyTenantTab";
import { LeasePreviewModal } from "./components/LeasePreviewModal";
import { LeaseOverviewCards } from "./components/LeaseOverviewCards";
import { SendForSignatureModal } from "./components/SendForSignatureModal";

interface LeaseDetailPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export default function LeaseDetailPage({ params }: LeaseDetailPageProps) {
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

  const handleBack = () => {
    router.back();
  };

  const handleEditLease = () => {
    router.push(`/leases/${cuid}/${luid}/edit`);
  };

  const handleDuplicateLease = () => {
    router.push(`/leases/${cuid}/new?duplicate=${luid}`);
  };

  const handleViewChanges = () => {
    // TODO: Implement view changes modal/page
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

  if (isLoading) {
    return <Loading description="Fetching lease details" />;
  }

  if (error || !lease) {
    return (
      <div className="page property-show">
        <div className="error-message">
          <h2>Error Loading Lease Details</h2>
          <p>Unable to load lease data. Please try again.</p>
        </div>
      </div>
    );
  }

  const isDraftStatus = lease.status === "draft";
  const tabItems: TabItem[] = [
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
  ];

  const leaseActions = (
    <>
      <Button
        className="btn btn-outline"
        label="Preview Lease"
        icon={<i className="bx bx-file warning"></i>}
        onClick={handlePreviewLease}
      />

      {isDraftStatus && (
        <Button
          className="btn btn-danger"
          label="Send for Signature"
          icon={<i className="bx bx-send ghost"></i>}
          onClick={() => setShowSignatureModal(true)}
        />
      )}

      {permissions.isManagerOrAbove && (
        <Link
          href={`/leases/${cuid}/new?duplicate=${luid}`}
          className="btn btn-outline"
        >
          <i className="bx bx-copy"></i>
          Duplicate Lease
        </Link>
      )}
    </>
  );

  return (
    <div className="page lease-show">
      <PageHeader
        title=""
        subtitle=""
        withBreadcrumb={true}
        headerBtn={
          <div style={{ display: "flex", gap: "1rem" }}>
            {permissions.isManagerOrAbove && (
              <Link
                href={`/leases/${cuid}/${luid}/edit`}
                className="btn btn-outline"
              >
                <i className="bx bx-edit"></i>
                Edit
              </Link>
            )}
            <Button
              className="btn btn-default"
              label="Back"
              icon={<i className="bx bx-arrow-back"></i>}
              onClick={handleBack}
            />
          </div>
        }
      />

      {responseData?.lease?.pendingChangesPreview ? (
        <PendingChangesBanner
          entityType={"lease"}
          pendingChanges={responseData.lease.pendingChangesPreview}
          requesterName={
            responseData.lease?.pendingChanges?.displayName || "Unknown User"
          }
          updatedAt={
            responseData.lease?.pendingChanges?.updatedAt ||
            new Date().toISOString()
          }
          onViewChanges={handleViewChanges}
        />
      ) : (
        <LeaseHeader
          luid={lease.leaseNumber}
          status={lease.status}
          propertyName={responseData.property.name}
          propertyAddress={lease.property.address}
          actions={leaseActions}
        />
      )}

      <LeaseOverviewCards
        startDate={lease.duration.startDate.toLocaleString()}
        endDate={lease.duration.endDate.toLocaleString()}
        monthlyRent={lease.fees.monthlyRent}
        securityDeposit={lease.fees.securityDeposit}
        currency={lease.fees.currency}
        rentDueDay={lease.fees.rentDueDay}
      />

      <div className="lease-content-grid">
        <div>
          <PanelsWrapper>
            <Panel>
              <PanelContent>
                <TabContainer
                  variant="profile"
                  tabItems={tabItems}
                  defaultTab="property"
                  scrollOnChange={false}
                />
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>

        <LeaseSidebar
          timeline={responseData.timeline}
          renewalNoticeDays={lease.renewalOptions?.noticePeriodDays}
        />
      </div>

      {/* Modals */}
      <SendForSignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onConfirm={handleSendForSignature}
        tenantName={responseData.tenant?.fullname || ""}
        coTenants={lease.coTenants || []}
        isLoading={isSendingSignature}
      />

      <LeasePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        html={previewHtml}
        isLoading={isLoadingPreview}
        onGeneratePreview={handleGeneratePreview}
      />
    </div>
  );
}
