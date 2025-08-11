"use client";
import React, { useEffect, useState } from "react";
import { IInvitationTableData } from "@interfaces/invitation.interface";
import {
  FormField,
  FormLabel,
  Textarea,
  Button,
  Modal,
} from "@components/FormElements";

interface ResendInvitationModalProps {
  isOpen: boolean;
  cuid: string;
  invitation: IInvitationTableData | null;
  onClose: () => void;
  onConfirm: (cuid: string, iuid: string, customMessage?: string) => void;
}

export const ResendInvitationModal: React.FC<ResendInvitationModalProps> = ({
  isOpen,
  invitation,
  onClose,
  cuid,
  onConfirm,
}) => {
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCustomMessage("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (invitation) {
      onConfirm(cuid, invitation.iuid, customMessage.trim() || undefined);
      setCustomMessage("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <Modal.Header title="Resend Invitation" onClose={onClose} />
      <Modal.Content>
        <div className="modal-body">
          <p>
            Resend invitation to <strong>{invitation?.inviteeEmail}</strong>
          </p>
          <FormField>
            <FormLabel
              htmlFor="customMessage"
              label="Custom message (optional)"
            />
            <Textarea
              id="customMessage"
              name="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message to include with the resent invitation..."
              rows={4}
            />
          </FormField>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button label="Cancel" className="btn-outline" onClick={onClose} />
        <Button
          label="Resend Invitation"
          className="btn-primary"
          onClick={handleConfirm}
        />
      </Modal.Footer>
    </Modal>
  );
};
