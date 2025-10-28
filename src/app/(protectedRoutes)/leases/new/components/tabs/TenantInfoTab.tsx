import React, { useState } from "react";
import {
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

export const TenantInfoTab = () => {
  const [useExistingTenant, setUseExistingTenant] = useState(true);

  // Placeholder options - will be fetched from API
  const tenantOptions = [
    { value: "", label: "Select a tenant" },
    { value: "tenant-1", label: "John Doe - john.doe@example.com" },
    { value: "tenant-2", label: "Jane Smith - jane.smith@example.com" },
  ];

  const handleTenantTypeChange = (
    value: string | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = typeof value === "string" ? value : value.target.value;
    setUseExistingTenant(val === "existing");
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
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="tenantId" label="Tenant" required />
            <Select
              id="tenantId"
              name="tenantInfo.id"
              onChange={() => {}}
              options={tenantOptions}
              placeholder="Select tenant"
              value=""
            />
          </FormField>
        </div>
      ) : (
        <>
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel htmlFor="tenantEmail" label="Tenant Email" required />
              <FormInput
                id="tenantEmail"
                name="tenantInfo.email"
                type="email"
                onChange={() => {}}
                placeholder="Enter tenant email"
                value=""
                hasError={false}
              />
            </FormField>
          </div>
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel htmlFor="tenantName" label="Tenant Name" />
              <FormInput
                id="tenantName"
                name="tenantName"
                type="text"
                onChange={() => {}}
                placeholder="Enter tenant name"
                value=""
                hasError={false}
              />
            </FormField>
          </div>
        </>
      )}
    </>
  );
};
