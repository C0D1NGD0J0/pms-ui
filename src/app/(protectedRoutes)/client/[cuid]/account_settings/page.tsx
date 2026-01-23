"use client";

import React, { useState, use } from "react";
import { Loading } from "@components/Loading";
import { Button } from "@src/components/FormElements";
import { withClientAccess } from "@hooks/permissionHOCs";
import { PageHeader } from "@components/PageElements/Header";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

import { AccountTabs } from "./components/AccountTabs";
import { AccountOverview } from "./components/AccountOverview";
import { useGetClientDetails, useClientForm } from "./hook/index";

function AccountPage({ params }: { params: Promise<{ cuid: string }> }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const permissions = useUnifiedPermissions();
  const { cuid } = use(params);
  const {
    data: clientInfo,
    isLoading,
    isError,
  } = useGetClientDetails(cuid || "");

  const {
    saveStatus,
    triggerManualSave,
    isManuallySaving,
    form: clientForm,
    hasUnsavedChanges,
    revertChanges,
  } = useClientForm({
    clientData: clientInfo ?? ({} as any),
    cuid: cuid || "",
  });

  if (isLoading) {
    return <Loading description="Loading client details..." size="regular" />;
  }

  if (isError || !clientInfo) {
    return (
      <Loading description="Unable to fetch client details" size="regular" />
    );
  }

  const handleSave = async () => {
    try {
      await triggerManualSave();
      setIsEditMode(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      revertChanges();
    }
    setIsEditMode(false);
  };

  return (
    <div className="page client-account">
      <PageHeader
        title="Account Settings"
        headerBtn={
          <div className="flex-row">
            {isEditMode ? (
              <>
                <Button
                  label="Cancel"
                  onClick={handleCancel}
                  className="btn-outline"
                  icon={<i className="bx bx-x"></i>}
                  disabled={isManuallySaving}
                />
                <Button
                  label={
                    isManuallySaving
                      ? "Saving..."
                      : saveStatus.hasUnsavedChanges
                        ? "Save Changes"
                        : "Save"
                  }
                  onClick={handleSave}
                  className="btn-primary"
                  icon={
                    isManuallySaving ? (
                      <i className="bx bx-loader-alt bx-spin"></i>
                    ) : (
                      <i className="bx bx-save"></i>
                    )
                  }
                  disabled={isManuallySaving || !saveStatus.hasUnsavedChanges}
                />
              </>
            ) : (
              permissions.isAdmin && (
                <Button
                  label="Edit"
                  onClick={() => setIsEditMode(true)}
                  className="btn-grow btn-primary"
                  icon={<i className="bx bx-pencil"></i>}
                />
              )
            )}
          </div>
        }
      />

      {isEditMode && (
        <div className="save-status-bar">
          {saveStatus.isAutoSaving && (
            <span className="save-status auto-saving">
              <i className="bx bx-loader-alt bx-spin"></i>
              Auto-saving...
            </span>
          )}
          {saveStatus.lastAutoSave && !saveStatus.isAutoSaving && (
            <span className="save-status auto-saved">
              <i className="bx bx-check"></i>
              Auto-saved at {saveStatus.lastAutoSave.toLocaleTimeString()}
            </span>
          )}
          {saveStatus.hasUnsavedChanges && (
            <span className="save-status pending">
              <i className="bx bx-time"></i>
              Unsaved changes
            </span>
          )}
        </div>
      )}

      <AccountOverview
        accountStats={{
          isVerified: clientInfo.isVerified,
          planName: clientInfo.subscription?.planName,
          totalUsers: clientInfo.clientStats.totalUsers,
          totalProperties: clientInfo.clientStats.totalProperties,
        }}
      />
      <AccountTabs
        inEditMode={!isEditMode}
        clientForm={clientForm}
        clientInfo={clientInfo}
      />
    </div>
  );
}

export default withClientAccess(AccountPage);
