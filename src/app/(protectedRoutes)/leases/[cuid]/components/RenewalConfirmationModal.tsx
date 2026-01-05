"use client";

import React from "react";
import Link from "next/link";
import { Button, Modal } from "@components/FormElements";

interface RenewalMetadata {
  daysUntilExpiry: number;
  renewalWindowDays: number;
  isEligible: boolean;
  canRenew: boolean;
  ineligibilityReason?: string;
  renewalDates: {
    startDate: string;
    endDate: string;
    moveInDate: string;
  };
}

interface RenewalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  renewalMetadata: RenewalMetadata | undefined;
  cuid: string;
  luid: string;
  canRenewLease: boolean;
}

export function RenewalConfirmationModal({
  isOpen,
  onClose,
  renewalMetadata,
  cuid,
  luid,
  canRenewLease,
}: RenewalConfirmationModalProps) {
  if (!renewalMetadata) {
    return null;
  }

  const { canRenew, ineligibilityReason, daysUntilExpiry, renewalDates } =
    renewalMetadata;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <Modal.Header title="Lease Renewal" onClose={onClose} />
      <Modal.Content>
        {!canRenewLease ? (
          <div className="renewal-ineligible">
            <div className="banner banner-danger mb-3">
              <div className="banner-content">
                <div className="banner-content__icon">
                  <i className="bx bx-lock-alt"></i>
                </div>
                <div className="banner-content__info">
                  <h4 className="mb-1">Access Restricted</h4>
                  <p className="mb-0">
                    You don&apos;t have permission to renew this lease. Only the
                    lease creator or administrators can initiate lease renewals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : canRenew ? (
          <div className="renewal-confirmation">
            <div className="banner banner-success mb-3">
              <div className="banner-content">
                <div className="banner-content__icon">
                  <i className="bx bx-check-circle"></i>
                </div>
                <div className="banner-content__info">
                  <h4 className="mb-1">Lease is Eligible for Renewal</h4>
                  <p className="mb-0">
                    This lease can be renewed. The lease expires in{" "}
                    <strong>{daysUntilExpiry} days</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <div className="info-label">New Start Date</div>
                <div className="info-value">
                  {new Date(renewalDates.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">New End Date</div>
                <div className="info-value">
                  {new Date(renewalDates.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Move-in Date</div>
                <div className="info-value">
                  {new Date(renewalDates.moveInDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <p className="muted mt-3">
              Click &quot;Proceed to Renewal&quot; to continue with the lease
              renewal process.
            </p>
          </div>
        ) : (
          <div className="renewal-ineligible">
            <div className="banner banner-warning mb-3">
              <div className="banner-content">
                <div className="banner-content__icon">
                  <i className="bx bx-info-circle"></i>
                </div>
                <div className="banner-content__info">
                  <h4 className="mb-1">Lease Cannot Be Renewed Yet</h4>
                  <p className="mb-0">{ineligibilityReason}</p>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <div className="info-label">Days Until Expiry</div>
                <div className="info-value">
                  <strong>{daysUntilExpiry} days</strong>
                </div>
              </div>
              {renewalMetadata.renewalWindowDays && (
                <div className="info-row">
                  <div className="info-label">Renewal Window</div>
                  <div className="info-value">
                    {renewalMetadata.renewalWindowDays} days before expiry
                  </div>
                </div>
              )}
            </div>

            <p className="muted mt-3">
              You will be able to renew this lease once it enters the renewal
              window period.
            </p>
          </div>
        )}
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          label="Close"
          className="btn-default"
          onClick={onClose}
          icon={<i className="bx bx-x"></i>}
        />
        {canRenewLease && canRenew && (
          <Link
            href={`/leases/${cuid}/${luid}/renew`}
            className="btn btn-primary"
          >
            <i className="bx bx-arrow-right"></i>
            Proceed to Renewal
          </Link>
        )}
      </Modal.Footer>
    </Modal>
  );
}
