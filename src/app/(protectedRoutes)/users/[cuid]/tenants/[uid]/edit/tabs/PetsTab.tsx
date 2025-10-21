import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { Button } from "@components/FormElements";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { TenantFormValues } from "@validations/tenant.validations";

interface PetsTabProps {
  tenantForm: UseFormReturnType<TenantFormValues>;
  addPet: () => void;
  removePet: (index: number) => void;
}

export const PetsTab: React.FC<PetsTabProps> = ({
  tenantForm,
  addPet,
  removePet,
}) => {
  return (
    <PanelsWrapper>
      <Panel>
        <FormSection title="Pets" description="Pet information">
          {tenantForm.values.tenantInfo.pets.map((_, index) => (
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
                onClick={() => removePet(index)}
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
              />

              <div className="form-fields">
                <FormField>
                  <FormLabel
                    htmlFor={`petType-${index}`}
                    label="Type"
                    required
                  />
                  <FormInput
                    id={`petType-${index}`}
                    type="text"
                    name={`tenantInfo.pets.${index}.type`}
                    placeholder="Enter pet type (e.g., Dog, Cat)"
                    {...tenantForm.getInputProps(
                      `tenantInfo.pets.${index}.type`
                    )}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor={`petBreed-${index}`} label="Breed" />
                  <FormInput
                    id={`petBreed-${index}`}
                    type="text"
                    name={`tenantInfo.pets.${index}.breed`}
                    placeholder="Enter breed"
                    {...tenantForm.getInputProps(
                      `tenantInfo.pets.${index}.breed`
                    )}
                  />
                </FormField>

                <FormField>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={`tenantInfo.pets.${index}.isServiceAnimal`}
                      {...tenantForm.getInputProps(
                        `tenantInfo.pets.${index}.isServiceAnimal`,
                        { type: "checkbox" }
                      )}
                    />
                    <span>Service Animal</span>
                  </label>
                </FormField>
              </div>
            </div>
          ))}

          <Button
            type="button"
            className="btn btn-outline"
            label="Add Pet"
            onClick={addPet}
            icon={<i className="bx bx-plus"></i>}
          />
        </FormSection>
      </Panel>
    </PanelsWrapper>
  );
};
