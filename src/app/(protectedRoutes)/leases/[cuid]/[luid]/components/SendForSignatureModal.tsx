import React from "react";
import { Button, Modal } from "@components/FormElements";

interface SendForSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tenantName: string;
  coTenants?: Array<{ name: string; email: string }>;
  isLoading?: boolean;
}

export const SendForSignatureModal: React.FC<SendForSignatureModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tenantName,
  coTenants = [],
  isLoading = false,
}) => {
  const totalRecipients = 1 + coTenants.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <Modal.Header title="Send Lease for Signature" onClose={onClose} />
      <Modal.Content>
        <div className="send-signature-info">
          <div className="info-icon">
            <i className="bx bx-envelope"></i>
          </div>
          <p className="info-text">
            This lease will be sent to the following{" "}
            {totalRecipients === 1 ? "recipient" : "recipients"} for electronic
            signature:
          </p>
        </div>

        <div className="recipients-list">
          <div className="recipient-item">
            <i className="bx bx-user-circle"></i>
            <div className="recipient-details">
              <strong>{tenantName}</strong>
              <span className="recipient-label">Primary Tenant</span>
            </div>
          </div>

          {coTenants.map((coTenant, idx) => (
            <div key={idx} className="recipient-item">
              <i className="bx bx-user"></i>
              <div className="recipient-details">
                <strong>{coTenant.name}</strong>
                <span className="recipient-label">
                  Co-Tenant • {coTenant.email}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-notice">
          <i className="bx bx-info-circle"></i>
          <p>
            Each recipient will receive an email with a secure link to review
            and sign the lease agreement. You&apos;ll be notified once all signatures
            are collected.
          </p>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          label="Cancel"
          className="btn-default"
          onClick={onClose}
          icon={<i className="bx bx-stop-circle danger"></i>}
          disabled={isLoading}
        />
        <Button
          type="button"
          className="btn-primary"
          label={isLoading ? "Sending..." : "Send for Signature"}
          icon={<i className="bx bx-send"></i>}
          onClick={onConfirm}
          disabled={isLoading}
        />
      </Modal.Footer>
    </Modal>
  );
};
