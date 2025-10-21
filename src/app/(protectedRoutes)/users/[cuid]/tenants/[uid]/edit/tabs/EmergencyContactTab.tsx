import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { TenantFormValues } from "@validations/tenant.validations";

interface EmergencyContactTabProps {
  tenantForm: UseFormReturnType<TenantFormValues>;
}

export const EmergencyContactTab: React.FC<EmergencyContactTabProps> = ({
  tenantForm,
}) => {
  return (
    <PanelsWrapper>
      <Panel>
        <FormSection
          title="Emergency Contact"
          description="Emergency contact information"
        >
          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="emergencyName" label="Name" />
              <FormInput
                id="emergencyName"
                type="text"
                name="tenantInfo.emergencyContact.name"
                placeholder="Enter name"
                {...tenantForm.getInputProps(
                  "tenantInfo.emergencyContact.name"
                )}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="emergencyPhone" label="Phone" />
              <FormInput
                id="emergencyPhone"
                type="tel"
                name="tenantInfo.emergencyContact.phone"
                placeholder="Enter phone"
                {...tenantForm.getInputProps(
                  "tenantInfo.emergencyContact.phone"
                )}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="emergencyRelationship" label="Relationship" />
              <FormInput
                id="emergencyRelationship"
                type="text"
                name="tenantInfo.emergencyContact.relationship"
                placeholder="Enter relationship"
                {...tenantForm.getInputProps(
                  "tenantInfo.emergencyContact.relationship"
                )}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="emergencyEmail" label="Email" />
              <FormInput
                id="emergencyEmail"
                type="email"
                name="tenantInfo.emergencyContact.email"
                placeholder="Enter email"
                {...tenantForm.getInputProps(
                  "tenantInfo.emergencyContact.email"
                )}
              />
            </FormField>
          </div>
        </FormSection>
      </Panel>
    </PanelsWrapper>
  );
};
