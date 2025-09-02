import React from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
} from "@components/FormElements";

interface EmployeeInfoTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
}

export const EmployeeInfoTab: React.FC<EmployeeInfoTabProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="Employment Details"
        description="Your role and department information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="jobTitle" label="Job Title" />
            <FormInput
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.employeeInfo.jobTitle}
              onChange={(e) =>
                handleInputChange("employeeInfo", "jobTitle", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="department" label="Department" />
            <FormInput
              id="department"
              name="department"
              type="text"
              value={formData.employeeInfo.department}
              onChange={(e) =>
                handleInputChange("employeeInfo", "department", e.target.value)
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="employeeId" label="Employee ID" />
            <FormInput
              id="employeeId"
              name="employeeId"
              type="text"
              value={formData.employeeInfo.employeeId}
              onChange={(e) =>
                handleInputChange("employeeInfo", "employeeId", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="reportsTo" label="Reports To" />
            <FormInput
              id="reportsTo"
              name="reportsTo"
              type="text"
              value={formData.employeeInfo.reportsTo}
              onChange={(e) =>
                handleInputChange("employeeInfo", "reportsTo", e.target.value)
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="startDate" label="Start Date" />
            <FormInput
              id="startDate"
              name="startDate"
              type="date"
              value={formData.employeeInfo.startDate.toISOString().split("T")[0]}
              onChange={(e) =>
                handleInputChange(
                  "employeeInfo",
                  "startDate",
                  new Date(e.target.value)
                )
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};