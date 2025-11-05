"use client";
import React, { useEffect } from "react";
import { RoleTile } from "@components/RoleTile";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { IUnifiedPermissions } from "@interfaces/index";
import { TextArea, Checkbox } from "@components/FormElements";
import { FormInput, FormLabel, FormField } from "@components/FormElements";
import {
  IInvitationFormData,
  IUserRole,
} from "@interfaces/invitation.interface";

interface RoleSelectionTabProps {
  formData: UseFormReturnType<IInvitationFormData>;
  selectedRole: IUserRole | null;
  messageCount: number;
  permission: IUnifiedPermissions;
  showInviteMessage: boolean;
  onRoleSelect: (role: IUserRole) => void;
  onFieldChange: (field: string, value: any) => void;
  onMessageCountChange: (count: number) => void;
  onShowInviteMessageToggle: (show: boolean) => void;
  editingInvitation?: any;
}

export const RoleSelectionTab = ({
  formData,
  selectedRole,
  messageCount,
  showInviteMessage,
  onRoleSelect,
  onFieldChange,
  onMessageCountChange,
  onShowInviteMessageToggle,
  editingInvitation,
}: RoleSelectionTabProps) => {
  useEffect(() => {
    if (!!formData.values.metadata?.inviteMessage) {
      onShowInviteMessageToggle(true);
      onMessageCountChange(formData.values.metadata.inviteMessage.length);
    }
  }, [formData.values.metadata?.inviteMessage]);

  const isRoleSelectionDisabled =
    editingInvitation?.iuid &&
    (formData.values.status === "draft" ||
      formData.values.status === "pending");

  const roles = [
    {
      value: "manager",
      title: "Manager",
      subtitle: "PROPERTY MANAGER",
      icon: "bx bx-user-pin",
    },
    {
      value: "staff",
      title: "Staff",
      subtitle: "STAFF MEMBER",
      icon: "bx bx-id-card",
    },
    {
      value: "tenant",
      title: "Tenant",
      subtitle: "PROPERTY TENANT",
      icon: "bx bx-home",
    },
    {
      value: "vendor",
      title: "Vendor",
      subtitle: "SERVICE PROVIDER",
      icon: "bx bx-building",
    },
    {
      value: "admin",
      title: "Admin",
      subtitle: "SYSTEM ADMIN",
      icon: "bx bx-shield",
    },
  ];

  return (
    <>
      <FormSection
        title="Role Selection"
        description="Choose the appropriate role for this user"
      >
        <div className="role-tiles">
          {roles.map((role) => (
            <RoleTile
              key={role.value}
              title={role.title}
              subtitle={role.subtitle}
              icon={role.icon}
              value={role.value}
              isSelected={selectedRole === role.value}
              disabled={isRoleSelectionDisabled && selectedRole !== role.value}
              onClick={() => {
                onRoleSelect(role.value as IUserRole);
              }}
            />
          ))}
        </div>
      </FormSection>

      {selectedRole && (
        <FormSection
          title="Contact Information"
          description="Enter the essential contact details for the invitation"
        >
          <div className="form-fields">
            <FormField
              error={{
                msg: (formData.errors["inviteeEmail"] as string) || "",
                touched: formData.isTouched("inviteeEmail"),
              }}
            >
              <FormLabel htmlFor="inviteeEmail" label="Email Address *" />
              <FormInput
                required
                type="email"
                id="inviteeEmail"
                name="inviteeEmail"
                placeholder="Enter email address"
                value={formData.values.inviteeEmail}
                onChange={(e) => onFieldChange("inviteeEmail", e.target.value)}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (formData.errors["personalInfo.firstName"] as string) || "",
                touched: formData.isTouched("personalInfo.firstName"),
              }}
            >
              <FormLabel htmlFor="firstName" label="First Name *" />
              <FormInput
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.values.personalInfo.firstName}
                onChange={(e) =>
                  onFieldChange("personalInfo.firstName", e.target.value)
                }
                required
              />
            </FormField>
            <FormField
              error={{
                msg: (formData.errors["personalInfo.lastName"] as string) || "",
                touched: formData.isTouched("personalInfo.lastName"),
              }}
            >
              <FormLabel htmlFor="lastName" label="Last Name *" />
              <FormInput
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.values.personalInfo.lastName}
                onChange={(e) =>
                  onFieldChange("personalInfo.lastName", e.target.value)
                }
                required
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (formData.errors["personalInfo.phoneNumber"] as string) || "",
                touched: formData.isTouched("personalInfo.phoneNumber"),
              }}
            >
              <FormLabel htmlFor="phoneNumber" label="Phone Number" />
              <FormInput
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="+1 (555) 123-4567"
                value={formData.values.personalInfo.phoneNumber || ""}
                onChange={(e) =>
                  onFieldChange("personalInfo.phoneNumber", e.target.value)
                }
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField>
              <Checkbox
                id="showInviteMessage"
                name="showInviteMessage"
                label="Add personal message to invitation"
                checked={showInviteMessage}
                onChange={(e) => onShowInviteMessageToggle(e.target.checked)}
              />
            </FormField>
          </div>

          {showInviteMessage && (
            <div className="form-fields">
              <FormField
                error={{
                  msg:
                    (formData.errors["metadata.inviteMessage"] as string) || "",
                  touched: formData.isTouched("metadata.inviteMessage"),
                }}
              >
                <FormLabel htmlFor="inviteMessage" label="Personal Message" />
                <TextArea
                  id="inviteMessage"
                  name="inviteMessage"
                  rows={5}
                  placeholder="Add a personal message to the invitation (optional)"
                  value={formData.values.metadata?.inviteMessage || ""}
                  onChange={(e: any) => {
                    onFieldChange("metadata.inviteMessage", e.target.value);
                    onMessageCountChange(e.target.value.length);
                  }}
                  maxLength={500}
                />
                <small style={{ color: "#7d8da1", fontSize: "12px" }}>
                  {messageCount}/500 characters
                </small>
              </FormField>
            </div>
          )}
        </FormSection>
      )}
    </>
  );
};
