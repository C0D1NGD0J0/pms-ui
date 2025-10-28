import React, { useState } from "react";
import {
  FormField,
  FormLabel,
  FormInput,
  Button,
} from "@components/FormElements";

export const CoTenantsTab = () => {
  const [coTenants, setCoTenants] = useState([
    { id: 1, name: "", email: "", phone: "", occupation: "" },
  ]);

  const addCoTenant = () => {
    setCoTenants([
      ...coTenants,
      { id: Date.now(), name: "", email: "", phone: "", occupation: "" },
    ]);
  };

  const removeCoTenant = (id: number) => {
    setCoTenants(coTenants.filter((ct) => ct.id !== id));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h4 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
          Co-Tenants (Optional)
        </h4>
        <Button
          className="btn btn-outline btn-sm"
          label="Add Co-Tenant"
          icon={<i className="bx bx-plus"></i>}
          onClick={addCoTenant}
        />
      </div>

      {coTenants.map((coTenant, index) => (
        <div
          key={coTenant.id}
          style={{
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h5 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>
              Co-Tenant {index + 1}
            </h5>
            {coTenants.length > 1 && (
              <Button
                className="btn btn-outline btn-sm"
                label="Remove"
                icon={<i className="bx bx-trash"></i>}
                onClick={() => removeCoTenant(coTenant.id)}
              />
            )}
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-name-${coTenant.id}`}
                label="Name"
                required
              />
              <FormInput
                id={`coTenant-name-${coTenant.id}`}
                name={`coTenants.${index}.name`}
                type="text"
                onChange={() => {}}
                placeholder="Enter co-tenant name"
                value={coTenant.name}
                hasError={false}
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-email-${coTenant.id}`}
                label="Email"
                required
              />
              <FormInput
                id={`coTenant-email-${coTenant.id}`}
                name={`coTenants.${index}.email`}
                type="email"
                onChange={() => {}}
                placeholder="Enter co-tenant email"
                value={coTenant.email}
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
              <FormLabel
                htmlFor={`coTenant-phone-${coTenant.id}`}
                label="Phone"
                required
              />
              <FormInput
                id={`coTenant-phone-${coTenant.id}`}
                name={`coTenants.${index}.phone`}
                type="tel"
                onChange={() => {}}
                placeholder="Enter co-tenant phone"
                value={coTenant.phone}
                hasError={false}
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-occupation-${coTenant.id}`}
                label="Occupation"
              />
              <FormInput
                id={`coTenant-occupation-${coTenant.id}`}
                name={`coTenants.${index}.occupation`}
                type="text"
                onChange={() => {}}
                placeholder="Enter occupation (optional)"
                value={coTenant.occupation}
                hasError={false}
              />
            </FormField>
          </div>
        </div>
      ))}
    </>
  );
};
