import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";

interface VendorUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
  avatar?: string;
}

interface VendorUsersTabProps {
  // In the future, this could accept vendor data to get real users
}

export const VendorUsersTab: React.FC<VendorUsersTabProps> = () => {
  // Static vendor users data (can be replaced with real data later)
  const vendorUsersData: VendorUserData[] = [
    {
      id: "user-1",
      name: "Mike Rodriguez",
      email: "mike.rodriguez@acmeplumbing.com",
      phone: "(555) 123-4567",
      role: "Lead Technician",
      status: "active",
      joinDate: "2023-01-15",
      avatar: undefined,
    },
    {
      id: "user-2",
      name: "Sarah Johnson",
      email: "sarah.johnson@acmeplumbing.com",
      phone: "(555) 234-5678",
      role: "Service Coordinator",
      status: "active",
      joinDate: "2023-03-20",
      avatar: undefined,
    },
    {
      id: "user-3",
      name: "David Chen",
      email: "david.chen@acmeplumbing.com",
      phone: "(555) 345-6789",
      role: "Field Supervisor",
      status: "active",
      joinDate: "2022-11-08",
      avatar: undefined,
    },
    {
      id: "user-4",
      name: "Lisa Martinez",
      email: "lisa.martinez@acmeplumbing.com",
      phone: "(555) 456-7890",
      role: "Junior Technician",
      status: "inactive",
      joinDate: "2024-02-12",
      avatar: undefined,
    },
    {
      id: "user-5",
      name: "Robert Wilson",
      email: "robert.wilson@acmeplumbing.com",
      phone: "(555) 567-8901",
      role: "Operations Manager",
      status: "active",
      joinDate: "2022-05-30",
      avatar: undefined,
    },
  ];

  // Define table columns for vendor users
  const vendorUserColumns: TableColumn<VendorUserData>[] = [
    {
      title: "User",
      dataIndex: "name",
      render: (name: string, record: VendorUserData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "hsl(194, 66%, 24%)",
              color: "hsl(0, 0%, 100%)",
              borderRadius: "50%",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            {record.avatar ? (
              <img
                src={record.avatar}
                alt={name}
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
          </div>
          <div>
            <strong>{name}</strong>
            <div style={{ fontSize: "0.9rem", color: "hsl(213, 14%, 56%)" }}>
              {record.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "email",
      render: (email: string, record: VendorUserData) => (
        <div>
          <div>{email}</div>
          <div style={{ fontSize: "0.9rem", color: "hsl(213, 14%, 56%)" }}>
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: VendorUserData["status"]) => {
        const statusConfig = {
          active: { className: "completed", label: "Active" },
          inactive: { className: "danger", label: "Inactive" },
        };
        const config = statusConfig[status];
        return (
          <span className={`status-badge ${config.className}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      render: (joinDate: string) => {
        const date = new Date(joinDate);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id: string, record: VendorUserData) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            className="btn btn-sm btn-outline-primary"
            label="Profile"
            icon={<i className="bx bx-user"></i>}
            onClick={() => console.log(`View profile ${record.name}`)}
          />
          <Button
            className="btn btn-sm btn-outline-secondary"
            label="Message"
            icon={<i className="bx bx-message"></i>}
            onClick={() => console.log(`Message ${record.name}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="users-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Team Members ({vendorUsersData.length})
      </h3>
      <Table
        columns={vendorUserColumns}
        dataSource={vendorUsersData}
        rowKey="id"
        pagination={false}
        tableVariant="default"
      />
    </div>
  );
};

VendorUsersTab.displayName = "VendorUsersTab";
