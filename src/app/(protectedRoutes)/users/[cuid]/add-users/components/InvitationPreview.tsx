"use client";
import React from "react";
import { TableColumn, Table } from "@components/Table";

interface InvitationPreviewProps {
  data: Array<{
    inviteeEmail: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteMessage?: string;
    expectedStartDate?: string;
    cuid?: string;
  }>;
  templateType?: string;
}

type InvitationData = InvitationPreviewProps["data"][0];

export function InvitationPreview({ data }: InvitationPreviewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "role-badge admin";
      case "staff":
        return "role-badge staff";
      case "manager":
        return "role-badge manager";
      case "vendor":
        return "role-badge vendor";
      case "tenant":
        return "role-badge tenant";
      default:
        return "role-badge";
    }
  };

  const columns: TableColumn<InvitationData>[] = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (_value, record) => (
        <div className="user-name">
          <strong>
            {record.firstName} {record.lastName}
          </strong>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "inviteeEmail",
      render: (value) => <div className="user-email">{value}</div>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (value) => (
        <span className={getRoleBadgeClass(value)}>{value}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (value) => <div className="user-phone">{value || "—"}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "expectedStartDate",
      render: (value) => <div className="start-date">{formatDate(value)}</div>,
    },
    {
      title: "Message",
      dataIndex: "inviteMessage",
      render: (value) => (
        <div className="invite-message">
          {value ? (
            <span title={value}>
              {value.length > 30 ? `${value.substring(0, 30)}...` : value}
            </span>
          ) : (
            "—"
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="preview-header">
        <h4>Preview: {data.length} Invitation(s) Ready to Send</h4>
        <p>Review the parsed data below before confirming.</p>
      </div>

      <div
        className="preview-table-container"
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #e8e8e8",
          backgroundColor: "white",
        }}
      >
        <Table<InvitationData>
          columns={columns}
          dataSource={data}
          rowKey="inviteeEmail"
          pagination={false}
          showRowNumbers={true}
          tableVariant="alt-2"
          maxHeight={data.length > 10 ? 300 : undefined}
        />
      </div>
    </div>
  );
}
