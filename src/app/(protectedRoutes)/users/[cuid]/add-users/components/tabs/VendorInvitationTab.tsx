"use client";
import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import { useNotification } from "@hooks/useNotification";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import {
  FormInput,
  FormLabel,
  FormField,
  FileInput,
  Textarea,
  Select,
} from "@components/FormElements";

interface VendorInvitationTabProps {
  formData: IInvitationFormData;
  messageCount: number;
  onFieldChange: (field: string, value: any) => void;
  onMessageCountChange: (count: number) => void;
}

export const VendorInvitationTab: React.FC<VendorInvitationTabProps> = ({
  formData,
  messageCount,
  onFieldChange,
  onMessageCountChange,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const { message } = useNotification();

  const handleFileUpload = (file: File | null, index: number) => {
    if (file) {
      const newFiles = [...uploadedFiles];
      const currentFile = newFiles[index];

      // Calculate new total size
      const currentFileSize = currentFile ? currentFile.size : 0;
      const newTotalSize = totalFileSize - currentFileSize + file.size;

      // Check if total size exceeds 10MB
      if (newTotalSize > 10 * 1024 * 1024) {
        message.warning("Total file size cannot exceed 10MB");
        return;
      }

      newFiles[index] = file;
      setUploadedFiles(newFiles);
      setTotalFileSize(newTotalSize);

      // Update form data
      onFieldChange(`metadata.attachments.${index}`, {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    } else {
      // Remove file
      const newFiles = [...uploadedFiles];
      const removedFile = newFiles[index];
      if (removedFile) {
        setTotalFileSize(totalFileSize - removedFile.size);
      }
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);

      // Update form data
      onFieldChange(`metadata.attachments.${index}`, null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <FormSection
        title="Company Information"
        description="Basic vendor company details (optional)"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyName" label="Company Name" />
            <FormInput
              id="companyName"
              type="text"
              name="companyName"
              placeholder="Enter company name (optional)"
              value={formData.vendorInfo?.companyName || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.companyName", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="businessType" label="Business Type" />
            <Select
              id="businessType"
              name="businessType"
              value={formData.vendorInfo?.businessType || ""}
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) =>
                onFieldChange(
                  "vendorInfo.businessType",
                  typeof value === "string" ? value : value.target.value
                )
              }
              options={[
                { value: "", label: "Select business type" },
                { value: "llc", label: "LLC" },
                { value: "corporation", label: "Corporation" },
                { value: "partnership", label: "Partnership" },
                { value: "sole-proprietorship", label: "Sole Proprietorship" },
                { value: "other", label: "Other" },
              ]}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Service Category"
        description="What type of service is this vendor being invited for?"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="primaryService" label="Primary Service" />
            <Select
              id="primaryService"
              name="primaryService"
              value={formData.vendorInfo?.primaryService || ""}
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) =>
                onFieldChange(
                  "vendorInfo.primaryService",
                  typeof value === "string" ? value : value.target.value
                )
              }
              options={[
                { value: "", label: "Select primary service" },
                { value: "applianceRepair", label: "Appliance Repair" },
                { value: "carpentry", label: "Carpentry" },
                { value: "cleaning", label: "Cleaning" },
                { value: "electrical", label: "Electrical" },
                { value: "hvac", label: "HVAC" },
                { value: "landscaping", label: "Landscaping" },
                { value: "maintenance", label: "General Maintenance" },
                { value: "painting", label: "Painting" },
                { value: "pestControl", label: "Pest Control" },
                { value: "plumbing", label: "Plumbing" },
                { value: "roofing", label: "Roofing" },
                { value: "security", label: "Security" },
                { value: "other", label: "Other" },
              ]}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Primary Contact"
        description="Main contact person for this vendor"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactName" label="Contact Name *" />
            <FormInput
              id="contactName"
              type="text"
              name="contactName"
              placeholder="Enter contact person name"
              value={formData.vendorInfo?.contactPerson?.name || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.contactPerson.name", e.target.value)
              }
              required
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="contactJobTitle" label="Job Title" />
            <FormInput
              id="contactJobTitle"
              type="text"
              name="contactJobTitle"
              placeholder="Enter job title (optional)"
              value={formData.vendorInfo?.contactPerson?.jobTitle || ""}
              onChange={(e) =>
                onFieldChange(
                  "vendorInfo.contactPerson.jobTitle",
                  e.target.value
                )
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactEmail" label="Contact Email *" />
            <FormInput
              id="contactEmail"
              type="email"
              name="contactEmail"
              placeholder="Enter contact email"
              value={formData.vendorInfo?.contactPerson?.email || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.contactPerson.email", e.target.value)
              }
              required
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="contactPhone" label="Contact Phone" />
            <FormInput
              id="contactPhone"
              type="tel"
              name="contactPhone"
              placeholder="Enter contact phone"
              value={formData.vendorInfo?.contactPerson?.phone || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.contactPerson.phone", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Invitation Details"
        description="Additional details for the invitation"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="expectedStartDate"
              label="Expected Start Date"
            />
            <FormInput
              id="expectedStartDate"
              type="date"
              name="expectedStartDate"
              value={
                formData.metadata?.expectedStartDate
                  ? new Date(formData.metadata.expectedStartDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                onFieldChange(
                  "metadata.expectedStartDate",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="inviteMessage" label="Personal Message" />
            <Textarea
              id="inviteMessage"
              name="inviteMessage"
              rows={5}
              placeholder="Add a personal message to the invitation (optional)"
              value={formData.metadata?.inviteMessage || ""}
              onChange={(e: any) => {
                onFieldChange("metadata.inviteMessage", e.target.value);
                onMessageCountChange(e.target.value.length);
              }}
              maxLength={500}
            />
            <small style={{ color: "#7d8da1", fontSize: "12px" }}>
              {messageCount}/500 characters
            </small>
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="File Attachments"
        description="Attach relevant documents to share with the vendor (3 files max, 10MB total)"
      >
        <div className="form-fields">
          <div className="file-upload-section">
            <div className="file-upload-info">
              <p>
                <strong>Files uploaded:</strong> {uploadedFiles.length}/3 |
                <strong> Total size:</strong> {formatFileSize(totalFileSize)}
                /10MB
              </p>
            </div>

            {[0, 1, 2].map((index) => (
              <FormField key={index}>
                <FormLabel
                  htmlFor={`attachment-${index}`}
                  label={`Attachment ${index + 1}`}
                />
                <FileInput
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.csv,.xlsx"
                  instructionText="Upload document (PDF, JPG, PNG, DOC, DOCX, TXT, CSV, XLSX)"
                  onChange={(file) =>
                    handleFileUpload(
                      Array.isArray(file) ? file[0] : file,
                      index
                    )
                  }
                />
                {uploadedFiles[index] && (
                  <div className="uploaded-file-info">
                    <small style={{ color: "#28a745" }}>
                      ✓ {uploadedFiles[index].name} (
                      {formatFileSize(uploadedFiles[index].size)})
                    </small>
                  </div>
                )}
              </FormField>
            ))}
          </div>
        </div>
      </FormSection>
    </>
  );
};
