"use client";

import React, { ChangeEvent } from "react";
import { UseFormReturnType } from "@mantine/form";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { UpdateClientDetailsFormData } from "@src/validations/client.validations";
import {
  FileInput,
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Select,
} from "@components/FormElements";

interface IdentificationTabProps {
  clientInfo: IClient;
  clientForm?: UseFormReturnType<UpdateClientDetailsFormData>;
}

export const IdentificationTab: React.FC<IdentificationTabProps> = ({
  clientInfo,
  clientForm,
}) => {
  const form = clientForm;
  const isEditMode = !!clientForm;

  // Helper to format dates for display
  const formatDateForInput = (date: string | Date | null) => {
    if (!date) return "";
    if (typeof date === "string") {
      return date.split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  // Get current values from form or fallback to clientInfo
  const currentIdentification = isEditMode
    ? form?.values.identification || clientInfo.identification
    : clientInfo.identification;

  const handleIdentificationChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    if (form) {
      form.setFieldValue("identification", {
        ...form.values.identification,
        [field]: value,
      });
    }
  };

  return (
    <div className="resource-form">
      <FormSection
        title="Identity Verification"
        description="Legal identification documents and verification status"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="idType" label="ID Type" />
            <Select
              id="idType"
              name="identification.idType"
              value={currentIdentification.idType || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                isEditMode
                  ? handleIdentificationChange("idType", e.target.value)
                  : void 0
              }
              disabled={!isEditMode}
              options={[
                { value: "", label: "Select ID type" },
                { value: "passport", label: "Passport" },
                { value: "driverLicense", label: "Driver License" },
                { value: "nationalId", label: "National ID" },
                {
                  value: "businessRegistration",
                  label: "Business Registration",
                },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="idNumber" label="ID Number" />
            <FormInput
              id="idNumber"
              onChange={(e) =>
                isEditMode
                  ? handleIdentificationChange("idNumber", e.target.value)
                  : void 0
              }
              placeholder="Enter ID number"
              name="identification.idNumber"
              value={currentIdentification.idNumber || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="issueDate" label="Issue Date" />
            <FormInput
              type="date"
              id="issueDate"
              value={formatDateForInput(
                currentIdentification.issueDate || null
              )}
              name="identification.issueDate"
              onChange={(e) =>
                isEditMode
                  ? handleIdentificationChange("issueDate", e.target.value)
                  : void 0
              }
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="expiryDate" label="Expiry Date" />
            <FormInput
              type="date"
              id="expiryDate"
              onChange={(e) =>
                isEditMode
                  ? handleIdentificationChange("expiryDate", e.target.value)
                  : void 0
              }
              value={formatDateForInput(
                currentIdentification.expiryDate || null
              )}
              name="identification.expiryDate"
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="authority" label="Issuing Authority" />
            <FormInput
              id="authority"
              onChange={(e) =>
                isEditMode
                  ? handleIdentificationChange("authority", e.target.value)
                  : void 0
              }
              name="identification.authority"
              placeholder="Enter issuing authority"
              value={currentIdentification.authority}
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="issuingState" label="Issuing State/Country" />
            <FormInput
              id="issuingState"
              onChange={(e) =>
                isEditMode
                  ? handleIdentificationChange("issuingState", e.target.value)
                  : void 0
              }
              name="identification.issuingState"
              placeholder="Enter issuing state or country"
              value={currentIdentification.issuingState}
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="idimage" label="ID Document Image" />
            <FileInput
              accept="image/*,.pdf"
              onChange={(file) =>
                isEditMode
                  ? handleIdentificationChange("idimage", file)
                  : void 0
              }
              instructionText="Upload a clear photo or scan of your ID document (JPG, PNG, PDF)"
            />
          </FormField>
        </div>

        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="dataProcessingConsent"
              name="identification.dataProcessingConsent"
              checked={currentIdentification.dataProcessingConsent || false}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                isEditMode
                  ? handleIdentificationChange(
                      "dataProcessingConsent",
                      e.target.checked
                    )
                  : void 0
              }
              label="Data Processing Consent"
              disabled={!isEditMode}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
