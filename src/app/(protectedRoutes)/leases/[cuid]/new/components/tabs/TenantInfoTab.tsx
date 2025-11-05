import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface TenantOption {
  value: string;
  label: string;
}

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
  tenantOptions: TenantOption[];
  tenantSelectionType: "existing" | "invite";
  isLoadingTenants: boolean;
  onTenantSelectionTypeChange: (type: "existing" | "invite") => void;
}

export const TenantInfoTab = ({
  leaseForm,
  handleOnChange,
  tenantOptions,
  tenantSelectionType,
  isLoadingTenants,
  onTenantSelectionTypeChange,
}: Props) => {
  const handleTypeChange = (
    value: string | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const actualValue = typeof value === "string" ? value : value.target.value;
    onTenantSelectionTypeChange(actualValue as "existing" | "invite");
  };
  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["tenantInfo"] as string) || "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="tenantType" label="Tenant Selection Type" />
          <Select
            id="tenantType"
            name="tenantType"
            onChange={handleTypeChange}
            options={[
              { value: "existing", label: "Select Existing Tenant" },
              { value: "invite", label: "Invite New Tenant" },
            ]}
            value={tenantSelectionType}
          />
        </FormField>
      </div>

      {tenantSelectionType === "existing" ? (
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
              placeholder={
                isLoadingTenants ? "Loading tenants..." : "Select tenant"
              }
              value={leaseForm.values.tenantInfo.id || ""}
              disabled={isLoadingTenants}
            />
          </FormField>
        </div>
      ) : (
        <>
          <div className="form-fields">
            <FormField
              error={{
                msg: (leaseForm.errors["tenantInfo.firstName"] as string) || "",
                touched: leaseForm.isTouched("tenantInfo.firstName"),
              }}
            >
              <FormLabel
                htmlFor="tenantFirstName"
                label="First Name"
                required
              />
              <FormInput
                id="tenantFirstName"
                name="tenantInfo.firstName"
                type="text"
                onChange={handleOnChange}
                placeholder="Enter tenant's first name"
                value={leaseForm.values.tenantInfo.firstName || ""}
                hasError={!!leaseForm.errors["tenantInfo.firstName"]}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg: (leaseForm.errors["tenantInfo.lastName"] as string) || "",
                touched: leaseForm.isTouched("tenantInfo.lastName"),
              }}
            >
              <FormLabel htmlFor="tenantLastName" label="Last Name" required />
              <FormInput
                id="tenantLastName"
                name="tenantInfo.lastName"
                type="text"
                onChange={handleOnChange}
                placeholder="Enter tenant's last name"
                value={leaseForm.values.tenantInfo.lastName || ""}
                hasError={!!leaseForm.errors["tenantInfo.lastName"]}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg: (leaseForm.errors["tenantInfo.email"] as string) || "",
                touched: leaseForm.isTouched("tenantInfo.email"),
              }}
            >
              <FormLabel htmlFor="tenantEmail" label="Email" required />
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
