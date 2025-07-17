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
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <Modal.Header title={title} onClose={onClose} />
      <Modal.Content className="preview-modal-content">
        <DocumentPreview
          {...previewProps}
          height="70vh"
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
