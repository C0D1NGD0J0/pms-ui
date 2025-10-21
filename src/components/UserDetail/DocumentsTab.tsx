import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@src/components/ListItem/ListItem";

interface DocumentData {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  icon: string;
  status: "valid" | "expiring" | "expired";
  expiryDate?: string;
}

interface DocumentsTabProps {
  userType?: "employee" | "vendor" | "tenant";
  documents?: DocumentData[];
}

// Document type to icon mapping
const getDocumentIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    // Employee documents
    certification: "bx-certification",
    training: "bx-book-reader",
    id: "bx-id-card",
    identification: "bx-id-card",

    // Vendor documents
    license: "bx-certification",
    agreement: "bx-file-blank",
    contract: "bx-file-blank",
    tax: "bx-receipt",

    // Tenant documents
    lease: "bx-home",
    application: "bx-file-blank",
    background: "bx-shield-check",
    reference: "bx-user-check",
    pet: "bx-bone",

    // Shared documents
    insurance: "bx-shield",
    safety: "bx-award",
    document: "bx-file",
    invoice: "bx-receipt",
    report: "bx-bar-chart",
    w9: "bx-receipt",
    "w-9": "bx-receipt",
  };

  const normalizedType = type.toLowerCase().trim();
  return iconMap[normalizedType] || "bx-file";
};

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  userType = "employee",
  documents = [],
}) => {
  // Enhance documents with proper icons if not provided
  const enhancedDocuments = documents.map((doc) => ({
    ...doc,
    icon: doc.icon.startsWith("bx") ? doc.icon : getDocumentIcon(doc.type),
  }));

  // Define table columns for documents
  const documentColumns: TableColumn<DocumentData>[] = [
    {
      title: "Document",
      dataIndex: "title",
      render: (title: string, record: DocumentData) => (
        <ListItem
          icon={`bx ${record.icon}`}
          title={title}
          subtitle={record.subtitle}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => (
        <span style={{ textTransform: "capitalize" }}>{type}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: DocumentData["status"]) => {
        const statusConfig = {
          valid: { className: "completed", label: "Valid" },
          expiring: { className: "warning", label: "Expiring Soon" },
          expired: { className: "danger", label: "Expired" },
        };
        const config = statusConfig[status];
        return (
          <span className={`status-badge ${config.className}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: string, record: DocumentData) => (
        <Button
          className="btn btn-sm btn-outline-primary"
          label="Download"
          icon={<i className="bx bx-download"></i>}
          onClick={() => console.log(`Download ${record.title}`)}
        />
      ),
    },
  ];

  // Title based on user type
  const getTitleByUserType = () => {
    switch (userType) {
      case "employee":
        return "Documents & Certifications";
      case "vendor":
        return "Documents & Licenses";
      case "tenant":
        return "Documents & Leases";
      default:
        return "Documents";
    }
  };

  return (
    <div className="user-detail-tab">
      <h3 className="detail-section-title">{getTitleByUserType()}</h3>

      {enhancedDocuments.length > 0 ? (
        <Table
          columns={documentColumns}
          dataSource={enhancedDocuments}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
      ) : (
        <div className="detail-empty-state">
          <i className="bx bx-file"></i>
          <p>No documents available</p>
          <p>
            {userType === "tenant"
              ? "Lease agreements and tenant documents will appear here once they are uploaded."
              : userType === "vendor"
              ? "Business licenses, insurance certificates, and other vendor documents will appear here once they are uploaded."
              : "Certifications, training documents, and other files will appear here once they are uploaded."}
          </p>
        </div>
      )}
    </div>
  );
};

DocumentsTab.displayName = "DocumentsTab";
