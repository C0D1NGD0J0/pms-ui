"use client";
import React, { useState } from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { FileUploader, FileItem } from "@components/FileUploader";
import { PropertyFormValues } from "@interfaces/property.interface";
import {
  FormInput,
  FormLabel,
  FormField,
  Select,
} from "@components/FormElements";

interface Props {
  propertyForm: UseFormReturnType<PropertyFormValues>;
  documentTypeOptions: {
    value: "deed" | "tax" | "insurance" | "inspection" | "other" | "lease";
    label: string;
  }[];
}

export function DocumentsTab({
  propertyForm: form,
  documentTypeOptions,
}: Props) {
  const [currentDocType, setCurrentDocType] = useState<
    "deed" | "tax" | "insurance" | "inspection" | "other" | "lease" | undefined
  >(undefined);
  const [currentDocDescription, setCurrentDocDescription] = useState("");

  const handleRemoveImage = (index: number) => {
    const currentImages = [...form.values.propertyImages];
    currentImages.splice(index, 1);
    form.setFieldValue("propertyImages", currentImages);
  };

  const handleRemoveDocument = (index: number) => {
    const currentDocs = [...form.values.documents];
    currentDocs.splice(index, 1);
    form.setFieldValue("documents", currentDocs);
  };

  const handleImageAdded = (file: FileItem) => {
    const currentImages = [...form.values.propertyImages];
    form.setFieldValue("propertyImages", [
      ...currentImages,
      {
        fileName: file.fileName,
        fileSize: file.fileSize,
        file: file.file,
        url: file.url,
        isExternal: file.isExternal,
      },
    ]);
  };

  const handleDocumentAdded = (file: FileItem) => {
    if (!currentDocType) {
      alert("Please select a document type first");
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
      },
    ]);

    // Reset form values
    setCurrentDocType(undefined);
    setCurrentDocDescription("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const documentTypeField = (
    <div className="form-fields">
      <FormField>
        <FormLabel htmlFor="documentType" label="Document Type" required />
        <Select
          id="documentType"
          name="documentType"
          value={currentDocType || ""}
          onChange={(e) => {
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

  // Document description field
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

  return (
    <>
      <FormSection
        title="Property Images"
        description="Upload images of the property (max 5 files, 3MB each)"
      >
        <FileUploader
          fileType="image"
          onFileAdded={handleImageAdded}
          acceptedFileTypes="image/*"
          uploadInstructions="Recommended: Upload photos of all rooms, exterior views, and special features"
        />

        <div className="uploaded-files">
          <ul className="file-list">
            {form.values.propertyImages.map((image, index) => (
              <li key={`img-${index}`} className="file-item">
                <div className="file-info">
                  <i className="bx bx-image"></i>
                  <span className="file-name">{image.fileName}</span>
                  <span className="file-size">
                    ({formatFileSize(image.fileSize)})
                  </span>
                </div>
                <button
                  className="remove-file"
                  onClick={() => handleRemoveImage(index)}
                >
                  <i className="bx bx-x"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </FormSection>

      <FormSection
        title="Property Documents"
        description="Upload property-related documents (deeds, certificates, etc.)"
      >
        <FileUploader
          fileType="document"
          onFileAdded={handleDocumentAdded}
          acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx"
          documentTypeField={documentTypeField}
          descriptionField={descriptionField}
        />

        {form.values.documents.length > 0 && (
          <div className="uploaded-documents">
            <h4>Added Documents</h4>
            <ul className="document-list">
              {form.values.documents.map((doc, index) => (
                <li key={`doc-${index}`} className="document-item">
                  <div className="document-info">
                    <div className="document-type">
                      <i className="bx bx-file"></i>
                      <span>
                        {documentTypeOptions.find(
                          (t) => t.value === doc.documentType
                        )?.label || doc.documentType}
                      </span>
                    </div>
                    <div className="document-details">
                      {doc.externalUrl && (
                        <span className="document-url">
                          <i className="bx bx-link"></i> {doc.externalUrl}
                        </span>
                      )}
                      {doc.file && (
                        <span className="document-filename">
                          {doc.file.name} ({formatFileSize(doc.file.size)})
                        </span>
                      )}
                      {doc.description && (
                        <p className="document-description">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    className="remove-document"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </FormSection>
    </>
  );
}
