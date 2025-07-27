"use client";
import { useAuth } from "@store/index";
import React, { useState } from "react";
import { Button } from "@components/FormElements";
import { invitationService } from "@services/invite";
import { PageHeader } from "@components/PageElements";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CsvUploadConfig, CsvUploadModal } from "@components/CsvUploadModal";
import { InvitationFormValues } from "@src/validations/invitation.validations";

import { InvitationPreview } from "../components/InvitationPreview";
import {
  InvitationPreviewModal,
  InvitationTableView,
  InvitationFormView,
} from "./view";
import {
  useInvitationFormBase,
  useInvitationPreview,
  useInvitationForm,
  useInvitationEdit,
  useGetInvitations,
} from "./hooks";

const InviteUsers: React.FC = () => {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [editingInvitation, setEditingInvitation] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { confirm, message } = useNotification();
  const queryClient = useQueryClient();
  const { client } = useAuth();

  const {
    filterOptions,
    invitations,
    totalCount,
    pagination,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
  } = useGetInvitations(client.cuid);

  const { handleSubmit, isSubmitting } = useInvitationForm();
  const { handleUpdate, isUpdating } = useInvitationEdit();

  const {
    showPreview,
    handleShowPreview,
    handleClosePreview,
    getRenderedEmailContent,
    isTemplateLoading,
    templateError,
  } = useInvitationPreview();
  const formBase = useInvitationFormBase();

  const handleOpenCSVModal = () => {
    setIsCSVModalOpen(true);
  };

  const handleCloseCSVModal = () => {
    setIsCSVModalOpen(false);
    setCsvPreviewData([]);
  };

  const handlePreviewData = (data: any[]) => {
    setCsvPreviewData(data);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const csvUploadConfig: CsvUploadConfig = {
    title: "Upload User Invitations via CSV",
    description:
      "Upload a CSV file containing user invitation information. The file should include the following columns: inviteeEmail, role, firstName, lastName and optionally phoneNumber, inviteMessage, expectedStartDate, cuid.",
    templateUrl: "/templates/user-invitation.csv",
    templateName: "Download CSV Template",
    showPreview: true,
    columns: [
      {
        name: "inviteeEmail",
        description: "Valid email address",
        required: true,
      },
      {
        name: "role",
        description: "manager, vendor, tenant, staff, or admin",
        required: true,
      },
      {
        name: "firstName",
        description: "User's first name (2-50 characters)",
        required: true,
      },
      {
        name: "lastName",
        description: "User's last name (2-50 characters)",
        required: true,
      },
      {
        name: "phoneNumber",
        description: "Phone number (10-20 digits)",
        required: false,
      },
      {
        name: "inviteMessage",
        description: "Custom message (max 500 chars)",
        required: false,
      },
      {
        name: "expectedStartDate",
        description: "Date in YYYY-MM-DD or MM/DD/YYYY format",
        required: false,
      },
      {
        name: "cuid",
        description: "Client unique identifier",
        required: false,
      },
    ],
    serviceMethods: {
      validateCsv: (file: File) =>
        invitationService.validateInvitationCsv(client?.cuid || "", file),
      processCsv: (processId: string) =>
        invitationService.processValidatedCsv(client?.cuid || "", processId),
    },
  };

  const onSubmit = (values: InvitationFormValues) => {
    if (isEditMode && editingInvitation) {
      handleUpdate(editingInvitation.iuid, values).then(() => {
        setIsEditMode(false);
        setEditingInvitation(null);
        setIsFormVisible(false);
        formBase.resetForm();
      });
    } else {
      handleSubmit(values);
      formBase.resetForm();
    }
  };

  const onSaveDraft = (values: InvitationFormValues) => {
    const draftValues = {
      ...values,
      status: "draft" as const,
    };

    if (isEditMode && editingInvitation) {
      handleUpdate(editingInvitation.iuid, draftValues).then(() => {
        setIsEditMode(false);
        setEditingInvitation(null);
        setIsFormVisible(false);
        formBase.resetForm();
      });
    } else {
      handleSubmit(draftValues);
      formBase.resetForm();
    }
  };

  const onCancel = () => {
    const hasChanges = isEditMode || formBase.invitationForm.isDirty();

    if (hasChanges) {
      confirm({
        title: "Are you sure?",
        message: "Any unsaved changes will be lost.",
        onConfirm: () => {
          if (isEditMode) {
            setIsEditMode(false);
            setEditingInvitation(null);
          }
          setIsFormVisible(false);
          formBase.resetForm();
        },
        confirmText: "Yes, Cancel",
        cancelText: "Keep Editing",
        type: "warning",
      });
    } else {
      if (isEditMode) {
        setIsEditMode(false);
        setEditingInvitation(null);
      }
      setIsFormVisible(false);
      formBase.resetForm();
    }
  };

  const onPreview = () => {
    handleShowPreview(formBase.invitationForm.values, formBase.selectedRole);
  };

  const resendMutation = useMutation({
    mutationFn: ({
      iuid,
      cuid,
      customMessage,
    }: {
      iuid: string;
      cuid: string;
      customMessage?: string;
    }) => {
      setLoadingItemId(iuid);
      return invitationService.resendInvitation(cuid, iuid, {
        iuid,
        customMessage,
      });
    },
    onSuccess: () => {
      message.success("Invitation resent successfully");
      setLoadingItemId(null);
      queryClient.invalidateQueries({
        queryKey: [`/invitations/${client?.cuid}`, client?.cuid],
      });
    },
    onError: (error: any) => {
      setLoadingItemId(null);
      message.error(
        error?.response?.data?.message || "Failed to resend invitation"
      );
    },
  });

  const revokeMutation = useMutation({
    mutationFn: ({
      cuid,
      iuid,
      reason,
    }: {
      iuid: string;
      reason: string;
      cuid: string;
    }) => {
      setLoadingItemId(iuid);
      console.log("Revoke mutation called with:", { cuid, iuid, reason });
      return invitationService.revokeInvitation(cuid, iuid, { reason });
    },
    onSuccess: () => {
      message.success("Invitation revoked successfully");
      setLoadingItemId(null);
      queryClient.invalidateQueries({
        queryKey: [`/invitations/${client?.cuid}`, client?.cuid],
      });
    },
    onError: (error: any) => {
      setLoadingItemId(null);
      message.error(
        error?.response?.data?.message || "Failed to revoke invitation"
      );
    },
  });

  const handleResend = (cuid: string, iuid: string, customMessage?: string) => {
    resendMutation.mutate({ cuid, iuid, customMessage });
  };

  const handleRevoke = (cuid: string, iuid: string, reason: string) => {
    revokeMutation.mutate({ cuid, iuid, reason });
  };

  const handleEdit = (invitation: any) => {
    setEditingInvitation(invitation);
    setIsEditMode(true);
    setIsFormVisible(true);

    formBase.handleRoleSelect(invitation.role);
    formBase.invitationForm.setValues({
      inviteeEmail: invitation.inviteeEmail,
      role: invitation.role,
      status: invitation.status,
      personalInfo: {
        firstName: invitation.personalInfo?.firstName || "",
        lastName: invitation.personalInfo?.lastName || "",
        phoneNumber: invitation.personalInfo?.phoneNumber || "",
      },
      metadata: {
        inviteMessage: invitation.metadata?.inviteMessage || "",
      },
      employeeInfo: invitation.employeeInfo || {},
      vendorInfo: invitation.vendorInfo || {},
    });

    formBase.setActiveTab("details");
  };

  return (
    <div className="page add-users-page">
      <PageHeader
        title="Invite users"
        headerBtn={
          <div className="flex-row">
            <Button
              label={isFormVisible ? "Hide Form" : "Invite User"}
              className="btn-outline"
              icon={
                <i
                  className={`bx ${isFormVisible ? "bx-hide" : "bx-group"}`}
                ></i>
              }
              onClick={toggleFormVisibility}
            />
            <Button
              label="Upload users list"
              className="btn-outline"
              icon={<i className="bx bx-upload"></i>}
              onClick={handleOpenCSVModal}
            />
          </div>
        }
      />

      {isFormVisible && (
        <InvitationFormView
          onSubmit={onSubmit}
          formBase={formBase}
          onCancel={onCancel}
          onPreview={onPreview}
          onSaveDraft={onSaveDraft}
          isSubmitting={isEditMode ? isUpdating : isSubmitting}
        />
      )}

      <InvitationTableView
        cuid={client?.cuid || ""}
        invitations={invitations}
        onResend={handleResend}
        onRevoke={handleRevoke}
        onEdit={handleEdit}
        filterOptions={filterOptions}
        totalCount={totalCount}
        pagination={pagination}
        handleSortChange={handleSortChange}
        handlePageChange={handlePageChange}
        handleSortByChange={handleSortByChange}
        isResending={resendMutation.isPending}
        isRevoking={revokeMutation.isPending}
        loadingItemId={loadingItemId || undefined}
      />

      <InvitationPreviewModal
        isOpen={showPreview}
        error={templateError}
        onClose={handleClosePreview}
        isLoading={isTemplateLoading}
        formData={formBase.invitationForm.values}
        renderContent={getRenderedEmailContent()}
      />

      <CsvUploadModal
        isOpen={isCSVModalOpen}
        onClose={handleCloseCSVModal}
        config={csvUploadConfig}
        onPreviewData={handlePreviewData}
      />

      {csvPreviewData.length > 0 && <InvitationPreview data={csvPreviewData} />}
    </div>
  );
};

export default InviteUsers;
