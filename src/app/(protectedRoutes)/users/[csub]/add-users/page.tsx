"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { PageHeader } from "@components/PageElements";
import { useNotification } from "@hooks/useNotification";
import { IInvitationTableData } from "@interfaces/invitation.interface";
import { CsvUploadConfig, CsvUploadModal } from "@components/CsvUploadModal";

import { useInvitationPreview, useInvitationForm } from "./hook";
import { InvitationPreview } from "../../components/InvitationPreview";
import {
  InvitationPreviewModal,
  InvitationTableView,
  InvitationFormView,
} from "./view";

const InvitePage: React.FC = () => {
  const [invitations] = useState<IInvitationTableData[]>([]);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const router = useRouter();
  const { confirm } = useNotification();

  const { handleSubmit, handleSaveDraft, isSubmitting, isSavingDraft } =
    useInvitationForm();
  const {
    showPreview,
    handleShowPreview,
    handleClosePreview,
    getTemplateVariables,
  } = useInvitationPreview();

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

  const csvUploadConfig: CsvUploadConfig = {
    title: "Upload User Invitations via CSV",
    description:
      "Upload a CSV file containing user invitation information. The file should include the following columns: inviteeEmail, role, firstName, lastName and optionally phoneNumber, inviteMessage, expectedStartDate, cuid.",
    templateUrl: "/templates/user-invitation.csv",
    templateName: "Download CSV Template",
    validateEndpoint: "/api/invitations/csv/validate",
    processEndpoint: "/api/invitations/csv/process",
    showPreview: true,
    columns: [
      {
        name: "inviteeEmail",
        description: "Valid email address",
        required: true,
      },
      {
        name: "role",
        description: "EMPLOYEE, VENDOR, TENANT, LANDLORD, or ADMIN",
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
  };

  const onSubmit = (values: any) => {
    handleSubmit(values);
  };

  const onSaveDraft = (values: any) => {
    handleSaveDraft(values);
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
    handleShowPreview();
  };

  const handleResend = (iuid: string) => {
    console.log("Resend:", iuid);
  };

  const handleRevoke = (iuid: string) => {
    console.log("Revoke:", iuid);
  };

  return (
    <div className="page add-users-page">
      <PageHeader
        title="Add Users"
        headerBtn={
          <div className="flex-row">
            <Button
              label="Upload CSV"
              className="btn-outline"
              icon={<i className="bx bx-upload"></i>}
              onClick={handleOpenCSVModal}
            />
            <Button
              label="Send Invitation"
              className="btn-primary"
              icon={<i className="bx bx-send"></i>}
              onClick={() => onSubmit({})}
              disabled={isSubmitting || isSavingDraft}
            />
          </div>
        }
      />

      <InvitationFormView
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
        onCancel={onCancel}
        onPreview={onPreview}
        isSubmitting={isSubmitting}
        isSavingDraft={isSavingDraft}
      />

      <InvitationTableView
        invitations={invitations}
        onResend={handleResend}
        onRevoke={handleRevoke}
      />

      <InvitationPreviewModal
        isOpen={showPreview}
        onClose={handleClosePreview}
        formData={{} as any}
        selectedRole={null}
        templateVariables={getTemplateVariables({} as any, null)}
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

export default InvitePage;
