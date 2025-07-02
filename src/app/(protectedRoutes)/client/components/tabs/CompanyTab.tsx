"use client";

import React, { useState } from "react";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { FormField, FormInput, FormLabel } from "@components/FormElements";

interface CompanyTabProps {
  clientInfo: IClient;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({ clientInfo }) => {
  const [formData, setFormData] = useState({
    legalEntityName: clientInfo.companyProfile.legalEntityName || "",
    tradingName: clientInfo.companyProfile.tradingName || "",
    companyEmail: clientInfo.companyProfile.companyEmail || "",
    companyPhone: clientInfo.companyProfile.companyPhone || "",
    registrationNumber: clientInfo.companyProfile.registrationNumber || "",
    website: clientInfo.companyProfile.website || "",
    contactPerson: clientInfo.companyProfile.contactInfo.contactPerson || "",
    contactEmail: clientInfo.companyProfile.contactInfo.email || "",
    contactPhone: clientInfo.companyProfile.contactInfo.phoneNumber || "",
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
        title="Company Profile"
        description="Legal entity and business information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="legalEntityName" label="Legal Entity Name" />
            <FormInput
              id="legalEntityName"
              name="legalEntityName"
              value={formData.legalEntityName}
              onChange={(e) =>
                handleInputChange("legalEntityName", e.target.value)
              }
              placeholder="Enter legal company name"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="tradingName" label="Trading Name" />
            <FormInput
              id="tradingName"
              name="tradingName"
              value={formData.tradingName}
              onChange={(e) => handleInputChange("tradingName", e.target.value)}
              placeholder="Enter trading name"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyEmail" label="Company Email" />
            <FormInput
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={(e) =>
                handleInputChange("companyEmail", e.target.value)
              }
              placeholder="Enter company email"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="companyPhone" label="Company Phone" />
            <FormInput
              id="companyPhone"
              name="companyPhone"
              type="tel"
              value={formData.companyPhone}
              onChange={(e) =>
                handleInputChange("companyPhone", e.target.value)
              }
              placeholder="Enter company phone"
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
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleInputChange("registrationNumber", e.target.value)
              }
              placeholder="Enter registration number"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="website" label="Website" />
            <FormInput
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="Enter website URL"
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
              name="contactPerson"
              value={formData.contactPerson}
              onChange={(e) =>
                handleInputChange("contactPerson", e.target.value)
              }
              placeholder="Enter contact person name"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="contactEmail" label="Contact Email" />
            <FormInput
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                handleInputChange("contactEmail", e.target.value)
              }
              placeholder="Enter contact email"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="contactPhone" label="Contact Phone" />
            <FormInput
              id="contactPhone"
              name="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                handleInputChange("contactPhone", e.target.value)
              }
              placeholder="Enter contact phone"
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
