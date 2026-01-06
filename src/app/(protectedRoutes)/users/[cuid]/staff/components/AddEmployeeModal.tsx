"use client";

import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Checkbox, Select } from "@components/FormElements";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Button,
  Form,
} from "@components/FormElements";
import {
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
} from "@components/FormElements/Modal";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IInvitationFormData>) => void;
  isSubmitting?: boolean;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<IInvitationFormData>>({
    personalInfo: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    inviteeEmail: "",
    role: "staff",
    employeeInfo: {
      jobTitle: "",
      department: "",
      employeeId: "",
      reportsTo: "",
      startDate: undefined,
      permissions: [],
    },
    status: "pending",
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const newData = { ...prev };

      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      personalInfo: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
      },
      inviteeEmail: "",
      role: "staff",
      employeeInfo: {
        jobTitle: "",
        department: "",
        employeeId: "",
        reportsTo: "",
        startDate: undefined,
        permissions: [],
      },
      status: "pending",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="large">
      <Form onSubmit={handleSubmit}>
        <ModalHeader title="Add New Employee" onClose={handleCancel} />

        <ModalContent className="employee-modal-content">
          {/* Personal Information Section */}
          <FormSection
            title="Personal Information"
            description="Enter basic personal details"
          >
            <div className="form-fields">
              <FormField>
                <FormLabel htmlFor="firstName" label="First Name *" />
                <FormInput
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.personalInfo?.firstName || ""}
                  onChange={(e) =>
                    handleFieldChange("personalInfo.firstName", e.target.value)
                  }
                  required
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="lastName" label="Last Name *" />
                <FormInput
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.personalInfo?.lastName || ""}
                  onChange={(e) =>
                    handleFieldChange("personalInfo.lastName", e.target.value)
                  }
                  required
                />
              </FormField>
            </div>

            <div className="form-fields">
              <FormField>
                <FormLabel htmlFor="email" label="Email Address *" />
                <FormInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.inviteeEmail || ""}
                  onChange={(e) =>
                    handleFieldChange("inviteeEmail", e.target.value)
                  }
                  required
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="phoneNumber" label="Phone Number" />
                <FormInput
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.personalInfo?.phoneNumber || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "personalInfo.phoneNumber",
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </FormSection>

          {/* Employee Information Section */}
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
                    handleFieldChange("employeeInfo.employeeId", e.target.value)
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
                    handleFieldChange("employeeInfo.jobTitle", e.target.value)
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
                  onChange={(
                    value: string | React.ChangeEvent<HTMLSelectElement>
                  ) =>
                    handleFieldChange(
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
                  value={formData.employeeInfo?.reportsTo || ""}
                  onChange={(e) =>
                    handleFieldChange("employeeInfo.reportsTo", e.target.value)
                  }
                />
              </FormField>
            </div>

            <div className="form-fields single-column">
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
                    handleFieldChange(
                      "employeeInfo.startDate",
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />
              </FormField>
            </div>

            <div className="form-fields single-column">
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
                          handleFieldChange(
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
        </ModalContent>

        <ModalFooter>
          <Button
            type="button"
            className="btn btn-outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            label="Cancel"
          />
          <Button
            type="submit"
            className="btn btn-primary"
            loading={isSubmitting}
            loadingText="Sending Invitation..."
            label="Send Invitation"
          />
        </ModalFooter>
      </Form>
    </Modal>
  );
};
