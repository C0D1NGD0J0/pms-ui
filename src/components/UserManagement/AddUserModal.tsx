"use client";

import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
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
import { EmployeeDetailsTab } from "@app/(protectedRoutes)/users/[cuid]/add-users/components/tabs/EmployeeDetailsTab";
import { VendorInvitationTab } from "@app/(protectedRoutes)/users/[cuid]/add-users/components/tabs/VendorInvitationTab";

interface AddUserModalProps {
  userType: "employee" | "vendor";
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
  const [messageCount, setMessageCount] = useState(0);
  const [formData, setFormData] = useState<IInvitationFormData>(() => {
    const baseData: IInvitationFormData = {
      personalInfo: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
      },
      inviteeEmail: "",
      role: userType === "employee" ? ("staff" as const) : ("vendor" as const),
      status: "pending" as const,
      metadata: {
        inviteMessage: "",
        expectedStartDate: undefined,
        attachments: undefined,
      },
    };

    if (userType === "employee") {
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
          primaryService: "",
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
    const resetData =
      userType === "employee"
        ? {
            personalInfo: { firstName: "", lastName: "", phoneNumber: "" },
            inviteeEmail: "",
            role: "staff" as const,
            employeeInfo: {
              jobTitle: "",
              department: "",
              employeeId: "",
              reportsTo: "",
              startDate: undefined,
              permissions: [],
            },
            status: "pending" as const,
          }
        : {
            personalInfo: { firstName: "", lastName: "", phoneNumber: "" },
            inviteeEmail: "",
            role: "vendor" as const,
            vendorInfo: {
              companyName: "",
              businessType: "",
              servicesOffered: {},
              contactPerson: { name: "", jobTitle: "", email: "", phone: "" },
            },
            status: "pending" as const,
          };

    setFormData(resetData);
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle =
    userType === "employee" ? "Add New Employee" : "Add New Vendor";

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="large">
      <Form onSubmit={handleSubmit} className="resource-form">
        <ModalHeader title={modalTitle} onClose={handleCancel} />

        <ModalContent className="user-modal-content">
          {/* Personal Information Section for both types */}
          <FormSection
            title={
              userType === "employee"
                ? "Personal Information"
                : "Primary Contact Information"
            }
            description={
              userType === "employee"
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

          {/* Use the actual tab components */}
          {userType === "employee" ? (
            <EmployeeDetailsTab
              formData={formData}
              collapsableSections={true}
              onFieldChange={handleFieldChange}
            />
          ) : (
            <VendorInvitationTab
              formData={formData}
              messageCount={messageCount}
              onFieldChange={handleFieldChange}
              onMessageCountChange={setMessageCount}
            />
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

AddUserModal.displayName = "AddUserModal";
