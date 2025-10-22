"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { Checkbox, Select } from "@components/FormElements";
import { ProfileFormValues } from "@src/validations/profile.validations";
import { FormInput, FormLabel, FormField } from "@components/FormElements";

interface EmployeeDetailsTabProps {
  form: UseFormReturnType<ProfileFormValues>;
  collapsableSections: boolean;
}

export const EmployeeDetailsTab = ({
  form,
  collapsableSections = false,
}: EmployeeDetailsTabProps) => {
  const getEmployeeInfo = () => {
    const values = form.values as any;
    return values.employeeInfo || {};
  };

  const getFieldValue = (field: string) => {
    const employeeInfo = getEmployeeInfo();
    return employeeInfo[field] || "";
  };

  const getPermissions = (): string[] => {
    const employeeInfo = getEmployeeInfo();
    return employeeInfo.permissions || [];
  };

  const getStartDate = () => {
    const employeeInfo = getEmployeeInfo();
    const startDate = employeeInfo.startDate;
    if (!startDate) return "";

    const date = startDate instanceof Date ? startDate : new Date(startDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const setEmployeeField = (field: string, value: any) => {
    (form as any).setFieldValue(`employeeInfo.${field}`, value);
  };

  return (
    <FormSection
      title="Employee Information"
      collapsable={collapsableSections}
      description="Enter employee-specific details"
    >
      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="employeeId" label="Employee ID" />
          <FormInput
            id="employeeId"
            type="text"
            name="employeeId"
            placeholder="Enter employee ID"
            value={getFieldValue("employeeId")}
            onChange={(e) => setEmployeeField("employeeId", e.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="jobTitle" label="Job Title *" />
          <FormInput
            id="jobTitle"
            type="text"
            name="jobTitle"
            placeholder="Enter job title"
            value={getFieldValue("jobTitle")}
            onChange={(e) => setEmployeeField("jobTitle", e.target.value)}
            required
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="department" label="Department" />
          <Select
            id="department"
            name="department"
            value={getFieldValue("department")}
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              setEmployeeField(
                "department",
                typeof value === "string" ? value : value.target.value
              )
            }
            options={[
              { value: "", label: "Select department" },
              { value: "management", label: "Management" },
              { value: "maintenance", label: "Maintenance" },
              { value: "leasing", label: "Leasing" },
              { value: "accounting", label: "Accounting" },
              { value: "marketing", label: "Marketing" },
              { value: "security", label: "Security" },
              { value: "other", label: "Other" },
            ]}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="reportsTo" label="Reports To" />
          <FormInput
            id="reportsTo"
            type="text"
            name="reportsTo"
            placeholder="Enter supervisor name"
            value={getFieldValue("reportsTo")}
            onChange={(e) => setEmployeeField("reportsTo", e.target.value)}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="employeeStartDate" label="Start Date" />
          <FormInput
            id="employeeStartDate"
            type="date"
            name="employeeStartDate"
            value={getStartDate()}
            onChange={(e) =>
              setEmployeeField(
                "startDate",
                e.target.value ? new Date(e.target.value) : null
              )
            }
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="permissions" label="Permissions" />
          <div className="services-grid">
            {[
              { id: "properties", label: "Properties" },
              { id: "tenants", label: "Tenants" },
              { id: "maintenance", label: "Maintenance" },
              { id: "reports", label: "Reports" },
              { id: "billing", label: "Billing" },
              { id: "users", label: "User Management" },
            ].map((permission) => (
              <div key={permission.id} className="service-item">
                <Checkbox
                  id={`perm-${permission.id}`}
                  name="employeeInfo.permissions"
                  checked={getPermissions().includes(permission.id)}
                  onChange={(e) => {
                    const permissions = getPermissions();
                    const newPermissions = e.target.checked
                      ? [...permissions, permission.id]
                      : permissions.filter((p: string) => p !== permission.id);
                    setEmployeeField("permissions", newPermissions);
                  }}
                  label={permission.label}
                />
              </div>
            ))}
          </div>
        </FormField>
      </div>
    </FormSection>
  );
};
