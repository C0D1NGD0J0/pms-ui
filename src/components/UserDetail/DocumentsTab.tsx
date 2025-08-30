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
  userType: 'employee' | 'vendor';
  documents?: DocumentData[];
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  userType, 
  documents 
}) => {
  // Use provided documents or fallback to static data for demo purposes
  const documentData: DocumentData[] = documents || [
    {
      id: "doc-1",
      title: userType === 'employee' ? "Employee Certification" : "Business License",
      type: userType === 'employee' ? "Certification" : "License",
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
      title: userType === 'employee' ? "Training Certificate" : "Service Agreement Template",
      type: userType === 'employee' ? "Training" : "Agreement",
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
      title: userType === 'employee' ? "ID Documentation" : "Tax ID Documentation",
      type: userType === 'employee' ? "ID" : "Tax",
      subtitle: userType === 'employee' ? "Employee ID: 12345 • Valid" : "EIN: 12-3456789 • Filed: 2024",
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

  const title = userType === 'employee' 
    ? 'Documents & Certifications'
    : 'Documents & Licenses';

  return (
    <div className="documents-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        {title}
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

DocumentsTab.displayName = "DocumentsTab";