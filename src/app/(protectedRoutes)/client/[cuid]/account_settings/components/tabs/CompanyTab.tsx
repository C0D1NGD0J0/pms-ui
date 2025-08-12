"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import { UpdateClientDetailsFormData } from "@src/validations/client.validations";

interface CompanyTabProps {
  inEditMode: boolean;
  clientInfo: IClient;
  clientForm?: UseFormReturnType<UpdateClientDetailsFormData>;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({
  clientInfo,
  clientForm,
}) => {
  const isEditMode = !!clientForm;
  const form = clientForm;
  // Get current values from form or fallback to clientInfo
  const currentCompanyProfile = isEditMode
    ? form?.values.companyProfile || clientInfo.companyProfile
    : clientInfo.companyProfile;

  const handleCompanyChange = (field: string, value: string) => {
    if (form) {
      if (field.includes("contactInfo.")) {
        const contactField = field.split("contactInfo.")[1];
        form.setFieldValue("companyProfile", {
          ...form.values.companyProfile,
          contactInfo: {
            ...form.values.companyProfile?.contactInfo,
            [contactField]: value,
          },
        });
      } else {
        form.setFieldValue("companyProfile", {
          ...form.values.companyProfile,
          [field]: value,
        });
      }
    }
  };
  return (
    <div className="resource-form">
      <FormSection
        title="Company Profile"
        description="Legal entity and business information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="legalEntityName" label="Legal Entity Name" />
            <FormInput
              id="legalEntityName"
              name="companyProfile.legalEntityName"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("legalEntityName", e.target.value)
                  : void 0
              }
              placeholder="Enter legal company name"
              value={currentCompanyProfile?.legalEntityName || ""}
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="tradingName" label="Trading Name" />
            <FormInput
              id="tradingName"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("tradingName", e.target.value)
                  : void 0
              }
              placeholder="Enter trading name"
              name="companyProfile.tradingName"
              value={currentCompanyProfile?.tradingName || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyEmail" label="Company Email" />
            <FormInput
              type="email"
              id="companyEmail"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("companyEmail", e.target.value)
                  : void 0
              }
              placeholder="Enter company email"
              name="companyProfile.companyEmail"
              value={currentCompanyProfile?.companyEmail || ""}
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="companyPhone" label="Company Phone" />
            <FormInput
              type="tel"
              id="companyPhone"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("companyPhone", e.target.value)
                  : void 0
              }
              placeholder="Enter company phone"
              name="companyProfile.companyPhone"
              value={currentCompanyProfile?.companyPhone || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="registrationNumber"
              label="Registration Number"
            />
            <FormInput
              id="registrationNumber"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("registrationNumber", e.target.value)
                  : void 0
              }
              placeholder="Enter registration number"
              name="companyProfile.registrationNumber"
              value={currentCompanyProfile?.registrationNumber || ""}
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="website" label="Website" />
            <FormInput
              type="url"
              id="website"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("website", e.target.value)
                  : void 0
              }
              name="companyProfile.website"
              placeholder="Enter website URL"
              value={currentCompanyProfile?.website || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Contact Information"
        description="Primary contact details for communication"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactPerson" label="Contact Person" />
            <FormInput
              id="contactPerson"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange(
                      "contactInfo.contactPerson",
                      e.target.value
                    )
                  : void 0
              }
              placeholder="Enter contact person name"
              name="companyProfile.contactInfo.contactPerson"
              value={currentCompanyProfile?.contactInfo?.contactPerson || ""}
              disabled={!isEditMode}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="contactEmail" label="Contact Email" />
            <FormInput
              type="email"
              id="contactEmail"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange("contactInfo.email", e.target.value)
                  : void 0
              }
              placeholder="Enter contact email"
              name="companyProfile.contactInfo.email"
              value={currentCompanyProfile?.contactInfo?.email || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactPhone" label="Contact Phone" />
            <FormInput
              type="tel"
              id="contactPhone"
              onChange={(e) =>
                isEditMode
                  ? handleCompanyChange(
                      "contactInfo.phoneNumber",
                      e.target.value
                    )
                  : void 0
              }
              placeholder="Enter contact phone"
              name="companyProfile.contactInfo.phoneNumber"
              value={currentCompanyProfile?.contactInfo?.phoneNumber || ""}
              disabled={!isEditMode}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
