import React from "react";
import { formatDate } from "@utils/dateFormatter";
import { Button, Modal } from "@components/FormElements";
import { LeaseDetailData } from "@interfaces/lease.interface";

interface ScheduleRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  renewalLease: LeaseDetailData;
  newStartDate?: string;
  newEndDate?: string;
  isLoading?: boolean;
}

export const ScheduleRenewalModal = React.memo<ScheduleRenewalModalProps>(
  ({
    isOpen,
    onClose,
    onConfirm,
    renewalLease,
    newStartDate,
    newEndDate,
    isLoading = false,
  }) => {
    const daysBeforeExpiry =
      renewalLease?.renewalOptions?.daysBeforeExpiryToAutoSendSignature || 7;

    const renewalStartDate = new Date(
      newStartDate || renewalLease.duration.endDate
    );
    const signatureDate = new Date(renewalStartDate);
    signatureDate.setDate(renewalStartDate.getDate() - daysBeforeExpiry);

    return (
      <Modal isOpen={isOpen} onClose={onClose} className="modal-lg">
        <Modal.Header title="Schedule Lease Renewal" />
        <Modal.Content>
          <div className="banner banner-info">
            <div className="banner-content">
              <div className="banner-content__icon">
                <i className="bx bx-calendar-star"></i>
              </div>
              <div className="banner-content__info">
                <p className="mb-0">
                  This renewal will be automatically sent to{" "}
                  <strong>{renewalLease.tenant?.fullname}</strong> for signature
                  on{" "}
                  <strong>
                    {formatDate(signatureDate.toISOString(), {
                      displayFormat: "shortMonth",
                    })}
                  </strong>
                  . You can edit or cancel anytime before it&apos;s sent.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "2rem",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h4
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: "#1f2937",
              }}
            >
              Renewal Details
            </h4>

            <div className="info-grid">
              <div className="info-row">
                <div className="info-label">Lease Number</div>
                <div className="info-value">{renewalLease.leaseNumber}</div>
              </div>

              <div className="info-row">
                <div className="info-label">Current Lease Term</div>
                <div className="info-value">
                  {formatDate(renewalLease.duration.startDate as string, {
                    displayFormat: "shortMonth",
                  })}{" "}
                  -{" "}
                  {formatDate(renewalLease.duration.endDate as string, {
                    displayFormat: "shortMonth",
                  })}
                </div>
              </div>

              {newStartDate && newEndDate && (
                <div className="info-row">
                  <div className="info-label">New Renewal Term</div>
                  <div className="info-value">
                    {formatDate(newStartDate, {
                      displayFormat: "shortMonth",
                    })}{" "}
                    -{" "}
                    {formatDate(newEndDate, {
                      displayFormat: "shortMonth",
                    })}
                  </div>
                </div>
              )}

              <div className="info-row">
                <div className="info-label">Signature Request Date</div>
                <div className="info-value">
                  {formatDate(signatureDate.toISOString(), {
                    displayFormat: "shortMonth",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="banner banner-warning" style={{ marginTop: "2rem" }}>
            <div className="banner-content">
              <div className="banner-content__icon">
                <i className="bx bx-info-circle"></i>
              </div>
              <div className="banner-content__info">
                <p className="mb-1">
                  <strong>What happens next?</strong>
                </p>
                <p className="mb-0">
                  The renewal will be saved as <strong>draft_renewal</strong>{" "}
                  status. Our automated system will send it to the tenant{" "}
                  {daysBeforeExpiry} days before the new lease starts for
                  electronic signature.
                </p>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button
            className="btn btn-outline"
            label="Cancel"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            className="btn btn-primary"
            label={isLoading ? "Scheduling..." : "Schedule Renewal"}
            icon={
              <i
                className={
                  isLoading
                    ? "bx bx-loader-alt bx-spin"
                    : "bx bx-calendar-check"
                }
              ></i>
            }
            onClick={onConfirm}
            disabled={isLoading}
          />
        </Modal.Footer>
      </Modal>
    );
  }
);

ScheduleRenewalModal.displayName = "ScheduleRenewalModal";
