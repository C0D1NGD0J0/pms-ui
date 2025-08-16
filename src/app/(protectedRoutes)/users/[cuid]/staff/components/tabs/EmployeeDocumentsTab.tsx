import React from "react";

import { EmployeeDetail } from "../../hooks/useGetEmployee";

interface EmployeeDocumentsTabProps {
  employee: EmployeeDetail;
  onDownloadDocument?: (documentId: string) => void;
}

export const EmployeeDocumentsTab: React.FC<EmployeeDocumentsTabProps> = ({
  employee,
  onDownloadDocument,
}) => {
  const { documents } = employee;

  const handleDownload = (documentId: string) => {
    if (onDownloadDocument) {
      onDownloadDocument(documentId);
    } else {
      console.log('Download document:', documentId);
      // Default behavior - could show a toast or handle download
    }
  };

  return (
    <div className="employee-documents">
      <h3 className="tab-section-title">Documents & Certifications</h3>
      
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id} className="document-item">
            <div className="document-info">
              <div className="document-icon">
                <i className={document.icon}></i>
              </div>
              <div className="document-details">
                <h5>{document.name}</h5>
                <span>{document.date}</span>
              </div>
            </div>
            <div 
              className="document-action"
              onClick={() => handleDownload(document.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDownload(document.id);
                }
              }}
              aria-label={`Download ${document.name}`}
            >
              <i className="bx bx-download"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

EmployeeDocumentsTab.displayName = 'EmployeeDocumentsTab';