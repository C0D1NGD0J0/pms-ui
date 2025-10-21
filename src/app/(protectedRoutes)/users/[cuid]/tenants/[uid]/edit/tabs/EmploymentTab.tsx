import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { PanelsWrapper, Panel } from "@components/Panel";
import { TenantFormValues } from "@validations/tenant.validations";
import { FormField, FormInput, FormLabel, Button } from "@components/FormElements";

interface EmploymentTabProps {
  tenantForm: UseFormReturnType<TenantFormValues>;
  addEmployerInfo: () => void;
  removeEmployerInfo: (index: number) => void;
}

export const EmploymentTab: React.FC<EmploymentTabProps> = ({
  tenantForm,
  addEmployerInfo,
  removeEmployerInfo,
}) => {
  return (
    <PanelsWrapper>
      <Panel>
        <FormSection
          title="Employment Information"
          description="Tenant employment details"
        >
          {tenantForm.values.tenantInfo.employerInfo.map((_, index) => (
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
                onClick={() => removeEmployerInfo(index)}
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
              />

              <div className="form-fields">
                <FormField>
                  <FormLabel
                    htmlFor={`companyName-${index}`}
                    label="Company Name"
                    required
                  />
                  <FormInput
                    id={`companyName-${index}`}
                    type="text"
                    name={`tenantInfo.employerInfo.${index}.companyName`}
                    placeholder="Enter company name"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.companyName`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`position-${index}`}
                    label="Position"
                    required
                  />
                  <FormInput
                    id={`position-${index}`}
                    type="text"
                    name={`tenantInfo.employerInfo.${index}.position`}
                    placeholder="Enter position"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.position`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`monthlyIncome-${index}`}
                    label="Monthly Income"
                    required
                  />
                  <FormInput
                    id={`monthlyIncome-${index}`}
                    type="number"
                    name={`tenantInfo.employerInfo.${index}.monthlyIncome`}
                    placeholder="Enter monthly income"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.monthlyIncome`
                    )}
                  />
                </FormField>
              </div>

              <div className="form-fields">
                <FormField>
                  <FormLabel
                    htmlFor={`contactPerson-${index}`}
                    label="Contact Person"
                  />
                  <FormInput
                    id={`contactPerson-${index}`}
                    type="text"
                    name={`tenantInfo.employerInfo.${index}.contactPerson`}
                    placeholder="Enter contact person"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.contactPerson`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`companyAddress-${index}`}
                    label="Company Address"
                  />
                  <FormInput
                    id={`companyAddress-${index}`}
                    type="text"
                    name={`tenantInfo.employerInfo.${index}.companyAddress`}
                    placeholder="Enter company address"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.companyAddress`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel
                    htmlFor={`contactEmail-${index}`}
                    label="Contact Email"
                  />
                  <FormInput
                    id={`contactEmail-${index}`}
                    type="email"
                    name={`tenantInfo.employerInfo.${index}.contactEmail`}
                    placeholder="Enter contact email"
                    {...tenantForm.getInputProps(
                      `tenantInfo.employerInfo.${index}.contactEmail`
                    )}
                  />
                </FormField>
              </div>
            </div>
          ))}

          <Button
            type="button"
            className="btn btn-outline"
            label="Add Employment"
            onClick={addEmployerInfo}
            icon={<i className="bx bx-plus"></i>}
          />
        </FormSection>
      </Panel>
    </PanelsWrapper>
  );
};
