import React from "react";
import { Button, Modal } from "@components/FormElements";
import { DocumentPreview } from "@components/DocumentPreview/DocumentPreview";

interface LeasePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html?: string;
  isLoading?: boolean;
  onGeneratePreview: () => void;
}

export const LeasePreviewModal: React.FC<LeasePreviewModalProps> = ({
  isOpen,
  onClose,
  html,
  isLoading = false,
  onGeneratePreview,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <Modal.Header title="Lease Agreement Preview" onClose={onClose} />
      <Modal.Content>
        <div className="lease-preview-modal">
          {!html && !isLoading && (
            <div className="empty-state">
              <i className="bx bx-file"></i>
              <p>
                Click &quot;Generate Preview&quot; to view the lease agreement.
              </p>
              <Button
                type="button"
                label="Generate Preview"
                onClick={onGeneratePreview}
                className="mt-2"
              />
            </div>
          )}

          {isLoading && (
            <div className="loading-overlay">
              <i className="bx bx-loader-alt bx-spin"></i>
              <p>Loading preview...</p>
            </div>
          )}

          {html && !isLoading && (
            <div className="preview-container">
              <Button
                type="button"
                label="Refresh Preview"
                onClick={onGeneratePreview}
                className="mb-2"
              />
              <DocumentPreview
                type={"html"}
                content={html}
                renderMode="direct"
                title="Lease Agreement"
              />
            </div>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button type="button" label="Close" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
