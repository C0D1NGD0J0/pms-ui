"use client";
import React, { useState } from "react";
import { ListItem } from "@components/ListItem";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { TableColumn, Table } from "@components/Table";
import { useNotification } from "@hooks/useNotification";
import { PreviewModal } from "@components/DocumentPreview";
import { FileUploader, FileItem } from "@components/FileUploader";
import { PropertyFormValues } from "@interfaces/property.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  FormInput,
  FormLabel,
  FormField,
  Select,
  Button,
} from "@components/FormElements";

interface Props {
  permission: ReturnType<typeof useUnifiedPermissions>;
  propertyForm: UseFormReturnType<PropertyFormValues>;
  documentTypeOptions: {
    value: "deed" | "tax" | "insurance" | "inspection" | "other" | "lease";
    label: string;
  }[];
}

export function DocumentsTab({
  propertyForm: form,
  permission,
  documentTypeOptions,
}: Props) {
  const [currentDocType, setCurrentDocType] = useState<
    "deed" | "tax" | "insurance" | "inspection" | "other" | "lease" | undefined
  >(undefined);
  const [currentDocDescription, setCurrentDocDescription] = useState("");
  const [showDocumentFields, setShowDocumentFields] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    file?: any;
    title?: string;
  }>({ isOpen: false });
  const { message } = useNotification();

  const handleFileAdded = (file: FileItem) => {
    const fileName = file.fileName || file.file?.name || "";

    if (isImage(fileName)) {
      const currentImages = [...(form.values.images || [])];
      form.setFieldValue("images", [
        ...currentImages,
        {
          fileName: file.fileName,
          fileSize: file.fileSize,
          file: file.file,
          url: file.url,
          isExternal: file.isExternal,
          status: "pending",
        },
      ]);
      setCurrentDocType(undefined);
      setCurrentDocDescription("");
      setShowDocumentFields(false);
    } else if (isPdf(fileName)) {
      if (!currentDocType) {
        message.warning("Please select a document type for PDF files");
        return;
      }

      const currentDocs = [...form.values.documents];
      form.setFieldValue("documents", [
        ...currentDocs,
        {
          documentType: currentDocType,
          description: currentDocDescription,
          externalUrl: file.externalUrl || "",
          file: file.file,
          status: "pending",
        },
      ]);

      setCurrentDocType(undefined);
      setCurrentDocDescription("");
      setShowDocumentFields(false);
    } else {
      message.error("Only images and PDF files are supported");
    }
  };

  const handleRemoveFile = (
    transformedFile: any,
    type: "image" | "document"
  ) => {
    if (type === "image") {
      const currentImages = [...(form.values.images || [])];
      const index = currentImages.findIndex(
        (img) =>
          (img.fileName === transformedFile.fileName ||
            img.filename === transformedFile.filename) &&
          (img.fileSize === transformedFile.fileSize ||
            img.size === transformedFile.size)
      );
      if (index > -1) {
        currentImages[index] = { ...currentImages[index], status: "deleted" };
        form.setFieldValue("images", currentImages);
      }
    } else {
      const currentDocs = [...form.values.documents];
      const index = currentDocs.findIndex(
        (doc) =>
          doc.file === transformedFile.file ||
          (doc.file?.name === transformedFile.file?.name &&
            doc.documentType === transformedFile.documentType)
      );
      if (index > -1) {
        currentDocs[index] = { ...currentDocs[index], status: "deleted" };
        form.setFieldValue("documents", currentDocs);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileStatus = (record: any) => {
    switch (record.status) {
      case "deleted":
        return {
          status: "deleted",
          label: "Deleted",
          className: "status-deleted",
        };
      case "active":
        return {
          status: "active",
          label: "Active",
          className: "status-active",
        };
      case "pending":
        return {
          status: "pending",
          label: "Pending",
          className: "status-pending",
        };
      case "processing":
        return {
          status: "processing",
          label: "Processing",
          className: "status-processing",
        };
      case "inactive":
        return {
          status: "inactive",
          label: "Inactive",
          className: "status-inactive",
        };
      default:
        if (record._id || record.id) {
          return {
            status: "active",
            label: "Active",
            className: "status-active",
          };
        }
        return {
          status: "pending",
          label: "Pending",
          className: "status-pending",
        };
    }
  };

  const handleViewFile = (file: any, title: string) => {
    setPreviewModal({ isOpen: true, file, title });
  };

  const getAllFiles = () => {
    const images = (form.values.images || []).map((img) => ({
      ...img,
      type: "image" as const,
      displayName: img.fileName || img.filename,
      fileSize: img.fileSize || img.size,
    }));

    const documents = form.values.documents.map((doc) => ({
      ...doc,
      type: "document" as const,
      displayName: doc.file?.name || "Document",
      fileSize: doc.file?.size || 0,
    }));

    return [...images, ...documents];
  };

  const unifiedColumns: TableColumn<any>[] = [
    {
      title: "File",
      dataIndex: "displayName",
      render: (displayName: string, record: any) => {
        const isImg = record.type === "image";
        const isDisabled = ["deleted", "processing", "inactive"].includes(
          record.status
        );
        const isDeleted = record.status === "deleted";
        const docType = isImg
          ? null
          : documentTypeOptions.find((t) => t.value === record.documentType);

        return (
          <div
            style={{
              opacity: isDisabled ? 0.5 : 1,
              textDecoration: isDeleted ? "line-through" : "none",
            }}
          >
            <ListItem
              icon={isImg ? "bx bx-image" : "bx bx-file"}
              title={displayName}
              subtitle={
                isImg
                  ? `${formatFileSize(record.fileSize)}`
                  : `${
                      docType?.label || record.documentType
                    } • ${formatFileSize(record.fileSize)}`
              }
            />
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string, record: any) => {
        const isDisabled = ["deleted", "processing", "inactive"].includes(
          record.status
        );
        const isDeleted = record.status === "deleted";
        const typeLabel =
          type === "image"
            ? "Image"
            : documentTypeOptions.find((t) => t.value === record.documentType)
                ?.label || record.documentType;

        return (
          <span
            style={{
              opacity: isDisabled ? 0.5 : 1,
              textDecoration: isDeleted ? "line-through" : "none",
            }}
          >
            {typeLabel}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: any, record: any) => {
        const { label, className } = getFileStatus(record);
        return <span className={`status-badge ${className}`}>{label}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (value: any, record: any) => {
        const isDisabled = ["deleted"].includes(record.status);
        const canDelete = permission.isManagerOrAbove;

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              className="btn-sm btn-outline-primary"
              label=""
              icon={<i className="bx bx-show"></i>}
              onClick={() => handleViewFile(record, record.displayName)}
              disabled={isDisabled}
            />
            {canDelete && (
              <Button
                className="btn-sm btn-outline-danger"
                label=""
                icon={<i className="bx bx-trash"></i>}
                onClick={() => handleRemoveFile(record, record.type)}
              />
            )}
          </div>
        );
      },
    },
  ];

  const documentTypeField = (
    <div className="form-fields">
      <FormField>
        <FormLabel htmlFor="documentType" label="Document Type" required />
        <Select
          id="documentType"
          name="documentType"
          value={currentDocType || ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value as
              | "deed"
              | "tax"
              | "insurance"
              | "inspection"
              | "other"
              | "lease"
              | undefined;
            setCurrentDocType(value);
          }}
          options={documentTypeOptions}
          placeholder="Select document type"
        />
      </FormField>
    </div>
  );

  const descriptionField = (
    <div className="form-fields">
      <FormField>
        <FormLabel htmlFor="description" label="Document Description" />
        <FormInput
          id="description"
          name="description"
          type="text"
          value={currentDocDescription}
          onChange={(e) => setCurrentDocDescription(e.target.value)}
          placeholder="Enter a brief description"
          hasError={false}
        />
      </FormField>
    </div>
  );

  const isImage = (filename: string) => {
    return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  };

  const isPdf = (filename: string) => {
    return filename.toLowerCase().endsWith(".pdf");
  };

  const getFileType = (filename: string): "image" | "pdf" => {
    if (isImage(filename)) return "image";
    if (isPdf(filename)) return "pdf";
    return "pdf";
  };

  const getRenderMode = (filename: string): "image" | "iframe" => {
    if (isImage(filename)) return "image";
    return "iframe";
  };

  const handleInputMethodChange = (method: any) => {
    setShowDocumentFields(method !== null);
  };

  return (
    <>
      <FormSection
        title="Photos & Documents"
        description="Upload property images and PDF documents"
      >
        <FileUploader
          fileType="document"
          onFileAdded={handleFileAdded}
          acceptedFileTypes="image/*,.pdf"
          uploadInstructions="Upload images and PDF documents. Document type is required for PDFs."
          documentTypeField={showDocumentFields ? documentTypeField : undefined}
          descriptionField={showDocumentFields ? descriptionField : undefined}
          onInputMethodChange={handleInputMethodChange}
        />

        {getAllFiles().length > 0 && (
          <div className="mt-4">
            <Table
              columns={unifiedColumns}
              dataSource={getAllFiles()}
              rowKey="uploadedAt"
              pagination={false}
            />
          </div>
        )}
      </FormSection>

      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false })}
        title={previewModal.title || "File Preview"}
        previewProps={{
          type: getFileType(previewModal.title || ""),
          url:
            previewModal.file instanceof File
              ? URL.createObjectURL(previewModal.file)
              : previewModal.file?.file instanceof File
              ? URL.createObjectURL(previewModal.file.file)
              : previewModal.file?.url,
          renderMode: getRenderMode(previewModal.title || ""),
        }}
      />
    </>
  );
}
