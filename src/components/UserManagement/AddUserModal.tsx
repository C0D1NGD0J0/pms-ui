"use client";

import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Checkbox, Select } from "@components/FormElements";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { FormField, FormInput, FormLabel, Button, Form } from "@components/FormElements";
import { ModalContent, ModalFooter, ModalHeader, Modal } from "@components/FormElements/Modal";

interface AddUserModalProps {
  userType: 'employee' | 'vendor';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IInvitationFormData>) => void;
  isSubmitting?: boolean;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  userType,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<IInvitationFormData>>(() => {
    const baseData = {
      personalInfo: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
      },
      inviteeEmail: "",
      role: userType === 'employee' ? 'staff' as const : 'vendor' as const,
      status: "pending" as const,
    };

    if (userType === 'employee') {
      return {
        ...baseData,
        employeeInfo: {
          jobTitle: "",
          department: "",
          employeeId: "",
          reportsTo: "",
          startDate: undefined,
          permissions: [],
        },
      };
    } else {
      return {
        ...baseData,
        vendorInfo: {
          companyName: "",
          businessType: "",
          servicesOffered: {},
          contactPerson: {
            name: "",
            jobTitle: "",
            email: "",
            phone: "",
          },
        },
      };
    }
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
    // Reset form data based on user type
    const resetData = userType === 'employee' 
      ? {
          personalInfo: { firstName: "", lastName: "", phoneNumber: "" },
          inviteeEmail: "",
          role: "staff" as const,
          employeeInfo: {
            jobTitle: "", department: "", employeeId: "", reportsTo: "",
            startDate: undefined, permissions: [],
          },
          status: "pending" as const,
        }
      : {
          personalInfo: { firstName: "", lastName: "", phoneNumber: "" },
          inviteeEmail: "",
          role: "vendor" as const,
          vendorInfo: {
            companyName: "", businessType: "", servicesOffered: {},
            contactPerson: { name: "", jobTitle: "", email: "", phone: "" },
          },
          status: "pending" as const,
        };
    
    setFormData(resetData);
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle = userType === 'employee' ? 'Add New Employee' : 'Add New Vendor';

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="large">
      <Form onSubmit={handleSubmit}>
        <ModalHeader title={modalTitle} onClose={handleCancel} />
        
        <ModalContent className="employee-modal-content">
          {/* Personal Information Section */}
          <FormSection
            title={userType === 'employee' ? "Personal Information" : "Primary Contact Information"}
            description={userType === 'employee' 
              ? "Enter basic personal details" 
              : "Enter primary contact person details"
            }
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
                  onChange={(e) => handleFieldChange("personalInfo.firstName", e.target.value)}
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
                  onChange={(e) => handleFieldChange("personalInfo.lastName", e.target.value)}
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
                  onChange={(e) => handleFieldChange("inviteeEmail", e.target.value)}
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
                  onChange={(e) => handleFieldChange("personalInfo.phoneNumber", e.target.value)}
                />
              </FormField>
            </div>
          </FormSection>

          {/* User Type Specific Sections */}
          {userType === 'employee' ? (
            // Employee Information Section
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
                    onChange={(e) => handleFieldChange("employeeInfo.employeeId", e.target.value)}
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
                    onChange={(e) => handleFieldChange("employeeInfo.jobTitle", e.target.value)}
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
                    onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
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
                    onChange={(e) => handleFieldChange("employeeInfo.reportsTo", e.target.value)}
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
                        ? new Date(formData.employeeInfo.startDate).toISOString().split("T")[0]
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
                            formData.employeeInfo?.permissions?.includes(permission.id) || false
                          }
                          onChange={(e) => {
                            const permissions = formData.employeeInfo?.permissions || [];
                            const newPermissions = e.target.checked
                              ? [...permissions, permission.id]
                              : permissions.filter((p) => p !== permission.id);
                            handleFieldChange("employeeInfo.permissions", newPermissions);
                          }}
                          label={permission.label}
                        />
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>
            </FormSection>
          ) : (
            // Vendor Information Section
            <FormSection
              title="Vendor Information"
              description="Enter vendor company details"
            >
              <div className="form-fields">
                <FormField>
                  <FormLabel htmlFor="companyName" label="Company Name *" />
                  <FormInput
                    id="companyName"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.vendorInfo?.companyName || ""}
                    onChange={(e) => handleFieldChange("vendorInfo.companyName", e.target.value)}
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="businessType" label="Business Type" />
                  <Select
                    id="businessType"
                    name="businessType"
                    value={formData.vendorInfo?.businessType || ""}
                    onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
                      handleFieldChange(
                        "vendorInfo.businessType",
                        typeof value === "string" ? value : value.target.value
                      )
                    }
                    options={[
                      { value: "", label: "Select business type" },
                      { value: "hvac", label: "HVAC Services" },
                      { value: "electrical", label: "Electrical Services" },
                      { value: "plumbing", label: "Plumbing Services" },
                      { value: "maintenance", label: "General Maintenance" },
                      { value: "landscaping", label: "Landscaping" },
                      { value: "cleaning", label: "Cleaning Services" },
                      { value: "security", label: "Security Services" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </FormField>
              </div>

              <div className="form-fields single-column">
                <FormField>
                  <FormLabel htmlFor="services" label="Services Offered" />
                  <div className="services-grid">
                    {[
                      { id: "hvac", label: "HVAC" },
                      { id: "electrical", label: "Electrical" },
                      { id: "plumbing", label: "Plumbing" },
                      { id: "maintenance", label: "Maintenance" },
                      { id: "landscaping", label: "Landscaping" },
                      { id: "cleaning", label: "Cleaning" },
                      { id: "security", label: "Security" },
                      { id: "other", label: "Other" },
                    ].map((service) => (
                      <div key={service.id} className="service-item">
                        <Checkbox
                          id={`service-${service.id}`}
                          name="vendorInfo.servicesOffered"
                          checked={
                            formData.vendorInfo?.servicesOffered?.[service.id] || false
                          }
                          onChange={(e) => {
                            handleFieldChange(
                              `vendorInfo.servicesOffered.${service.id}`,
                              e.target.checked
                            );
                          }}
                          label={service.label}
                        />
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>
            </FormSection>
          )}
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

AddUserModal.displayName = 'AddUserModal';