import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";
import {
  IdentificationFormValues,
  ProfileFormValues,
} from "@validations/profile.validations";

interface IdentificationTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleNestedChange: (section: string, field: string, value: any) => void;
  idTypeOptions: Array<{ value: string; label: string }>;
}

export const IdentificationTab: React.FC<IdentificationTabProps> = ({
  profileForm,
  handleNestedChange,
  idTypeOptions,
}) => {
  const identification = profileForm.values
    .identification as IdentificationFormValues;
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
              required
              value={identification.idType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange("identification", "idType", e.target.value)
              }
              options={idTypeOptions}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="idNumber" label="ID Number" />
            <FormInput
              id="idNumber"
              required
              name="idNumber"
              type="text"
              value={identification.idNumber || ""}
              onChange={(e) =>
                handleNestedChange("identification", "idNumber", e.target.value)
              }
              hasError={!!(profileForm.errors as any).identification?.idNumber}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="issueDate" label="Issue Date" />
            <FormInput
              id="issueDate"
              required
              name="issueDate"
              type="date"
              value={
                identification.issueDate
                  ? identification.issueDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "identification",
                  "issueDate",
                  new Date(e.target.value)
                )
              }
              hasError={!!(profileForm.errors as any).identification?.issueDate}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="expiryDate" label="Expiry Date" />
            <FormInput
              id="expiryDate"
              name="expiryDate"
              required
              type="date"
              value={
                identification.expiryDate
                  ? identification.expiryDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "identification",
                  "expiryDate",
                  new Date(e.target.value)
                )
              }
              hasError={
                !!(profileForm.errors as any).identification?.expiryDate
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
              required
              value={identification.authority || ""}
              onChange={(e) =>
                handleNestedChange(
                  "identification",
                  "authority",
                  e.target.value
                )
              }
              hasError={!!(profileForm.errors as any).identification?.authority}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="issuingState" label="Issuing State" />
            <FormInput
              id="issuingState"
              name="issuingState"
              required
              type="text"
              value={identification.issuingState || ""}
              onChange={(e) =>
                handleNestedChange(
                  "identification",
                  "issuingState",
                  e.target.value
                )
              }
              hasError={
                !!(profileForm.errors as any).identification?.issuingState
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
