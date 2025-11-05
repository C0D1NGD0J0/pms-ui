"use client";
import React from "react";
import { FormSection } from "@components/FormLayout";
import {
  FormInput,
  FormLabel,
  FormField,
  TextArea,
  Select,
} from "@components/FormElements";

import { VendorForm } from "./types";

interface VendorInvitationTabProps {
  form: VendorForm;
  messageCount: number;
  collapsableSections?: boolean;
  onMessageCountChange: (count: number) => void;
}

export const VendorInvitationTab = ({
  form,
  messageCount,
  onMessageCountChange,
  collapsableSections = false,
}: VendorInvitationTabProps) => {
  // Type-safe helpers to access vendor info from either form structure
  const getVendorInfo = () => {
    const values = form.values;
    return (
      (values as { vendorInfo?: Record<string, unknown> }).vendorInfo || {}
    );
  };

  const getVendorField = (field: string): string => {
    const vendorInfo = getVendorInfo();
    const value = vendorInfo[field];
    return typeof value === "string" ? value : "";
  };

  const getContactPerson = () => {
    const vendorInfo = getVendorInfo();
    const contactPerson = vendorInfo.contactPerson;
    return (contactPerson as Record<string, unknown>) || {};
  };

  const getContactField = (field: string): string => {
    const contactPerson = getContactPerson();
    const value = contactPerson[field];
    return typeof value === "string" ? value : "";
  };

  const getMetadata = () => {
    const values = form.values;
    return (values as { metadata?: Record<string, unknown> }).metadata || {};
  };

  const getMetadataField = (field: string): string => {
    const metadata = getMetadata();
    const value = metadata[field];
    return typeof value === "string" ? value : "";
  };

  const setVendorField = (path: string, value: string) => {
    if ("setFieldValue" in form && typeof form.setFieldValue === "function") {
      (form.setFieldValue as (path: string, value: unknown) => void)(
        path,
        value
      );
    }
  };

  return (
    <>
      <FormSection
        title="Company Information"
        collapsable={collapsableSections}
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
              value={getVendorField("companyName")}
              onChange={(e) =>
                setVendorField("vendorInfo.companyName", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="businessType" label="Business Type" />
            <Select
              id="businessType"
              name="businessType"
              value={getVendorField("businessType")}
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) =>
                setVendorField(
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
        collapsable={collapsableSections}
        description="What type of service is this vendor being invited for?"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="primaryService" label="Primary Service" />
            <Select
              id="primaryService"
              name="primaryService"
              value={getVendorField("primaryService")}
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) =>
                setVendorField(
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
        collapsable={collapsableSections}
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
              value={getContactField("name")}
              onChange={(e) =>
                setVendorField("vendorInfo.contactPerson.name", e.target.value)
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
              value={getContactField("jobTitle")}
              onChange={(e) =>
                setVendorField(
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
              value={getContactField("email")}
              onChange={(e) =>
                setVendorField("vendorInfo.contactPerson.email", e.target.value)
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
              value={getContactField("phone")}
              onChange={(e) =>
                setVendorField("vendorInfo.contactPerson.phone", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Invitation Details"
        collapsable={collapsableSections}
        description="Additional details for the invitation"
      >
        {/* TODO: expectedStartDate field needs to be added to metadata schema */}

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="inviteMessage" label="Personal Message" />
            <TextArea
              id="inviteMessage"
              name="inviteMessage"
              rows={5}
              placeholder="Add a personal message to the invitation (optional)"
              value={getMetadataField("inviteMessage")}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setVendorField("metadata.inviteMessage", e.target.value);
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
    </>
  );
};
