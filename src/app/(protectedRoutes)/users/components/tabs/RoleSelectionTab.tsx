"use client";
import React from "react";
import { RoleTile } from "@components/RoleTile";
import { FormSection } from "@components/FormLayout";
import { Textarea, Checkbox } from "@components/FormElements";
import { FormInput, FormLabel, FormField } from "@components/FormElements";
import {
  IInvitationFormData,
  IUserRole,
} from "@interfaces/invitation.interface";

interface RoleSelectionTabProps {
  formData: IInvitationFormData;
  selectedRole: IUserRole | null;
  messageCount: number;
  showInviteMessage: boolean;
  onRoleSelect: (role: IUserRole) => void;
  onFieldChange: (field: string, value: any) => void;
  onMessageCountChange: (count: number) => void;
  onShowInviteMessageToggle: (show: boolean) => void;
}

export const RoleSelectionTab: React.FC<RoleSelectionTabProps> = ({
  formData,
  selectedRole,
  messageCount,
  showInviteMessage,
  onRoleSelect,
  onFieldChange,
  onMessageCountChange,
  onShowInviteMessageToggle,
}) => {
  const roles = [
    {
      value: "EMPLOYEE",
      title: "Employee",
      subtitle: "STAFF MEMBER",
      icon: "bx bx-id-card",
    },
    {
      value: "VENDOR",
      title: "Vendor",
      subtitle: "SERVICE PROVIDER",
      icon: "bx bx-building",
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
              onClick={() => onRoleSelect(role.value as IUserRole)}
            />
          ))}
        </div>
      </FormSection>

      {/* Basic Information appears after role selection */}
      {selectedRole && (
        <FormSection
          title="Contact Information"
          description="Enter the essential contact details for the invitation"
        >
          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="inviteeEmail" label="Email Address *" />
              <FormInput
                id="inviteeEmail"
                type="email"
                name="inviteeEmail"
                placeholder="Enter email address"
                value={formData.inviteeEmail}
                onChange={(e) => onFieldChange("inviteeEmail", e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="firstName" label="First Name *" />
              <FormInput
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.personalInfo.firstName}
                onChange={(e) =>
                  onFieldChange("personalInfo.firstName", e.target.value)
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
                value={formData.personalInfo.lastName}
                onChange={(e) =>
                  onFieldChange("personalInfo.lastName", e.target.value)
                }
                required
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField>
              <FormLabel htmlFor="phoneNumber" label="Phone Number" />
              <FormInput
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="+1 (555) 123-4567"
                value={formData.personalInfo.phoneNumber || ""}
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
              <FormField>
                <FormLabel htmlFor="inviteMessage" label="Personal Message" />
                <Textarea
                  id="inviteMessage"
                  name="inviteMessage"
                  rows={5}
                  placeholder="Add a personal message to the invitation (optional)"
                  value={formData.metadata?.inviteMessage || ""}
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
