"use client";
import React from "react";
import { PreviewModal } from "@components/DocumentPreview";
import { IUserRole } from "@interfaces/invitation.interface";
import { InvitationFormValues } from "@validations/invitation.validations";

interface InvitationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InvitationFormValues;
  selectedRole: IUserRole | null;
  templateVariables: Record<string, any>;
}

export const InvitationPreviewModal: React.FC<InvitationPreviewModalProps> = ({
  isOpen,
  onClose,
  templateVariables,
}) => {
  return (
    <PreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Invitation Preview"
      previewProps={{
        type: "template",
        renderMode: "iframe",
        templateId: "invitation",
        variables: templateVariables,
        title: "Email Preview",
      }}
    />
  );
};
