"use client";

import { Loading } from "@components/Loading";
import { Button } from "@components/FormElements";

import { LeaseRenewalView } from "./view";
import { useLeaseRenewalLogic } from "./hook";

interface LeaseRenewalPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export default function LeaseRenewalPage({ params }: LeaseRenewalPageProps) {
  const {
    cuid,
    luid,
    renewalInitialValues,
    isLoadingLease,
    isLeaseError,
    isSubmitting,
    validationResult,
    handleCreateRenewal,
    handleCancel,
  } = useLeaseRenewalLogic({ params });

  if (isLoadingLease) {
    return <Loading size="regular" description="Loading lease details..." />;
  }

  if (isLeaseError) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">
            <i className="bx bx-error-circle"></i>
          </div>
          <h3>Error Loading Lease</h3>
          <div className="error-message">
            Unable to fetch lease data. Please try again.
          </div>
          <div className="flex-row flex-center">
            <Button
              onClick={handleCancel}
              className="btn btn-outline"
              label="Back to Lease Details"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoadingLease && !validationResult.canProceed) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">
            <i
              className={`bx ${
                validationResult.action === "error"
                  ? "bx-error-circle"
                  : "bx-info-circle"
              }`}
            ></i>
          </div>
          <h3>Cannot Renew Lease</h3>
          <div className="error-message">{validationResult.reason}</div>
          <div className="flex-row flex-center" style={{ marginTop: "1.5rem" }}>
            <Button
              onClick={handleCancel}
              className="btn btn-primary"
              label="Back to Lease Details"
              icon={<i className="bx bx-arrow-back"></i>}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!renewalInitialValues) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">
            <i className="bx bx-error-circle"></i>
          </div>
          <h3>Unable to Prepare Renewal</h3>
          <div className="error-message">
            Could not prepare the renewal form with lease data.
          </div>
          <div className="flex-row flex-center">
            <Button
              onClick={handleCancel}
              className="btn btn-outline"
              label="Back to Lease Details"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LeaseRenewalView
      cuid={cuid}
      luid={luid}
      isSubmitting={isSubmitting}
      handleCancel={handleCancel}
      handleCreateRenewal={handleCreateRenewal}
      renewalInitialValues={renewalInitialValues}
    />
  );
}
