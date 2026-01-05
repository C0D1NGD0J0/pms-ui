"use client";

import Link from "next/link";
import { TabContainer } from "@components/Tab";
import { Loading } from "@src/components/Loading";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { Button, Modal } from "@components/FormElements";
import { LeaseHeader } from "@leases/components/LeaseHeader";
import { LeaseSidebar } from "@leases/components/LeaseSidebar";
import { PanelsWrapper, PanelContent, Panel } from "@components/Panel";
import { IUnifiedPermissions } from "@interfaces/permission.interface";
import { LeasePreviewModal } from "@leases/components/LeasePreviewModal";
import { LeaseOverviewCards } from "@leases/components/LeaseOverviewCards";
import { PendingChangesBanner } from "@src/components/PendingChangesBanner";
import { TerminateLeaseModal } from "@leases/components/TerminateLeaseModal";
import { SendForSignatureModal } from "@leases/components/SendForSignatureModal";
import { ManualActivationModal } from "@leases/components/ManualActivationModal";
import { PendingChangesReviewModal } from "@src/components/PendingChangesReviewModal";
import { RenewalConfirmationModal } from "@leases/components/RenewalConfirmationModal";
import {
  LeaseDetailResponse,
  LeaseDetailData,
} from "@interfaces/lease.interface";

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
  isPendingSignatureStatus: boolean;
  isActiveStatus: boolean;
  isReadOnlyStatus: boolean;
  showManualActivationModal: boolean;
  setShowManualActivationModal: (show: boolean) => void;
  showTerminateModal: boolean;
  setShowTerminateModal: (show: boolean) => void;
  showCancelSignatureModal: boolean;
  setShowCancelSignatureModal: (show: boolean) => void;
  showRenewalConfirmationModal: boolean;
  setShowRenewalConfirmationModal: (show: boolean) => void;
  canRenewLease: boolean;
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
  handleManualActivation: (notes?: string) => Promise<void>;
  handleTerminateLease: (data: {
    terminationDate: string;
    reason: string;
    refundAmount?: number;
    notes?: string;
  }) => Promise<void>;
  handleCancelSignatureRequest: () => Promise<void>;
  isManualActivationLoading: boolean;
  isTerminateLoading: boolean;
  isCancelSignatureLoading: boolean;
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
  isPendingSignatureStatus,
  isActiveStatus,
  isReadOnlyStatus,
  showManualActivationModal,
  setShowManualActivationModal,
  showTerminateModal,
  setShowTerminateModal,
  showCancelSignatureModal,
  setShowCancelSignatureModal,
  showRenewalConfirmationModal,
  setShowRenewalConfirmationModal,
  canRenewLease,
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
  isManualActivationLoading,
  isTerminateLoading,
  isCancelSignatureLoading,
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

      {isPendingSignatureStatus && permissions.isManagerOrAbove && (
        <>
          <Button
            className="btn btn-primary"
            label="Manually Activate"
            icon={<i className="bx bx-check-circle ghost"></i>}
            onClick={() => setShowManualActivationModal(true)}
          />
          <Button
            className="btn btn-default"
            label="Cancel Signature Request"
            icon={<i className="bx bx-x-circle"></i>}
            onClick={() => setShowCancelSignatureModal(true)}
          />
        </>
      )}

      {isActiveStatus && permissions.isManagerOrAbove && (
        <>
          {canRenewLease && (
            <Button
              className="btn btn-primary"
              label="Renew Lease"
              icon={<i className="bx bx-refresh"></i>}
              onClick={() => setShowRenewalConfirmationModal(true)}
            />
          )}
          <Button
            className="btn btn-danger"
            label="Terminate Lease"
            icon={<i className="bx bx-error-circle ghost"></i>}
            onClick={() => setShowTerminateModal(true)}
          />
        </>
      )}

      {!isReadOnlyStatus && permissions.isManagerOrAbove && (
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
            {permissions.isManagerOrAbove && lease && (
              <Link
                href={
                  lease.status === "draft_renewal"
                    ? `/leases/${cuid}/${luid}/renew`
                    : `/leases/${cuid}/${luid}/edit`
                }
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
        lease &&
        responseData && (
          <LeaseHeader
            luid={lease.leaseNumber}
            status={lease.status}
            propertyName={responseData.property.name}
            propertyAddress={lease.property.address.fullAddress}
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
        <>
          <SendForSignatureModal
            isOpen={showSignatureModal}
            onClose={() => setShowSignatureModal(false)}
            onConfirm={handleSendForSignature}
            tenantName={lease.tenant?.fullname || ""}
            coTenants={lease.coTenants || []}
            isLoading={isSendingSignature}
          />

          <ManualActivationModal
            isOpen={showManualActivationModal}
            onClose={() => setShowManualActivationModal(false)}
            onConfirm={handleManualActivation}
            tenantName={lease.tenant?.fullname || "Tenant"}
            isLoading={isManualActivationLoading}
          />

          <TerminateLeaseModal
            isOpen={showTerminateModal}
            onClose={() => setShowTerminateModal(false)}
            onConfirm={handleTerminateLease}
            leaseStartDate={
              typeof lease.duration.startDate === "string"
                ? lease.duration.startDate
                : lease.duration.startDate.toISOString().split("T")[0]
            }
            leaseEndDate={
              typeof lease.duration.endDate === "string"
                ? lease.duration.endDate
                : lease.duration.endDate.toISOString().split("T")[0]
            }
            securityDeposit={lease.fees.securityDeposit}
            isLoading={isTerminateLoading}
          />

          <Modal
            isOpen={showCancelSignatureModal}
            onClose={() => setShowCancelSignatureModal(false)}
            size="small"
          >
            <Modal.Header
              title="Cancel Signature Request"
              onClose={() => setShowCancelSignatureModal(false)}
            />
            <Modal.Content>
              <div className="modal-notice">
                <i className="bx bx-info-circle"></i>
                <p>
                  Are you sure you want to cancel the signature request? This
                  will change the lease status back to &apos;draft&apos;.
                </p>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="button"
                label="No, Keep Request"
                className="btn-default"
                onClick={() => setShowCancelSignatureModal(false)}
                icon={<i className="bx bx-x"></i>}
                disabled={isCancelSignatureLoading}
              />
              <Button
                type="button"
                className="btn-danger"
                label={
                  isCancelSignatureLoading ? "Cancelling..." : "Yes, Cancel"
                }
                icon={
                  <i
                    className={
                      isCancelSignatureLoading
                        ? "bx bx-loader-alt bx-spin"
                        : "bx bx-check"
                    }
                  ></i>
                }
                onClick={handleCancelSignatureRequest}
                disabled={isCancelSignatureLoading}
              />
            </Modal.Footer>
          </Modal>
        </>
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

      <RenewalConfirmationModal
        isOpen={showRenewalConfirmationModal}
        onClose={() => setShowRenewalConfirmationModal(false)}
        renewalMetadata={responseData?.renewalMetadata}
        cuid={cuid}
        luid={luid}
        canRenewLease={canRenewLease}
      />
    </div>
  );
}
