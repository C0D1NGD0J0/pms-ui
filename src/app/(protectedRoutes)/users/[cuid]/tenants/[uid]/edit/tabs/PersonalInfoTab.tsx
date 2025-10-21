import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { PanelsWrapper, Panel } from "@components/Panel";
import { TenantFormValues } from "@validations/tenant.validations";
import { FormField, FormInput, FormLabel } from "@components/FormElements";

interface PersonalInfoTabProps {
  tenantForm: UseFormReturnType<TenantFormValues>;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  tenantForm,
}) => {
  return (
    <PanelsWrapper>
      <Panel>
        <FormSection
          title="Personal Information"
          description="Basic tenant information"
        >
          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="firstName" label="First Name" required />
              <FormInput
                id="firstName"
                type="text"
                name="personalInfo.firstName"
                placeholder="Enter first name"
                {...tenantForm.getInputProps("personalInfo.firstName")}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="lastName" label="Last Name" required />
              <FormInput
                id="lastName"
                type="text"
                name="personalInfo.lastName"
                placeholder="Enter last name"
                {...tenantForm.getInputProps("personalInfo.lastName")}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="email" label="Email" required />
              <FormInput
                id="email"
                type="email"
                name="personalInfo.email"
                placeholder="Enter email"
                {...tenantForm.getInputProps("personalInfo.email")}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="phoneNumber" label="Phone Number" />
              <FormInput
                id="phoneNumber"
                type="tel"
                name="personalInfo.phoneNumber"
                placeholder="Enter phone number"
                {...tenantForm.getInputProps("personalInfo.phoneNumber")}
              />
            </FormField>
          </div>
        </FormSection>
      </Panel>
    </PanelsWrapper>
  );
};
