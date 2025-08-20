import React from 'react';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'certification' | 'contract' | 'license' | 'insurance' | 'report';
}

interface DocumentsTabProps {
  userType: 'employee' | 'vendor';
  documents: Document[];
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  userType,
  documents
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return 'bx-certification';
      case 'contract':
        return 'bx-file';
      case 'license':
        return 'bx-id-card';
      case 'insurance':
        return 'bx-shield';
      case 'report':
        return 'bx-award';
      default:
        return 'bx-file';
    }
  };

  const title = userType === 'employee' 
    ? 'Documents & Certifications'
    : 'Documents & Licenses';

  return (
    <div className="documents-tab">
      <h3 style={{ marginBottom: '1.5rem', color: 'hsl(194, 66%, 24%)' }}>
        {title}
      </h3>
      
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id} className="document-item">
            <div className="document-info">
              <div className="document-icon">
                <i className={`bx ${getDocumentIcon(document.type)}`}></i>
              </div>
              <div className="document-details">
                <h5>{document.title}</h5>
                <span>{document.description}</span>
              </div>
            </div>
            <div className="document-action">
              <i className="bx bx-download"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};