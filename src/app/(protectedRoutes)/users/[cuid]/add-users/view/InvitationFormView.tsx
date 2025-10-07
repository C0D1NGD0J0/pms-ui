"use client";
import React from "react";
import { Button, Form } from "@components/FormElements";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import { InvitationFormValues } from "@validations/invitation.validations";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useInvitationFormBase } from "../hooks";
import {
  VendorInvitationTab,
  EmployeeDetailsTab,
  TenantDetailsTab,
  RoleSelectionTab,
  ReviewTab,
} from "../components";

interface InvitationFormViewProps {
  onSubmit: (values: InvitationFormValues) => void;
  onSaveDraft: (values: InvitationFormValues) => void;
  onCancel: () => void;
  onPreview: () => void;
  isSubmitting?: boolean;
  formBase: ReturnType<typeof useInvitationFormBase>;
}

export const InvitationFormView: React.FC<InvitationFormViewProps> = ({
  onSubmit,
  onSaveDraft,
  onCancel,
  formBase,
  onPreview,
  isSubmitting = false,
}) => {
  const {
    activeTab,
    selectedRole,
    messageCount,
    showInviteMessage,
    invitationForm,
    hasTabErrors,
    isTabVisible,
    getTabLabel,
    handleTabChange,
    handleRoleSelect,
    handleFieldChange,
    handleMessageCountChange,
    handleShowInviteMessageToggle,
  } = formBase;

  const tabs = [
    {
      key: "role",
      tabLabel: getTabLabel("role"),
      isVisible: isTabVisible("role"),
      content: (
        <RoleSelectionTab
          formData={invitationForm.values as any}
          selectedRole={selectedRole}
          messageCount={messageCount}
          showInviteMessage={showInviteMessage}
          onRoleSelect={handleRoleSelect}
          onFieldChange={handleFieldChange}
          onMessageCountChange={handleMessageCountChange}
          onShowInviteMessageToggle={handleShowInviteMessageToggle}
        />
      ),
    },
    {
      key: "details",
      tabLabel: getTabLabel("details"),
      isVisible: isTabVisible("details"),
      content: (
        <>
          {selectedRole === "vendor" && (
            <VendorInvitationTab
              formData={invitationForm.values as any}
              messageCount={messageCount}
              onFieldChange={handleFieldChange}
              onMessageCountChange={handleMessageCountChange}
            />
          )}
          {selectedRole === "tenant" && (
            <TenantDetailsTab
              formData={invitationForm.values as any}
              onFieldChange={handleFieldChange}
            />
          )}
          {selectedRole &&
            selectedRole !== "vendor" &&
            selectedRole !== "tenant" && (
              <EmployeeDetailsTab
                formData={invitationForm.values as any}
                onFieldChange={handleFieldChange}
              />
            )}
        </>
      ),
    },
    {
      key: "review",
      tabLabel: getTabLabel("review"),
      isVisible: isTabVisible("review"),
      content: (
        <ReviewTab
          formData={invitationForm.values as any}
          selectedRole={selectedRole}
        />
      ),
    },
  ];

  const handleFormSubmit = (values: InvitationFormValues) => {
    onSubmit(values);
  };

  const handleSaveDraft = () => {
    onSaveDraft(invitationForm.values);
  };

  return (
    <div className="flex-row resource-form">
      <PanelsWrapper>
        <Panel>
          <PanelHeader
            headerTitleComponent={
              <TabContainer
                onChange={handleTabChange}
                defaultTab="role"
                mode="new"
              >
                <TabList>
                  {tabs
                    .filter((tab) => tab.isVisible)
                    .map((tab) => (
                      <TabListItem
                        key={tab.key}
                        id={tab.key}
                        label={tab.tabLabel}
                        hasError={hasTabErrors(tab.key)}
                      />
                    ))}
                </TabList>
              </TabContainer>
            }
          />

          <Form
            disabled={isSubmitting}
            className="resource-form"
            onSubmit={invitationForm.onSubmit(handleFormSubmit)}
          >
            {tabs.map((tab) => (
              <PanelContent
                key={tab.key}
                className={`tab-content ${
                  activeTab === tab.key ? "active" : ""
                }`}
              >
                {activeTab === tab.key && tab.content}
              </PanelContent>
            ))}

            <div className="form-actions">
              <Button
                label="Cancel"
                className="btn-outline-ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              />
              {invitationForm.isValid() && (
                <Button
                  label="Preview"
                  className="btn-outline"
                  icon={<i className="bx bx-show"></i>}
                  onClick={onPreview}
                  disabled={isSubmitting}
                />
              )}
              <Button
                type="submit"
                className="btn-outline"
                disabled={isSubmitting}
                onClick={invitationForm.onSubmit(handleSaveDraft)}
                label={isSubmitting ? "Saving..." : "Save as Draft"}
              />
              <Button
                type="submit"
                label={isSubmitting ? "Sending..." : "Send Invitation"}
                className="btn-primary"
                disabled={!invitationForm.isValid() || isSubmitting}
              />
            </div>
          </Form>
        </Panel>
      </PanelsWrapper>
    </div>
  );
};
