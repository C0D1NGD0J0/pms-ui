"use client";
import React from "react";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { FormField, FormInput, FormLabel } from "@components/FormElements";

interface CompanyTabProps {
  clientInfo: IClient;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({ clientInfo }) => {
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
              onChange={(e) => void e}
              placeholder="Enter legal company name"
              value={clientInfo.companyProfile?.legalEntityName || ""}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="tradingName" label="Trading Name" />
            <FormInput
              id="tradingName"
              onChange={(e) => void e}
              placeholder="Enter trading name"
              name="companyProfile.tradingName"
              value={clientInfo.companyProfile.tradingName}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyEmail" label="Company Email" />
            <FormInput
              type="email"
              id="companyEmail"
              onChange={(e) => void e}
              placeholder="Enter company email"
              name="companyProfile.companyEmail"
              value={clientInfo.companyProfile.companyEmail}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="companyPhone" label="Company Phone" />
            <FormInput
              type="tel"
              id="companyPhone"
              onChange={(e) => void e}
              placeholder="Enter company phone"
              name="companyProfile.companyPhone"
              value={clientInfo.companyProfile.companyPhone}
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
              onChange={(e) => void e}
              placeholder="Enter registration number"
              name="companyProfile.registrationNumber"
              value={clientInfo.companyProfile.registrationNumber}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="website" label="Website" />
            <FormInput
              type="url"
              id="website"
              onChange={(e) => void e}
              name="companyProfile.website"
              placeholder="Enter website URL"
              value={clientInfo.companyProfile.website}
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
              onChange={(e) => void e}
              placeholder="Enter contact person name"
              name="companyProfile.contactInfo.contactPerson"
              value={clientInfo.companyProfile.contactInfo.contactPerson}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="contactEmail" label="Contact Email" />
            <FormInput
              type="email"
              id="contactEmail"
              onChange={(e) => void e}
              placeholder="Enter contact email"
              name="clientInfo.companyProfile.contactInfo.email"
              value={clientInfo.companyProfile.contactInfo.email}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactPhone" label="Contact Phone" />
            <FormInput
              type="tel"
              id="contactPhone"
              onChange={(e) => void e}
              placeholder="Enter contact phone"
              name="clientInfo.companyProfile.contactInfo.phoneNumber"
              value={clientInfo.companyProfile.contactInfo.phoneNumber}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
