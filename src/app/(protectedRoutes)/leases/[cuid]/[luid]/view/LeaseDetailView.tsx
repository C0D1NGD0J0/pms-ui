"use client";

import Link from "next/link";
import { TabContainer } from "@components/Tab";
import { Button } from "@components/FormElements";
import { Loading } from "@src/components/Loading";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { PanelsWrapper, PanelContent, Panel } from "@components/Panel";
import { IUnifiedPermissions } from "@interfaces/permission.interface";
import { PendingChangesBanner } from "@src/components/PendingChangesBanner";
import { LeaseDetailResponse, LeaseDetailData } from "@interfaces/lease.interface";
import { PendingChangesReviewModal } from "@src/components/PendingChangesReviewModal";

import { LeaseHeader } from "../components/LeaseHeader";
import { LeaseSidebar } from "../components/LeaseSidebar";
import { LeasePreviewModal } from "../components/LeasePreviewModal";
import { LeaseOverviewCards } from "../components/LeaseOverviewCards";
import { SendForSignatureModal } from "../components/SendForSignatureModal";

interface LeaseDetailViewProps {
  cuid: string;
  luid: string;
  lease: LeaseDetailData | undefined;
  responseData: LeaseDetailResponse["data"] | undefined;
  isLoading: boolean;
  error: Error | null;
  permissions: IUnifiedPermissions;
  previewHtml: string;
  isLoadingPreview: boolean;
  showSignatureModal: boolean;
  setShowSignatureModal: (show: boolean) => void;
  showPreviewModal: boolean;
  setShowPreviewModal: (show: boolean) => void;
  isSendingSignature: boolean;
  isChangesModalOpen: boolean;
  isDraftStatus: boolean;
  tabItems: TabItem[];
  handleBack: () => void;
  handleViewChanges: () => void;
  closeChangesModal: () => void;
  handleApproveChanges: (notes?: string) => Promise<void>;
  handleRejectChanges: (reason: string) => Promise<void>;
  handleModalSuccess: () => void;
  handleSendForSignature: () => Promise<void>;
  handlePreviewLease: () => void;
  handleGeneratePreview: () => void;
}

export function LeaseDetailView({
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
}: LeaseDetailViewProps) {
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
          <div className="header-actions">
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
        lease && responseData && (
          <LeaseHeader
            luid={lease.leaseNumber}
            status={lease.status}
            propertyName={responseData.property.name}
            propertyAddress={lease.property.address}
            actions={leaseActions}
          />
        )
      )}

      {lease && (
        <LeaseOverviewCards
          startDate={lease.duration.startDate.toLocaleString()}
          endDate={lease.duration.endDate.toLocaleString()}
          monthlyRent={lease.fees.monthlyRent}
          securityDeposit={lease.fees.securityDeposit}
          currency={lease.fees.currency}
          rentDueDay={lease.fees.rentDueDay}
        />
      )}

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

        {responseData && lease && (
          <LeaseSidebar
            timeline={responseData.timeline}
            renewalNoticeDays={lease.renewalOptions?.noticePeriodDays}
          />
        )}
      </div>

      {lease && (
        <SendForSignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onConfirm={handleSendForSignature}
          tenantName={lease.tenant?.fullname || ""}
          coTenants={lease.coTenants || []}
          isLoading={isSendingSignature}
        />
      )}

      <LeasePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        html={previewHtml}
        isLoading={isLoadingPreview}
        onGeneratePreview={handleGeneratePreview}
      />

      {responseData?.lease?.pendingChangesPreview && lease && (
        <PendingChangesReviewModal
          visible={isChangesModalOpen}
          entityType="lease"
          entity={lease}
          pendingChanges={responseData.lease.pendingChangesPreview}
          requesterName={
            responseData.lease?.pendingChanges?.displayName || "Unknown User"
          }
          onSuccess={handleModalSuccess}
          onCancel={closeChangesModal}
          onApprove={handleApproveChanges}
          onReject={handleRejectChanges}
          isLoading={false}
        />
      )}
    </div>
  );
}
