"use client";
import { Panel } from "@components/Panel";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { IInvitationTableData } from "@interfaces/invitation.interface";

import { FilterOption } from "../hooks/useGetInvitations";
import { RevokeInvitationModal } from "./RevokeInvitationModal";
import { ResendInvitationModal } from "./ResendInvitationModal";

interface InvitationTableViewProps {
  invitations: IInvitationTableData[];
  onResend: (cuid: string, iuid: string, customMessage?: string) => void;
  onRevoke: (cuid: string, iuid: string, reason: string) => void;
  onEdit: (invitation: IInvitationTableData) => void;
  filterOptions: FilterOption[];
  totalCount: number;
  cuid: string;
  pagination: IPaginationQuery;
  handleSortChange: (sort: "asc" | "desc") => void;
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  isResending?: boolean;
  isRevoking?: boolean;
  loadingItemId?: string;
}

export const InvitationTableView: React.FC<InvitationTableViewProps> = ({
  cuid,
  invitations,
  onResend,
  onRevoke,
  onEdit,
  filterOptions,
  totalCount,
  pagination,
  handleSortChange,
  handlePageChange,
  handleSortByChange,
  isResending = false,
  isRevoking = false,
  loadingItemId,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [revokeModal, setRevokeModal] = useState<{
    isOpen: boolean;
    invitation: IInvitationTableData | null;
  }>({ isOpen: false, invitation: null });
  const [resendModal, setResendModal] = useState<{
    isOpen: boolean;
    invitation: IInvitationTableData | null;
  }>({ isOpen: false, invitation: null });

  const canEditInvitation = (status: string) => {
    return status === "draft";
  };

  const canRevokeInvitation = (status: string) => {
    return status === "draft";
  };

  const canResendInvitation = (status: string) => {
    return ["draft", "revoked"].includes(status);
  };

  const handleRevokeClick = (record: IInvitationTableData) => {
    if (!canRevokeInvitation(record.status)) return;
    setRevokeModal({ isOpen: true, invitation: record });
  };

  const handleResendClick = (record: IInvitationTableData) => {
    if (!canResendInvitation(record.status)) return;
    setResendModal({ isOpen: true, invitation: record });
  };

  const closeRevokeModal = () => {
    setRevokeModal({ isOpen: false, invitation: null });
  };

  const closeResendModal = () => {
    setResendModal({ isOpen: false, invitation: null });
  };

  const invitationColumns: TableColumn<IInvitationTableData>[] = [
    {
      title: "Recipient",
      dataIndex: "inviteeFullName",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">{record.inviteeFullName}</div>
          <div className="table-secondary-text">{record.inviteeEmail}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      isStatus: true,
    },
    {
      title: "Date Sent",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const canEdit = canEditInvitation(record.status);
        const canResend = canResendInvitation(record.status);
        const canRevoke = canRevokeInvitation(record.status);
        const isResendingThis = isResending && loadingItemId === record.iuid;
        const isRevokingThis = isRevoking && loadingItemId === record.iuid;

        return (
          <div className="table-actions">
            {record.status !== "revoked" && (
              <Button
                label="Edit"
                className={`btn-sm btn-primary ${
                  !canEdit ? "btn-disabled" : ""
                }`}
                onClick={() => onEdit(record)}
                disabled={!canEdit || isResendingThis || isRevokingThis}
                title={
                  !canEdit ? "Can only edit invitations with draft status" : ""
                }
              />
            )}

            <Button
              label="Resend"
              loading={isResendingThis}
              loadingText="Resending..."
              className={`btn-sm btn-outline ${
                !canResend ? "btn-disabled" : ""
              }`}
              onClick={() => handleResendClick(record)}
              disabled={!canResend || isResendingThis || isRevokingThis}
              title={
                !canResend
                  ? "Can only resend invitations with pending status"
                  : ""
              }
            />
            <Button
              label="Revoke"
              loading={isRevokingThis}
              loadingText="Revoking..."
              className={`btn-sm btn-danger ${
                !canRevoke ? "btn-disabled" : ""
              }`}
              onClick={() => handleRevokeClick(record)}
              disabled={!canRevoke || isResendingThis || isRevokingThis}
              title={
                !canRevoke
                  ? "Can only revoke invitations with draft, pending, or sent status"
                  : ""
              }
            />
          </div>
        );
      },
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const _onRevoke = (cuid: string, iuid: string, reason: string) => {
    if (revokeModal.invitation) {
      onRevoke(cuid, iuid, reason);
    }
    closeRevokeModal();
  };

  return (
    <>
      <div className="flex-row">
        <div className="panels">
          <Panel variant="alt-2">
            <Table
              columns={invitationColumns}
              dataSource={invitations}
              withHeader={true}
              headerTitle="Recent Invitations"
              searchOpts={{
                value: searchValue,
                isVisible: !!invitations.length,
                placeholder: "Search by name or email...",
                onChange: handleSearchChange,
              }}
              filterOpts={{
                value: pagination.sortBy ?? "",
                isVisible: !!invitations.length,
                options: filterOptions,
                onFilterChange: (value: string) => {
                  console.log("Filter changed:", value);
                  handleSortByChange(value);
                },
                sortDirection: pagination.sort,
                onSortDirectionChange: (sort: "asc" | "desc") => {
                  handleSortChange(sort);
                },
              }}
              pagination={{
                total: totalCount,
                current: pagination.page,
                pageSize: pagination.limit,
                onChange: (page: number) => {
                  handlePageChange(page);
                },
              }}
              tableVariant="alt-2"
              rowKey="iuid"
            />
          </Panel>
        </div>
      </div>

      <RevokeInvitationModal
        cuid={cuid}
        isOpen={revokeModal.isOpen}
        invitation={revokeModal.invitation}
        onClose={closeRevokeModal}
        onConfirm={_onRevoke}
      />

      <ResendInvitationModal
        cuid={cuid}
        isOpen={resendModal.isOpen}
        invitation={resendModal.invitation}
        onClose={closeResendModal}
        onConfirm={onResend}
      />
    </>
  );
};
