"use client";
import React, { useEffect, useState } from "react";
import { IInvitationDocument } from "@src/interfaces/invitation.interface";
import {
  FormField,
  FormLabel,
  Textarea,
  Button,
  Modal,
} from "@components/FormElements";

interface DeclineInvitationModalProps {
  isOpen: boolean;
  invitation: IInvitationDocument | null;
  onClose: () => void;
  onConfirm: (token: string, reason: string) => void;
  isSubmitting?: boolean;
}

export const DeclineInvitationModal: React.FC<DeclineInvitationModalProps> = ({
  isOpen,
  invitation,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDeclineReason("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (invitation && declineReason.trim()) {
      onConfirm(invitation.invitationToken, declineReason.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <Modal.Header title="Decline Invitation" onClose={onClose} />
      <Modal.Content>
        <div className="modal-body">
          <p>
            Are you sure you want to decline the invitation from{" "}
            <strong>{invitation?.invitedBy?.fullname}</strong> to join{" "}
            <strong>
              {invitation?.role === "vendor" &&
              invitation?.metadata?.vendorInfo?.companyName
                ? invitation.metadata.vendorInfo.companyName
                : invitation?.clientId?.name || "the organization"}
            </strong>{" "}
            as a <strong>{invitation?.role}</strong>?
          </p>
          <FormField>
            <FormLabel
              htmlFor="declineReason"
              label="Reason for declining"
              required
            />
            <Textarea
              id="declineReason"
              name="declineReason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Please provide a reason for declining this invitation..."
              rows={4}
              required
              disabled={isSubmitting}
            />
          </FormField>
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
          label={isSubmitting ? "Declining..." : "Decline Invitation"}
          className="btn-danger"
          onClick={handleConfirm}
          disabled={!declineReason.trim() || isSubmitting}
        />
      </Modal.Footer>
    </Modal>
  );
};
