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

import { useInvitationFormBase } from "../hook";
import {
  VendorInvitationTab,
  EmployeeDetailsTab,
  RoleSelectionTab,
  ReviewTab,
} from "../../../components";

interface InvitationFormViewProps {
  onSubmit: (values: InvitationFormValues) => void;
  onSaveDraft: (values: InvitationFormValues) => void;
  onCancel: () => void;
  onPreview: () => void;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
}

export const InvitationFormView: React.FC<InvitationFormViewProps> = ({
  onSubmit,
  onSaveDraft,
  onCancel,
  onPreview,
  isSubmitting = false,
  isSavingDraft = false,
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
  } = useInvitationFormBase();

  // Tab configuration
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
          {selectedRole === "EMPLOYEE" && (
            <EmployeeDetailsTab
              formData={invitationForm.values as any}
              onFieldChange={handleFieldChange}
            />
          )}
          {selectedRole === "VENDOR" && (
            <VendorInvitationTab
              formData={invitationForm.values as any}
              messageCount={messageCount}
              onFieldChange={handleFieldChange}
              onMessageCountChange={handleMessageCountChange}
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
                defaultTab="role"
                onChange={handleTabChange}
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
            className="resource-form"
            onSubmit={invitationForm.onSubmit(handleFormSubmit)}
            disabled={isSubmitting || isSavingDraft}
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

            {/* Form Actions */}
            <div className="form-actions">
              <Button
                label="Cancel"
                className="btn-outline-ghost"
                onClick={onCancel}
                disabled={isSubmitting || isSavingDraft}
              />
              {invitationForm.isValid() && (
                <Button
                  label="Preview"
                  className="btn-outline"
                  icon={<i className="bx bx-show"></i>}
                  onClick={onPreview}
                  disabled={isSubmitting || isSavingDraft}
                />
              )}
              <Button
                label={isSavingDraft ? "Saving..." : "Save as Draft"}
                className="btn-outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting || isSavingDraft}
              />
              <Button
                type="submit"
                label={isSubmitting ? "Sending..." : "Send Invitation"}
                className="btn-primary"
                disabled={
                  !invitationForm.isValid() || isSubmitting || isSavingDraft
                }
              />
            </div>
          </Form>
        </Panel>
      </PanelsWrapper>
    </div>
  );
};
