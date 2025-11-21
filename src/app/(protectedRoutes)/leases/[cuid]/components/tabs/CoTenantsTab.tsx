import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Button,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleCoTenantChange: (index: number, field: string, value: string) => void;
  addCoTenant: () => void;
  removeCoTenant: (index: number) => void;
}

export const CoTenantsTab = ({
  leaseForm,
  handleCoTenantChange,
  addCoTenant,
  removeCoTenant,
}: Props) => {
  const coTenants = leaseForm.values.coTenants || [];

  return (
    <>
      <div className="section-header-with-action mb-2">
        <h4 className="mb-0">Co-Tenants (Optional)</h4>
        <Button
          className="btn btn-outline btn-sm"
          label="Add Co-Tenant"
          icon={<i className="bx bx-plus"></i>}
          onClick={addCoTenant}
        />
      </div>

      {coTenants.map((coTenant, index) => (
        <div key={index} className="cotenant-card mb-2">
          <div className="cotenant-card__header">
            <h5 className="mb-0">Co-Tenant {index + 1}</h5>
            {coTenants.length > 0 && (
              <Button
                className="btn btn-outline btn-sm"
                label="Remove"
                icon={<i className="bx bx-trash"></i>}
                onClick={() => removeCoTenant(index)}
              />
            )}
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (leaseForm.errors[`coTenants.${index}.name`] as string) || "",
                touched: leaseForm.isTouched(`coTenants.${index}.name`),
              }}
            >
              <FormLabel
                htmlFor={`coTenant-name-${index}`}
                label="Name"
                required
              />
              <FormInput
                id={`coTenant-name-${index}`}
                name={`coTenants.${index}.name`}
                type="text"
                onChange={(e) =>
                  handleCoTenantChange(index, "name", e.target.value)
                }
                placeholder="Enter co-tenant name"
                value={coTenant.name}
                hasError={!!leaseForm.errors[`coTenants.${index}.name`]}
              />
            </FormField>
            <FormField
              error={{
                msg:
                  (leaseForm.errors[`coTenants.${index}.email`] as string) ||
                  "",
                touched: leaseForm.isTouched(`coTenants.${index}.email`),
              }}
            >
              <FormLabel
                htmlFor={`coTenant-email-${index}`}
                label="Email"
                required
              />
              <FormInput
                id={`coTenant-email-${index}`}
                name={`coTenants.${index}.email`}
                type="email"
                onChange={(e) =>
                  handleCoTenantChange(index, "email", e.target.value)
                }
                placeholder="Enter co-tenant email"
                value={coTenant.email}
                hasError={!!leaseForm.errors[`coTenants.${index}.email`]}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (leaseForm.errors[`coTenants.${index}.phone`] as string) ||
                  "",
                touched: leaseForm.isTouched(`coTenants.${index}.phone`),
              }}
            >
              <FormLabel
                htmlFor={`coTenant-phone-${index}`}
                label="Phone"
                required
              />
              <FormInput
                id={`coTenant-phone-${index}`}
                name={`coTenants.${index}.phone`}
                type="tel"
                onChange={(e) =>
                  handleCoTenantChange(index, "phone", e.target.value)
                }
                placeholder="Enter co-tenant phone"
                value={coTenant.phone}
                hasError={!!leaseForm.errors[`coTenants.${index}.phone`]}
              />
            </FormField>
            <FormField
              error={{
                msg:
                  (leaseForm.errors[
                    `coTenants.${index}.occupation`
                  ] as string) || "",
                touched: leaseForm.isTouched(`coTenants.${index}.occupation`),
              }}
            >
              <FormLabel
                htmlFor={`coTenant-occupation-${index}`}
                label="Occupation"
              />
              <FormInput
                id={`coTenant-occupation-${index}`}
                name={`coTenants.${index}.occupation`}
                type="text"
                onChange={(e) =>
                  handleCoTenantChange(index, "occupation", e.target.value)
                }
                placeholder="Enter occupation (optional)"
                value={coTenant.occupation || ""}
                hasError={!!leaseForm.errors[`coTenants.${index}.occupation`]}
              />
            </FormField>
          </div>
        </div>
      ))}
    </>
  );
};
