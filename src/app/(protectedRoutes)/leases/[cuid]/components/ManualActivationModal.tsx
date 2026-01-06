import React, { useState } from "react";
import { Button, Modal } from "@components/FormElements";

interface ManualActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  tenantName: string;
  isLoading?: boolean;
}

export const ManualActivationModal: React.FC<ManualActivationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tenantName,
  isLoading = false,
}) => {
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onConfirm(notes || undefined);
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <Modal.Header title="Manually Activate Lease" onClose={handleClose} />
      <Modal.Content>
        <div className="modal-notice">
          <i className="bx bx-info-circle"></i>
          <p>
            You are about to manually activate this lease for{" "}
            <strong>{tenantName}</strong>. This will bypass the electronic
            signature workflow and immediately change the lease status to
            &apos;active&apos;.
          </p>
        </div>

        <div className="send-signature-info">
          <div className="info-icon">
            <i className="bx bx-error"></i>
          </div>
          <p className="info-text">
            <strong>Important:</strong> Manual activation should only be used
            when the lease has been signed through alternative means (e.g., wet
            signature, in-person signing). The tenant will gain immediate access
            to their portal.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Activation Notes (Optional)</label>
          <textarea
            id="notes"
            className="form-control"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter reason for manual activation (e.g., 'Signed in person on [date]')"
            disabled={isLoading}
          />
          <small className="form-hint">
            These notes will be recorded in the lease activity log
          </small>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          label="Cancel"
          className="btn-default"
          onClick={handleClose}
          icon={<i className="bx bx-x"></i>}
          disabled={isLoading}
        />
        <Button
          type="button"
          className="btn-primary"
          label={isLoading ? "Activating..." : "Activate Lease"}
          icon={
            <i
              className={
                isLoading
                  ? "bx bx-loader-alt bx-spin"
                  : "bx bx-check-circle ghost"
              }
            ></i>
          }
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </Modal.Footer>
    </Modal>
  );
};
