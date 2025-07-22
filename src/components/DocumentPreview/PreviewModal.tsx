"use client";
import React from "react";
import { Button, Modal } from "@components/FormElements";

import { PreviewModalProps } from "./interface";
import { DocumentPreview } from "./DocumentPreview";

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  title = "Document Preview",
  previewProps,
  size = "large",
  destroyOnHidden = false,
}) => {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      destroyOnHidden={destroyOnHidden}
    >
      <Modal.Header title={title} onClose={onClose} />
      <Modal.Content className="preview-modal-content">
        <DocumentPreview
          {...previewProps}
          height="100%"
          width="100%"
          className="modal-document-preview"
        />
      </Modal.Content>
      <Modal.Footer className="preview-modal-footer">
        <Button label="Close" className="btn-outline" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
