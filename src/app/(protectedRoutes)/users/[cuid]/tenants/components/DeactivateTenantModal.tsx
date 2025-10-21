"use client";
import React from "react";
import { Button, Modal } from "@components/FormElements";

interface DeactivateTenantModalProps {
  isOpen: boolean;
  tenantName: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const DeactivateTenantModal: React.FC<DeactivateTenantModalProps> = ({
  isOpen,
  tenantName,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Deactivate Tenant" onClose={onClose} />
      <Modal.Content>
        <div className="modal-body">
          <p style={{ marginBottom: "1rem" }}>
            Are you sure you want to deactivate{" "}
            <strong>{tenantName}</strong>?
          </p>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            This action will:
          </p>
          <ul
            style={{
              marginTop: "0.5rem",
              paddingLeft: "1.5rem",
              color: "var(--color-text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            <li>Soft delete the tenant record</li>
            <li>Disconnect them from this client</li>
            <li>Mark their account as inactive</li>
          </ul>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button
          label="Cancel"
          className="btn-outline"
          onClick={onClose}
          disabled={isSubmitting}
        />
        <Button
          label={isSubmitting ? "Deactivating..." : "Deactivate"}
          className="btn-danger"
          onClick={onConfirm}
          disabled={isSubmitting}
          icon={<i className="bx bx-user-x"></i>}
        />
      </Modal.Footer>
    </Modal>
  );
};
