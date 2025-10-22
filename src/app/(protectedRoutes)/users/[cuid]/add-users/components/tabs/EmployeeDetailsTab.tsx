"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { InvitationFormValues } from "@src/validations";
import { Checkbox, Select } from "@components/FormElements";
import { FormInput, FormLabel, FormField } from "@components/FormElements";

interface EmployeeDetailsTabProps {
  form: UseFormReturnType<InvitationFormValues>;
  collapsableSections: boolean;
}

export const EmployeeDetailsTab = ({
  form,
  collapsableSections = false,
}: EmployeeDetailsTabProps) => {
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
            value={form.values?.employeeInfo?.employeeId || ""}
            onChange={(e) =>
              form.setFieldValue("employeeInfo.employeeId", e.target.value)
            }
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="jobTitle" label="Job Title *" />
          <FormInput
            id="jobTitle"
            type="text"
            name="jobTitle"
            placeholder="Enter job title"
            value={form.values?.employeeInfo?.jobTitle || ""}
            onChange={(e) =>
              form.setFieldValue("employeeInfo.jobTitle", e.target.value)
            }
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
            value={form.values?.employeeInfo?.department || ""}
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              form.setFieldValue(
                "employeeInfo.department",
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
            value={form.values?.employeeInfo?.reportsTo || ""}
            onChange={(e) =>
              form.setFieldValue("employeeInfo.reportsTo", e.target.value)
            }
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
            value={
              form.values?.employeeInfo?.startDate
                ? new Date(form.values.employeeInfo.startDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              form.setFieldValue(
                "employeeInfo.startDate",
                e.target.value ? new Date(e.target.value) : undefined
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
                  checked={
                    form.values?.employeeInfo?.permissions?.includes(
                      permission.id
                    ) || false
                  }
                  onChange={(e) => {
                    const permissions =
                      form.values?.employeeInfo?.permissions || [];
                    const newPermissions = e.target.checked
                      ? [...permissions, permission.id]
                      : permissions.filter((p: any) => p !== permission.id);
                    form.setFieldValue(
                      "employeeInfo.permissions",
                      newPermissions
                    );
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
