"use client";

import { Icon } from "@components/Icon";
import { Loading } from "@components/Loading";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, use } from "react";
import { withClientAccess } from "@hooks/permissionHOCs";
import { Button, Modal } from "@src/components/FormElements";
import { PageHeader } from "@components/PageElements/Header";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  useSSENotificationActions,
  useSSENotifications,
} from "@store/sseNotification.store";

import { AccountTabs } from "./components/AccountTabs";
import { AccountOverview } from "./components/AccountOverview";
import { useGetClientDetails, useClientForm } from "./hook/index";

function AccountPage({ params }: { params: Promise<{ cuid: string }> }) {
  const queryClient = useQueryClient();
  const permissions = useUnifiedPermissions();
  const { cuid } = use(params);
  const { subscriptionInfo } = useSSENotifications();
  const { closePaymentModal } = useSSENotificationActions();

  // Lifted state for active tab
  const [activeTab, setActiveTab] = useState("profile");

  const { showPaymentModal, paymentStatus, paymentMessage } = subscriptionInfo;

  useEffect(() => {
    if (showPaymentModal && paymentStatus === "success") {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["clientInfo"] });
    }
  }, [showPaymentModal, paymentStatus, queryClient]);
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
    hasTabErrors,
  } = useClientForm({
    clientData: clientInfo ?? ({} as any),
    cuid: cuid || "",
  });

  // Tabs that use the form and need save/cancel buttons
  const FORM_TABS = ["profile", "identification", "company", "preferences"];

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
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      revertChanges();
    }
  };

  return (
    <div className="page client-account">
      <PageHeader title="Account Settings" />

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

      <AccountOverview
        accountStats={{
          isVerified: clientInfo.isVerified,
          planName: clientInfo.subscription?.planName,
          totalUsers: clientInfo.clientStats.totalUsers,
          totalProperties: clientInfo.clientStats.totalProperties,
        }}
      />
      <AccountTabs
        inEditMode={false}
        clientForm={clientForm}
        clientInfo={clientInfo}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasTabErrors={hasTabErrors}
      />

      {permissions.isAdmin && FORM_TABS.includes(activeTab) && (
        <div className="btn-group">
          <Button
            label="Cancel"
            onClick={handleCancel}
            className="btn-outline"
            icon={<i className="bx bx-x"></i>}
            disabled={isManuallySaving || !hasUnsavedChanges}
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
            disabled={!clientForm.isValid() || isManuallySaving || !saveStatus.hasUnsavedChanges}
          />
        </div>
      )}

      {/* Payment Status Modal */}
      {showPaymentModal && (
        <Modal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          title={
            paymentStatus === "success"
              ? "Payment Successful!"
              : paymentStatus === "failed"
                ? "Payment Failed"
                : "Payment Canceled"
          }
        >
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Icon
              name={
                paymentStatus === "success" ? "bx-check-circle" : "bx-x-circle"
              }
              size="4rem"
              color={
                paymentStatus === "success"
                  ? "var(--success-color)"
                  : "var(--warning-color)"
              }
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ marginBottom: "1rem" }}>
              {paymentStatus === "success"
                ? "Payment Processed Successfully"
                : paymentStatus === "failed"
                  ? "Payment Failed"
                  : "Payment Was Not Completed"}
            </h3>
            <p style={{ marginBottom: "2rem" }}>
              {paymentMessage ||
                (paymentStatus === "success"
                  ? "Your payment has been processed. Your subscription has been updated."
                  : "Your payment was not completed. You can retry anytime from this page.")}
            </p>
            <Button
              label="Close"
              className="btn-primary"
              onClick={closePaymentModal}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default withClientAccess(AccountPage);
