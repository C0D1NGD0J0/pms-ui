import React from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";

interface IdentificationTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
}

export const IdentificationTab: React.FC<IdentificationTabProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="Identity Documents"
        description="Manage your identification information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="idType" label="ID Type" />
            <Select
              id="idType"
              name="idType"
              value={formData.identification.idType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange("identification", "idType", e.target.value)
              }
              options={[
                { value: "passport", label: "Passport" },
                { value: "drivers-license", label: "Driver's License" },
                { value: "national-id", label: "National ID" },
                {
                  value: "corporation-license",
                  label: "Corporation License",
                },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="idNumber" label="ID Number" />
            <FormInput
              id="idNumber"
              name="idNumber"
              type="text"
              value={formData.identification.idNumber}
              onChange={(e) =>
                handleInputChange("identification", "idNumber", e.target.value)
              }
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
              value={
                formData.identification.issueDate.toISOString().split("T")[0]
              }
              onChange={(e) =>
                handleInputChange(
                  "identification",
                  "issueDate",
                  new Date(e.target.value)
                )
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="expiryDate" label="Expiry Date" />
            <FormInput
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={
                formData.identification.expiryDate.toISOString().split("T")[0]
              }
              onChange={(e) =>
                handleInputChange(
                  "identification",
                  "expiryDate",
                  new Date(e.target.value)
                )
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="authority" label="Issuing Authority" />
            <FormInput
              id="authority"
              name="authority"
              type="text"
              value={formData.identification.authority}
              onChange={(e) =>
                handleInputChange("identification", "authority", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="issuingState" label="Issuing State" />
            <FormInput
              id="issuingState"
              name="issuingState"
              type="text"
              value={formData.identification.issuingState}
              onChange={(e) =>
                handleInputChange(
                  "identification",
                  "issuingState",
                  e.target.value
                )
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};