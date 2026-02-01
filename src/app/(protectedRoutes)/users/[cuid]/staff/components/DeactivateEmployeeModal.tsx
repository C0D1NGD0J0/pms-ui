"use client";
import React from "react";
import { Button, Modal } from "@components/FormElements";

interface DeactivateEmployeeModalProps {
  isOpen: boolean;
  employeeName: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const DeactivateEmployeeModal: React.FC<
  DeactivateEmployeeModalProps
> = ({ isOpen, employeeName, onClose, onConfirm, isSubmitting = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Remove Employee" onClose={onClose} />
      <Modal.Content>
        <div className="modal-body">
          <p style={{ marginBottom: "1rem" }}>
            Are you sure you want to remove <strong>{employeeName}</strong>?
          </p>
          <p
            style={{
              fontSize: "0.9rem",
            }}
          >
            This action will:
          </p>
          <ul
            style={{
              marginTop: "0.5rem",
              paddingLeft: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            <li>Disconnect them from this client</li>
            <li>Mark their account as inactive (isConnected: false)</li>
            <li>Free up 1 seat in your subscription</li>
            <li>
              Preserve all their data for compliance and audit purposes
            </li>
            <li>They will NOT be able to login to this account</li>
          </ul>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: "var(--text-secondary)",
            }}
          >
            Note: You can reconnect this employee later if needed.
          </p>
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
          label={isSubmitting ? "Removing..." : "Remove Employee"}
          className="btn-danger"
          onClick={onConfirm}
          disabled={isSubmitting}
          icon={<i className="bx bx-user-x"></i>}
        />
      </Modal.Footer>
    </Modal>
  );
};
