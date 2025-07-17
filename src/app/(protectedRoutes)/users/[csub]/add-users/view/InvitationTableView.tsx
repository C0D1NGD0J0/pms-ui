"use client";
import { Panel } from "@components/Panel";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { IInvitationTableData } from "@interfaces/invitation.interface";

interface InvitationTableViewProps {
  invitations: IInvitationTableData[];
  onResend: (iuid: string) => void;
  onRevoke: (iuid: string) => void;
}

export const InvitationTableView: React.FC<InvitationTableViewProps> = ({
  invitations,
  onResend,
  onRevoke,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Table columns for invitations
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
      render: (_, record) => (
        <div className="table-actions">
          <Button
            label="Resend"
            className="btn-sm btn-outline"
            onClick={() => onResend(record.iuid)}
          />
          <Button
            label="Revoke"
            className="btn-sm btn-danger"
            onClick={() => onRevoke(record.iuid)}
          />
        </div>
      ),
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
  };

  return (
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
              placeholder: "Search by name or email...",
              onChange: handleSearchChange,
            }}
            filterOpts={{
              value: filterValue,
              options: [
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Accepted", value: "accepted" },
                { label: "Expired", value: "expired" },
                { label: "Revoked", value: "revoked" },
              ],
              onFilterChange: handleFilterChange,
            }}
            tableVariant="alt-2"
          />
        </Panel>
      </div>
    </div>
  );
};
