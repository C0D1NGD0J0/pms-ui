import React from "react";
import { ListItem } from "@components/ListItem";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorDocumentsTabProps {
  vendor: VendorDetailResponse;
}

export const VendorDocumentsTab: React.FC<VendorDocumentsTabProps> = ({
  vendor,
}) => {
  // Mock documents if none exist
  const documents = vendor.documents || [
    {
      id: "doc-1",
      name: "Business License",
      description: "Valid until: December 31, 2025",
      type: "certificate",
      category: "certificate",
      size: "2.4 MB",
      uploadedAt: "2024-01-01",
    },
    {
      id: "doc-2",
      name: "Insurance Certificate",
      description: "Coverage: $2M • Expires: June 30, 2025",
      type: "insurance",
      category: "insurance",
      size: "1.8 MB",
      uploadedAt: "2024-01-15",
    },
    {
      id: "doc-3",
      name: "Service Agreement Template",
      description: "Updated: November 15, 2024",
      type: "contract",
      category: "contract",
      size: "850 KB",
      uploadedAt: "2023-11-15",
    },
    {
      id: "doc-4",
      name: "Safety Certification",
      description: "OSHA Compliant • Valid until: March 2025",
      type: "certificate",
      category: "certificate",
      size: "1.2 MB",
      uploadedAt: "2024-03-01",
    },
    {
      id: "doc-5",
      name: "Tax ID Documentation",
      description: "EIN: 12-3456789 • Filed: 2024",
      type: "pdf",
      category: "other",
      size: "640 KB",
      uploadedAt: "2024-01-01",
    },
  ];

  const getDocumentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "bx-file-pdf";
      case "image":
      case "jpg":
      case "png":
        return "bx-image";
      case "contract":
        return "bx-file-blank";
      case "certificate":
        return "bx-certification";
      case "insurance":
        return "bx-shield";
      default:
        return "bx-file";
    }
  };

  const documentCategories = [
    {
      id: "insurance",
      title: "Insurance Documents",
      icon: "bx-shield",
      documents: documents.filter((doc) => doc.category === "insurance"),
    },
    {
      id: "contracts",
      title: "Contracts & Agreements",
      icon: "bx-file-blank",
      documents: documents.filter((doc) => doc.category === "contract"),
    },
    {
      id: "certificates",
      title: "Certifications & Licenses",
      icon: "bx-certification",
      documents: documents.filter((doc) => doc.category === "certificate"),
    },
    {
      id: "work-orders",
      title: "Work Order Documents",
      icon: "bx-task",
      documents: documents.filter((doc) => doc.category === "work-order"),
    },
    {
      id: "other",
      title: "Other Documents",
      icon: "bx-file",
      documents: documents.filter(
        (doc) =>
          !doc.category ||
          !["insurance", "contract", "certificate", "work-order"].includes(
            doc.category
          )
      ),
    },
  ];

  return (
    <div className="vendor-documents">
      <div className="documents-header">
        <h4>Documents</h4>
        <div className="documents-actions">
          <button className="btn btn-outline">
            <i className="bx bx-upload"></i>
            Upload Document
          </button>
          <button className="btn btn-primary">
            <i className="bx bx-plus"></i>
            Add Document
          </button>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="documents-categories">
          {documentCategories.map(
            (category) =>
              category.documents.length > 0 && (
                <div key={category.id} className="document-category">
                  <div className="category-header">
                    <div className="category-title">
                      <i className={`bx ${category.icon}`}></i>
                      <h5>{category.title}</h5>
                    </div>
                    <span className="document-count">
                      {category.documents.length} document
                      {category.documents.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="documents-grid">
                    {category.documents.map((document, index) => (
                      <ListItem
                        key={document.id || index}
                        icon={getDocumentIcon(document.type)}
                        title={document.name || "Untitled Document"}
                        subtitle={`${document.size || "Unknown size"} • ${
                          document.uploadedAt
                            ? new Date(document.uploadedAt).toLocaleDateString()
                            : "Unknown date"
                        }`}
                        variant="document"
                        onAction={() =>
                          console.log("Download document", document.id)
                        }
                        onClick={() =>
                          console.log("View document", document.id)
                        }
                      >
                        {document.description && (
                          <p
                            style={{
                              fontSize: "1.1rem",
                              color: "hsl(213, 14%, 56%)",
                              margin: "0.5rem 0 0 0",
                              lineHeight: "1.4",
                            }}
                          >
                            {document.description}
                          </p>
                        )}
                      </ListItem>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bx bx-file"></i>
          </div>
          <h5>No Documents</h5>
          <p>
            No documents have been uploaded for this vendor yet. Documents such
            as insurance certificates, contracts, and licenses will appear here.
          </p>
          <div className="empty-actions">
            <button className="btn btn-outline">
              <i className="bx bx-upload"></i>
              Upload Document
            </button>
            <button className="btn btn-primary">
              <i className="bx bx-plus"></i>
              Add Document
            </button>
          </div>
        </div>
      )}

      <div className="documents-summary">
        <div className="summary-info">
          <div className="summary-stat">
            <i className="bx bx-file"></i>
            <div className="stat-content">
              <div className="stat-value">{documents.length}</div>
              <div className="stat-label">Total Documents</div>
            </div>
          </div>

          <div className="summary-stat">
            <i className="bx bx-shield"></i>
            <div className="stat-content">
              <div className="stat-value">
                {documents.filter((doc) => doc.category === "insurance").length}
              </div>
              <div className="stat-label">Insurance Docs</div>
            </div>
          </div>

          <div className="summary-stat">
            <i className="bx bx-certification"></i>
            <div className="stat-content">
              <div className="stat-value">
                {
                  documents.filter((doc) => doc.category === "certificate")
                    .length
                }
              </div>
              <div className="stat-label">Certificates</div>
            </div>
          </div>

          <div className="summary-stat">
            <i className="bx bx-file-blank"></i>
            <div className="stat-content">
              <div className="stat-value">
                {documents.filter((doc) => doc.category === "contract").length}
              </div>
              <div className="stat-label">Contracts</div>
            </div>
          </div>
        </div>

        <div className="compliance-status">
          <h6>Compliance Status</h6>
          <div className="compliance-items">
            <div className="compliance-item">
              <i className="bx bx-check-circle text-success"></i>
              <span>Insurance: Valid</span>
            </div>
            <div className="compliance-item">
              <i className="bx bx-check-circle text-success"></i>
              <span>Licenses: Current</span>
            </div>
            <div className="compliance-item">
              <i className="bx bx-check-circle text-success"></i>
              <span>Contracts: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorDocumentsTab.displayName = "VendorDocumentsTab";
