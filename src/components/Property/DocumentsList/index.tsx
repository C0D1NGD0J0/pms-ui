import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@components/ListItem/ListItem";
import { FormSection } from "@components/FormLayout/formSection";

export interface Document {
  id: string;
  title: string;
  description: string;
  icon: string;
  type?: string;
  status?: "valid" | "expiring" | "expired" | "uploaded" | "pending";
  uploadedAt?: string | Date;
  url?: string;
  filename?: string;
}

export interface DocumentsListProps {
  viewType: "landlord" | "tenant";
  documents: Document[];
  onDownload?: (documentId: string) => void;
  onRemove?: (documentId: string) => void;
  onUpload?: () => void;
  className?: string;
  title?: string;
  description?: string;
  showActions?: boolean;
}

export function DocumentsList({
  viewType,
  documents,
  onDownload,
  onRemove,
  onUpload,
  className = "",
  title = "Documents",
  description = "View and manage property documents",
  showActions = true,
}: DocumentsListProps) {
  // Determine available actions based on view type
  const canRemove = viewType === "landlord" && onRemove;
  const canUpload = viewType === "landlord" && onUpload;
  const getDocumentDisplayInfo = (document: Document) => {
    const subtitle = document.filename
      ? `${document.filename} • ${
          document.uploadedAt
            ? new Date(document.uploadedAt).toLocaleDateString()
            : "Recently uploaded"
        }`
      : document.description;

    return {
      title: document.title,
      subtitle,
      icon: document.icon || "bx-file",
      typeLabel: document.type || "Document",
    };
  };

  const handleDownload = (document: Document) => {
    if (document.url) {
      window.open(document.url, "_blank");
    } else if (onDownload) {
      onDownload(document.id);
    }
  };

  const handleRemove = (documentId: string) => {
    if (onRemove) {
      onRemove(documentId);
    }
  };

  const documentColumns: TableColumn<Document>[] = [
    {
      title: "Document",
      dataIndex: "title",
      render: (title: string, record: Document) => {
        const displayInfo = getDocumentDisplayInfo(record);
        return (
          <ListItem
            icon={displayInfo.icon}
            title={displayInfo.title}
            subtitle={displayInfo.subtitle}
            variant="document"
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string, record: Document) => {
        const displayInfo = getDocumentDisplayInfo(record);
        return displayInfo.typeLabel;
      },
    },
    ...((record) =>
      record.status
        ? [
            {
              title: "Status",
              dataIndex: "status" as keyof Document,
              render: (status: Document["status"]) => {
                if (!status) return null;

                const statusConfig = {
                  valid: { className: "completed", label: "Valid" },
                  expiring: { className: "warning", label: "Expiring Soon" },
                  expired: { className: "danger", label: "Expired" },
                  uploaded: { className: "info", label: "Uploaded" },
                  pending: { className: "pending", label: "Pending" },
                };
                const config = statusConfig[status];
                return (
                  <span className={`status-badge ${config.className ?? ""}`}>
                    {config.label}
                  </span>
                );
              },
            },
          ]
        : [])(documents[0] || {}),
    ...(showActions
      ? [
          {
            title: "Actions",
            dataIndex: "id" as keyof Document,
            render: (id: string, record: Document) => (
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <Button
                  className="btn btn-sm btn-outline-primary"
                  label="Download"
                  icon={<i className="bx bx-download"></i>}
                  onClick={() => handleDownload(record)}
                />
                {canRemove && (
                  <Button
                    className="btn btn-sm btn-outline-danger"
                    label="Remove"
                    icon={<i className="bx bx-trash"></i>}
                    onClick={() => handleRemove(id)}
                  />
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  if (documents.length === 0) {
    return (
      <div className={`documents-tab ${className}`}>
        <FormSection title={title} description={description}>
          <div className="empty-state">
            <i
              className="bx bx-file"
              style={{ fontSize: "3rem", opacity: 0.5 }}
            ></i>
            <p>No documents available</p>
          </div>
        </FormSection>
      </div>
    );
  }

  return (
    <div className={`documents-tab ${className}`}>
      <FormSection title={title} description={description}>
        <Table
          columns={documentColumns}
          dataSource={documents}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
        {canUpload && (
          <div className="form-actions" style={{ marginTop: "1rem" }}>
            <Button
              className="btn btn-primary"
              label="Upload Document"
              icon={<i className="bx bx-plus"></i>}
              onClick={onUpload}
            />
          </div>
        )}
      </FormSection>
    </div>
  );
}
