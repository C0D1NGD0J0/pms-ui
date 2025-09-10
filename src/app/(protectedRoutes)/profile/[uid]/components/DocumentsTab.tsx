import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@src/components/ListItem/ListItem";
import { FormSection } from "@components/FormLayout/formSection";
import {
  DocumentFormValues,
  ProfileFormValues,
} from "@validations/profile.validations";
import {
  FileInput,
  FormField,
  FormInput,
  FormLabel,
  Button,
  Select,
} from "@components/FormElements";

interface DocumentsTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  profileForm,
  handleNestedChange,
}) => {
  // Document upload form state
  const [uploadForm, setUploadForm] = React.useState({
    documentName: "",
    documentType: "other" as DocumentFormValues["type"],
    file: null as File | null,
  });

  const documentTypes = [
    {
      value: "passport" as const,
      label: "Passport",
      icon: "bx-id-card",
    },
    {
      value: "id_card" as const,
      label: "ID Card",
      icon: "bx-id-card",
    },
    {
      value: "drivers_license" as const,
      label: "Driver's License",
      icon: "bx-car",
    },
    {
      value: "birth_certificate" as const,
      label: "Birth Certificate",
      icon: "bx-certification",
    },
    {
      value: "social_security" as const,
      label: "Social Security",
      icon: "bx-shield",
    },
    {
      value: "tax_document" as const,
      label: "Tax Document",
      icon: "bx-receipt",
    },
    {
      value: "employment_verification" as const,
      label: "Employment Verification",
      icon: "bx-briefcase",
    },
    {
      value: "other" as const,
      label: "Other",
      icon: "bx-file",
    },
  ];

  const documents = profileForm.values.documents?.items || [];

  const handleFormChange = (field: string, value: any) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddDocument = () => {
    if (uploadForm.file && uploadForm.documentName && uploadForm.documentType) {
      const newDocument: DocumentFormValues = {
        id: `doc-${Date.now()}`,
        name: uploadForm.documentName,
        type: uploadForm.documentType,
        file: uploadForm.file,
        filename: uploadForm.file.name,
        uploadedAt: new Date(),
        status: "pending",
      };

      console.log("Adding new document:", newDocument);
      console.log("Current documents:", documents);
      console.log("Form is dirty before update:", profileForm.isDirty());

      // Add document to form values
      const currentDocuments = documents;
      const updatedDocuments = [...currentDocuments, newDocument];

      console.log("Updated documents:", updatedDocuments);

      // Update the entire form values to ensure change detection
      const currentFormValues = profileForm.values;
      const newFormValues = {
        ...currentFormValues,
        documents: {
          ...currentFormValues.documents,
          items: updatedDocuments,
        },
      };

      // Update form with new values
      profileForm.setValues(newFormValues);

      // Also call the nested change handler for consistency
      handleNestedChange("documents", "items", updatedDocuments);

      // Force the form to recognize it's dirty
      profileForm.setFieldValue("documents.items", updatedDocuments);

      console.log("Form is dirty after update:", profileForm.isDirty());
      console.log(
        "Form values after update:",
        profileForm.values.documents?.items
      );

      // Reset form
      setUploadForm({
        documentName: "",
        documentType: "other",
        file: null,
      });
    } else {
      console.log("Form validation failed:", {
        file: !!uploadForm.file,
        documentName: !!uploadForm.documentName,
        documentType: !!uploadForm.documentType,
      });
    }
  };

  const handleDownload = (document: DocumentFormValues) => {
    if (document.url) {
      // Download document from server URL
      window.open(document.url, "_blank");
    }
  };

  const handleRemove = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
    handleNestedChange("documents", "items", updatedDocuments);
  };

  const getDocumentDisplayInfo = (document: DocumentFormValues) => {
    const docType = documentTypes.find((type) => type.value === document.type);
    const subtitle = document.filename
      ? `${document.filename} • ${
          document.uploadedAt
            ? new Date(document.uploadedAt).toLocaleDateString()
            : "Recently uploaded"
        }`
      : document.expiryDate
      ? `Expires: ${new Date(document.expiryDate).toLocaleDateString()}`
      : "No additional info";

    return {
      title: document.name,
      subtitle,
      icon: docType?.icon || "bx-file",
      typeLabel: docType?.label || document.type,
    };
  };

  const documentColumns: TableColumn<DocumentFormValues>[] = [
    {
      title: "Document",
      dataIndex: "name",
      render: (name: string, record: DocumentFormValues) => {
        const displayInfo = getDocumentDisplayInfo(record);
        return (
          <ListItem
            icon={`bx ${displayInfo.icon}`}
            title={displayInfo.title}
            subtitle={displayInfo.subtitle}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (
        type: DocumentFormValues["type"],
        record: DocumentFormValues
      ) => {
        const displayInfo = getDocumentDisplayInfo(record);
        return displayInfo.typeLabel;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: DocumentFormValues["status"]) => {
        const statusConfig = {
          valid: { className: "completed", label: "Valid" },
          expiring: { className: "warning", label: "Expiring Soon" },
          expired: { className: "danger", label: "Expired" },
          uploaded: { className: "info", label: "Uploaded" },
          pending: { className: "pending", label: "Pending" },
        };
        const config = statusConfig[status || "pending"];
        return (
          <span className={`status-badge ${config.className ?? ""}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id: string, record: DocumentFormValues) => (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {record.url && (
            <Button
              className="btn btn-sm btn-outline-primary"
              label="Download"
              icon={<i className="bx bx-download"></i>}
              onClick={() => handleDownload(record)}
            />
          )}
          <Button
            className="btn btn-sm btn-outline-danger"
            label="Remove"
            icon={<i className="bx bx-trash"></i>}
            onClick={() => handleRemove(id || "")}
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
              options={documentTypes.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
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
