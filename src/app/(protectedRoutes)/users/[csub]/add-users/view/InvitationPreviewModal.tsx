"use client";
import React from "react";
import { PreviewModal } from "@components/DocumentPreview";
import { InvitationFormValues } from "@validations/invitation.validations";

interface InvitationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  error?: Error | null;
  renderContent: string;
  formData: InvitationFormValues;
}

export const InvitationPreviewModal: React.FC<InvitationPreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  renderContent,
  isLoading,
  error,
}) => {
  const handleError = (err: Error) => {
    console.error("InvitationPreviewModal error:", err);
  };

  const handleLoad = () => {
    console.log("InvitationPreviewModal content loaded successfully");
  };

  const fallbackContent = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>Email Preview Not Available</h2>
      <p>${
        error
          ? `Error: ${error.message}`
          : "There was an issue loading the email template preview."
      }</p>
      <details>
        <summary>Debug Information</summary>
        <pre>${JSON.stringify(
          {
            hasFormData: !!formData,
            isLoading,
            hasRenderedContent: !!renderContent,
            errorMessage: error?.message,
          },
          null,
          2
        )}</pre>
      </details>
    </div>
  `;

  return (
    <PreviewModal
      isOpen={isOpen}
      onClose={onClose}
      destroyOnHidden
      title="Email Invitation Preview"
      previewProps={{
        type: "html",
        renderMode: "iframe",
        height: "100%",
        content: isLoading
          ? `<div style="padding: 20px; text-align: center;">Loading template...</div>`
          : renderContent || fallbackContent,
        title: "Email Preview",
        onLoadError: handleError,
        onLoad: handleLoad,
        fallbackContent,
      }}
    />
  );
};
