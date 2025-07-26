"use client";
import { useAuth } from "@store/index";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  useGetInvitations,
} from "./hooks";

const InviteUsers: React.FC = () => {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const { confirm } = useNotification();
  const { client } = useAuth();
  const router = useRouter();

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
      validateCsv: (file: File) => invitationService.validateInvitationCsv(client?.cuid || "", file),
      processCsv: (processId: string) => invitationService.processValidatedCsv(client?.cuid || "", processId),
    },
  };

  const onSubmit = (values: InvitationFormValues) => {
    handleSubmit(values);
    formBase.resetForm();
  };

  const onSaveDraft = (values: InvitationFormValues) => {
    values = {
      ...values,
      status: "draft",
    };
    handleSubmit(values);
  };

  const onCancel = () => {
    confirm({
      title: "Are you sure?",
      message: "Any unsaved changes will be lost.",
      onConfirm: () => {
        router.refresh();
      },
      confirmText: "Yes, Cancel",
      cancelText: "Keep Editing",
      type: "warning",
    });
  };

  const onPreview = () => {
    handleShowPreview(formBase.invitationForm.values, formBase.selectedRole);
  };

  const queryClient = useQueryClient();
  const { message } = useNotification();

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
      return invitationService.resendInvitation(cuid, iuid, { iuid, customMessage });
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
          isSubmitting={isSubmitting}
        />
      )}

      <InvitationTableView
        cuid={client?.cuid || ""}
        invitations={invitations}
        onResend={handleResend}
        onRevoke={handleRevoke}
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
