"use client";
import React, { useEffect, useState } from "react";
import { IInvitationTableData } from "@interfaces/invitation.interface";
import {
  FormField,
  FormLabel,
  TextArea,
  Button,
  Modal,
} from "@components/FormElements";

interface RevokeInvitationModalProps {
  isOpen: boolean;
  invitation: IInvitationTableData | null;
  onClose: () => void;
  cuid: string;
  onConfirm: (cuid: string, iuid: string, reason: string) => void;
}

export const RevokeInvitationModal: React.FC<RevokeInvitationModalProps> = ({
  isOpen,
  invitation,
  onClose,
  cuid,
  onConfirm,
}) => {
  const [revokeReason, setRevokeReason] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setRevokeReason("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (invitation && revokeReason.trim()) {
      onConfirm(cuid, invitation.iuid, revokeReason.trim());
      setRevokeReason("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <Modal.Header title="Revoke Invitation" onClose={onClose} />
      <Modal.Content>
        <div className="modal-body">
          <p>
            Are you sure you want to revoke the invitation for{" "}
            <strong>{invitation?.inviteeEmail}</strong>?
          </p>
          <FormField>
            <FormLabel
              htmlFor="revokeReason"
              label="Reason for revocation"
              required
            />
            <TextArea
              id="revokeReason"
              name="revokeReason"
              value={revokeReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRevokeReason(e.target.value)
              }
              placeholder="Please provide a reason for revoking this invitation..."
              rows={4}
              required
            />
          </FormField>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button label="Cancel" className="btn-outline" onClick={onClose} />
        <Button
          label="Revoke Invitation"
          className="btn-danger"
          onClick={handleConfirm}
          disabled={!revokeReason.trim()}
        />
      </Modal.Footer>
    </Modal>
  );
};
