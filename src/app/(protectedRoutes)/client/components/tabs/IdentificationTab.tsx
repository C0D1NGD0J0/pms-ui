"use client";

import React, { ChangeEvent, useState } from "react";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Select,
} from "@components/FormElements";

interface IdentificationTabProps {
  clientInfo: IClient;
}

export const IdentificationTab: React.FC<IdentificationTabProps> = ({
  clientInfo,
}) => {
  const [formData, setFormData] = useState({
    issueDate: clientInfo.identification.issueDate
      ? typeof clientInfo.identification.issueDate === "string"
        ? clientInfo.identification.issueDate.split("T")[0]
        : clientInfo.identification.issueDate.toISOString().split("T")[0]
      : "",
    expiryDate: clientInfo.identification.expiryDate
      ? typeof clientInfo.identification.expiryDate === "string"
        ? clientInfo.identification.expiryDate.split("T")[0]
        : clientInfo.identification.expiryDate.toISOString().split("T")[0]
      : "",
    dataProcessingConsent: clientInfo.identification.dataProcessingConsent,
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              value={clientInfo.identification.idType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => void e}
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
              onChange={(e) => void e}
              placeholder="Enter ID number"
              name="identification.idNumber"
              value={clientInfo.identification.idNumber}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="issueDate" label="Issue Date" />
            <FormInput
              type="date"
              id="issueDate"
              value={formData.issueDate}
              name="identification.issueDate"
              onChange={(e) => handleInputChange("issueDate", e.target.value)}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="expiryDate" label="Expiry Date" />
            <FormInput
              type="date"
              id="expiryDate"
              onChange={(e) => void e}
              value={formData.expiryDate}
              name="identification.expiryDate"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="authority" label="Issuing Authority" />
            <FormInput
              id="authority"
              onChange={(e) => void e}
              name="identification.authority"
              placeholder="Enter issuing authority"
              value={clientInfo.identification.authority}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="issuingState" label="Issuing State/Country" />
            <FormInput
              id="issuingState"
              onChange={(e) => void e}
              name="identification.issuingState"
              placeholder="Enter issuing state or country"
              value={clientInfo.identification.issuingState}
            />
          </FormField>
        </div>

        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="dataProcessingConsent"
              name="identificationdataProcessingConsent"
              checked={clientInfo.identification.dataProcessingConsent}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  dataProcessingConsent: e.target.checked,
                }))
              }
              label="Data Processing Consent"
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
