"use client";
import React from "react";
import { FormSection } from "@components/FormLayout";
import { Checkbox, Select } from "@components/FormElements";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { FormInput, FormLabel, FormField } from "@components/FormElements";

interface EmployeeDetailsTabProps {
  formData: IInvitationFormData;
  onFieldChange: (field: string, value: any) => void;
}

export const EmployeeDetailsTab: React.FC<EmployeeDetailsTabProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <FormSection
      title="Employee Information"
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
            value={formData.employeeInfo?.employeeId || ""}
            onChange={(e) =>
              onFieldChange("employeeInfo.employeeId", e.target.value)
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
            value={formData.employeeInfo?.jobTitle || ""}
            onChange={(e) =>
              onFieldChange("employeeInfo.jobTitle", e.target.value)
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
            value={formData.employeeInfo?.department || ""}
            onChange={(value) =>
              onFieldChange("employeeInfo.department", value)
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
            value={formData.employeeInfo?.reportsTo || ""}
            onChange={(e) =>
              onFieldChange("employeeInfo.reportsTo", e.target.value)
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
              formData.employeeInfo?.startDate
                ? new Date(formData.employeeInfo.startDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              onFieldChange(
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
                    formData.employeeInfo?.permissions?.includes(
                      permission.id
                    ) || false
                  }
                  onChange={(e) => {
                    const permissions =
                      formData.employeeInfo?.permissions || [];
                    const newPermissions = e.target.checked
                      ? [...permissions, permission.id]
                      : permissions.filter((p) => p !== permission.id);
                    onFieldChange("employeeInfo.permissions", newPermissions);
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
