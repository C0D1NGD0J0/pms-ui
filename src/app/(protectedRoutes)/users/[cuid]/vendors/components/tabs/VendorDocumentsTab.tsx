import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";

interface DocumentData {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  icon: string;
  status: "valid" | "expiring" | "expired";
  expiryDate?: string;
}

interface VendorDocumentsTabProps {
  // In the future, this could accept vendor data to get real documents
}

export const VendorDocumentsTab: React.FC<VendorDocumentsTabProps> = () => {
  // Static document data (matches current page design)
  const documentData: DocumentData[] = [
    {
      id: "doc-1",
      title: "Business License",
      type: "License",
      subtitle: "Valid until: December 31, 2025",
      icon: "bx-certification",
      status: "valid",
      expiryDate: "2025-12-31",
    },
    {
      id: "doc-2",
      title: "Insurance Certificate",
      type: "Insurance",
      subtitle: "Coverage: $2M • Expires: June 30, 2025",
      icon: "bx-shield",
      status: "valid",
      expiryDate: "2025-06-30",
    },
    {
      id: "doc-3",
      title: "Service Agreement Template",
      type: "Agreement",
      subtitle: "Updated: November 15, 2024",
      icon: "bx-file",
      status: "valid",
    },
    {
      id: "doc-4",
      title: "Safety Certification",
      type: "Certification",
      subtitle: "OSHA Compliant • Valid until: March 2025",
      icon: "bx-award",
      status: "expiring",
      expiryDate: "2025-03-31",
    },
    {
      id: "doc-5",
      title: "Tax ID Documentation",
      type: "Tax",
      subtitle: "EIN: 12-3456789 • Filed: 2024",
      icon: "bx-id-card",
      status: "valid",
    },
  ];

  // Define table columns for documents
  const documentColumns: TableColumn<DocumentData>[] = [
    {
      title: "Document",
      dataIndex: "title",
      render: (title: string, record: DocumentData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "hsl(194, 66%, 24%)",
              color: "hsl(0, 0%, 100%)",
              borderRadius: "0.3rem",
            }}
          >
            <i className={`bx ${record.icon}`} style={{ fontSize: "1.2rem" }} />
          </div>
          <div>
            <strong>{title}</strong>
            <div style={{ fontSize: "0.9rem", color: "hsl(213, 14%, 56%)" }}>
              {record.subtitle}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
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
      render: (id: string, record: DocumentData) => (
        <Button
          className="btn btn-sm btn-outline-primary"
          label="Download"
          icon={<i className="bx bx-download"></i>}
          onClick={() => console.log(`Download ${record.title}`)}
        />
      ),
    },
  ];

  return (
    <div className="documents-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Documents & Certifications
      </h3>
      <Table
        columns={documentColumns}
        dataSource={documentData}
        rowKey="id"
        pagination={false}
        tableVariant="default"
      />
    </div>
  );
};

VendorDocumentsTab.displayName = "VendorDocumentsTab";
