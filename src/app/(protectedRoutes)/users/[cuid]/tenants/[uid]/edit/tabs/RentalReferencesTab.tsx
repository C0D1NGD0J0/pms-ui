import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { Button } from "@components/FormElements";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { TenantFormValues } from "@validations/tenant.validations";

interface RentalReferencesTabProps {
  tenantForm: UseFormReturnType<TenantFormValues>;
  addRentalReference: () => void;
  removeRentalReference: (index: number) => void;
}

export const RentalReferencesTab: React.FC<RentalReferencesTabProps> = ({
  tenantForm,
  addRentalReference,
  removeRentalReference,
}) => {
  return (
    <PanelsWrapper>
      <Panel>
        <FormSection
          title="Rental References"
          description="Previous rental history"
        >
          {tenantForm.values.tenantInfo.rentalReferences.map((_, index) => (
            <div
              key={index}
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Button
                type="button"
                className="btn btn-sm btn-danger"
                label="Remove"
                onClick={() => removeRentalReference(index)}
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
              />

              <div className="form-fields">
                <FormField>
                  <FormLabel
                    htmlFor={`landlordName-${index}`}
                    label="Landlord Name"
                    required
                  />
                  <FormInput
                    id={`landlordName-${index}`}
                    type="text"
                    name={`tenantInfo.rentalReferences.${index}.landlordName`}
                    placeholder="Enter landlord name"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.landlordName`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`landlordEmail-${index}`}
                    label="Landlord Email"
                  />
                  <FormInput
                    id={`landlordEmail-${index}`}
                    type="email"
                    name={`tenantInfo.rentalReferences.${index}.landlordEmail`}
                    placeholder="Enter landlord email"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.landlordEmail`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`landlordContact-${index}`}
                    label="Landlord Contact"
                  />
                  <FormInput
                    id={`landlordContact-${index}`}
                    type="tel"
                    name={`tenantInfo.rentalReferences.${index}.landlordContact`}
                    placeholder="Enter landlord contact"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.landlordContact`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`durationMonths-${index}`}
                    label="Duration (months)"
                    required
                  />
                  <FormInput
                    id={`durationMonths-${index}`}
                    type="number"
                    name={`tenantInfo.rentalReferences.${index}.durationMonths`}
                    placeholder="Enter duration in months"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.durationMonths`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`reasonForLeaving-${index}`}
                    label="Reason for Leaving"
                  />
                  <FormInput
                    id={`reasonForLeaving-${index}`}
                    type="text"
                    name={`tenantInfo.rentalReferences.${index}.reasonForLeaving`}
                    placeholder="Enter reason for leaving"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.reasonForLeaving`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`propertyAddress-${index}`}
                    label="Property Address"
                  />
                  <FormInput
                    id={`propertyAddress-${index}`}
                    type="text"
                    name={`tenantInfo.rentalReferences.${index}.propertyAddress`}
                    placeholder="Enter property address"
                    {...tenantForm.getInputProps(
                      `tenantInfo.rentalReferences.${index}.propertyAddress`
                    )}
                  />
                </FormField>
              </div>
            </div>
          ))}

          <Button
            type="button"
            className="btn btn-outline"
            label="Add Reference"
            onClick={addRentalReference}
            icon={<i className="bx bx-plus"></i>}
          />
        </FormSection>
      </Panel>
    </PanelsWrapper>
  );
};
