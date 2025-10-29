import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const TenantInfoTab = ({ leaseForm, handleOnChange }: Props) => {
  const useExistingTenant = !!leaseForm.values.tenantInfo.id;

  // Placeholder options - will be fetched from API in future
  const tenantOptions = [
    { value: "", label: "Select a tenant" },
    { value: "tenant-1", label: "John Doe - john.doe@example.com" },
    { value: "tenant-2", label: "Jane Smith - jane.smith@example.com" },
  ];

  const handleTenantTypeChange = (
    value: string | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (value === "existing") {
      // Clear email, keep id field for selection
      handleOnChange("", "tenantInfo.email");
    } else {
      // Clear id, keep email field for entry
      handleOnChange("", "tenantInfo.id");
    }
  };

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="tenantType" label="Tenant Selection Type" />
          <Select
            id="tenantType"
            name="tenantType"
            onChange={handleTenantTypeChange}
            options={[
              { value: "existing", label: "Select Existing Tenant" },
              { value: "invite", label: "Invite New Tenant" },
            ]}
            value={useExistingTenant ? "existing" : "invite"}
          />
        </FormField>
      </div>

      {useExistingTenant ? (
        <div className="form-fields">
          <FormField
            error={{
              msg: (leaseForm.errors["tenantInfo.id"] as string) || "",
              touched: leaseForm.isTouched("tenantInfo.id"),
            }}
          >
            <FormLabel htmlFor="tenantId" label="Tenant" required />
            <Select
              id="tenantId"
              name="tenantInfo.id"
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) => handleOnChange(value, "tenantInfo.id")}
              options={tenantOptions}
              placeholder="Select tenant"
              value={leaseForm.values.tenantInfo.id || ""}
            />
          </FormField>
        </div>
      ) : (
        <>
          <div className="form-fields">
            <FormField
              error={{
                msg: (leaseForm.errors["tenantInfo.email"] as string) || "",
                touched: leaseForm.isTouched("tenantInfo.email"),
              }}
            >
              <FormLabel htmlFor="tenantEmail" label="Tenant Email" required />
              <FormInput
                id="tenantEmail"
                name="tenantInfo.email"
                type="email"
                onChange={handleOnChange}
                placeholder="Enter tenant email"
                value={leaseForm.values.tenantInfo.email || ""}
                hasError={!!leaseForm.errors["tenantInfo.email"]}
              />
            </FormField>
          </div>
        </>
      )}
    </>
  );
};
