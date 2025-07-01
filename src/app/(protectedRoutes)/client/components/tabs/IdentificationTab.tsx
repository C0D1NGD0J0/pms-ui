"use client";

import React, { useState } from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Select,
} from "@components/FormElements";

export const IdentificationTab: React.FC = () => {
  const [formData, setFormData] = useState({
    idType: "passport",
    idNumber: "P12345678",
    issueDate: "2020-06-15",
    expiryDate: "2030-06-14",
    authority: "Department of State",
    issuingState: "United States",
    lastVerifiedAt: "2024-03-01T10:30",
    retentionExpiryDate: "2031-03-01",
    dataProcessingConsent: true,
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
              name="idType"
              value={formData.idType}
              onChange={(e) => handleInputChange("idType", e.target.value)}
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
              name="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              placeholder="Enter ID number"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="issueDate" label="Issue Date" />
            <FormInput
              id="issueDate"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleInputChange("issueDate", e.target.value)}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="expiryDate" label="Expiry Date" />
            <FormInput
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="authority" label="Issuing Authority" />
            <FormInput
              id="authority"
              name="authority"
              value={formData.authority}
              onChange={(e) => handleInputChange("authority", e.target.value)}
              placeholder="Enter issuing authority"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="issuingState" label="Issuing State/Country" />
            <FormInput
              id="issuingState"
              name="issuingState"
              value={formData.issuingState}
              onChange={(e) =>
                handleInputChange("issuingState", e.target.value)
              }
              placeholder="Enter issuing state or country"
            />
          </FormField>
        </div>

        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="dataProcessingConsent"
              name="dataProcessingConsent"
              checked={formData.dataProcessingConsent}
              onChange={(e) =>
                handleInputChange(
                  "dataProcessingConsent",
                  e.target.checked.toString()
                )
              }
              label="Data Processing Consent"
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
