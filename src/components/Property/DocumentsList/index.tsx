import React from "react";
import { Button } from "@components/FormElements";

export interface Document {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DocumentsListProps {
  viewType: "landlord" | "tenant";
  documents: Document[];
  onDownload?: (documentId: string) => void;
  onUpload?: () => void;
  className?: string;
}

export function DocumentsList({
  viewType,
  documents,
  onDownload,
  onUpload,
  className = "",
}: DocumentsListProps) {
  return (
    <div className={`documents-tab ${className}`}>
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id} className="document-item">
            <div className="document-content">
              <div className="document-icon">
                <i className={`bx ${document.icon}`}></i>
              </div>
              <div>
                <h4>{document.title}</h4>
                <p>{document.description}</p>
              </div>
            </div>
            <Button
              key={`download-${document.id}`}
              className="btn btn-sm btn-outline"
              label="Download"
              icon={<i className="bx bx-download"></i>}
              onClick={() => onDownload?.(document.id)}
            />
          </div>
        ))}
      </div>
      {viewType === "landlord" && onUpload && (
        <div
          className="form-actions"
          style={{ marginTop: "1rem", justifyContent: "flex-end" }}
        >
          <Button
            className="btn btn-primary"
            label="Upload Document"
            icon={<i className="bx bx-plus"></i>}
            onClick={onUpload}
          />
        </div>
      )}
    </div>
  );
}
