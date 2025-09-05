import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@src/components/ListItem/ListItem";
import { FormSection } from "@components/FormLayout/formSection";
import { ProfileFormValues } from "@validations/profile.validations";
import {
  FileInput,
  FormField,
  FormInput,
  FormLabel,
  Button,
  Select,
} from "@components/FormElements";

interface DocumentData {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  icon: string;
  status: "valid" | "expiring" | "expired" | "uploaded";
  expiryDate?: string;
  file?: File;
}

interface DocumentsTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string,
    field?: string
  ) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  documentTypeOptions: Array<{ value: string; label: string }>;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  profileForm,
  handleOnChange,
  handleNestedChange,
  documentTypeOptions,
}) => {
  // Document upload form state
  const [uploadForm, setUploadForm] = React.useState({
    documentName: "",
    documentType: "",
    file: null as File | null,
  });

  // Document types configuration
  const documentTypes = [
    {
      value: "license",
      label: "Professional License",
      icon: "bx-certification",
    },
    { value: "insurance", label: "Insurance Certificate", icon: "bx-shield" },
    { value: "training", label: "Training Certificate", icon: "bx-file" },
    { value: "certification", label: "Safety Certification", icon: "bx-award" },
    { value: "id", label: "ID Documentation", icon: "bx-id-card" },
    { value: "contract", label: "Contract/Agreement", icon: "bx-file-blank" },
    { value: "tax", label: "Tax Document", icon: "bx-receipt" },
    { value: "other", label: "Other", icon: "bx-file" },
  ];

  // Mock document data - in real implementation this would come from formData
  const [documents, setDocuments] = React.useState<DocumentData[]>([
    {
      id: "doc-1",
      title: "Professional License",
      type: "Professional License",
      subtitle: "Valid until: December 31, 2025",
      icon: "bx-certification",
      status: "valid",
      expiryDate: "2025-12-31",
    },
    {
      id: "doc-2",
      title: "Insurance Certificate",
      type: "Insurance Certificate",
      subtitle: "Coverage: $2M • Expires: June 30, 2025",
      icon: "bx-shield",
      status: "valid",
      expiryDate: "2025-06-30",
    },
  ]);

  const handleFormChange = (field: string, value: any) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddDocument = () => {
    if (uploadForm.file && uploadForm.documentName && uploadForm.documentType) {
      const selectedType = documentTypes.find(
        (type) => type.value === uploadForm.documentType
      );
      const newDocument: DocumentData = {
        id: `doc-${Date.now()}`,
        title: uploadForm.documentName,
        type: selectedType?.label || uploadForm.documentType,
        subtitle: `${
          uploadForm.file.name
        } • Uploaded: ${new Date().toLocaleDateString()}`,
        icon: selectedType?.icon || "bx-file",
        status: "uploaded",
        file: uploadForm.file,
      };

      setDocuments((prev) => [...prev, newDocument]);

      // Reset form
      setUploadForm({
        documentName: "",
        documentType: "",
        file: null,
      });

      // In real implementation, you would also update the form data
      // handleInputChange("documents", newDocument.id, newDocument);
    }
  };

  const handleDownload = (document: DocumentData) => {
    if (document.file) {
      // Create download link for uploaded file
      const url = URL.createObjectURL(document.file);
      const link = globalThis.document.createElement("a");
      link.href = url;
      link.download = document.file.name;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Download ${document.title} from server`);
      // In real implementation, download from server/S3
    }
  };

  const handleRemove = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

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
          uploaded: { className: "info", label: "Uploaded" },
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
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            className="btn btn-sm btn-outline-primary"
            label="Download"
            icon={<i className="bx bx-download"></i>}
            onClick={() => handleDownload(record)}
          />
          <Button
            className="btn btn-sm btn-outline-danger"
            label="Remove"
            icon={<i className="bx bx-trash"></i>}
            onClick={() => handleRemove(id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="resource-form">
      <FormSection
        title="Upload Document"
        description="Upload a new document with custom name and type"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="documentName" label="Document Name" />
            <FormInput
              id="documentName"
              name="documentName"
              type="text"
              placeholder="Enter document name (e.g., My Professional License)"
              value={uploadForm.documentName}
              onChange={(e) => handleFormChange("documentName", e.target.value)}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="documentType" label="Document Type" />
            <Select
              id="documentType"
              name="documentType"
              value={uploadForm.documentType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleFormChange("documentType", e.target.value)
              }
              options={[
                { value: "", label: "Select document type..." },
                ...documentTypes.map((type) => ({
                  value: type.value,
                  label: type.label,
                })),
              ]}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FileInput
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(file) => handleFormChange("file", file)}
            instructionText="Upload your document - PDF, DOC, or image files accepted (max 10MB)"
          />
        </div>
        <div className="form-actions">
          <Button
            className="btn btn-primary"
            label="Add Document"
            icon={<i className="bx bx-plus"></i>}
            onClick={handleAddDocument}
            disabled={
              !uploadForm.file ||
              !uploadForm.documentName ||
              !uploadForm.documentType
            }
          />
        </div>
      </FormSection>

      <FormSection
        title="Document Management"
        description="View and manage all your uploaded documents"
      >
        <Table
          columns={documentColumns}
          dataSource={documents}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
      </FormSection>
    </div>
  );
};
