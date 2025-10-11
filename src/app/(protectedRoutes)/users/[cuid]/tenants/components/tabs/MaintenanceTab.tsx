import React from "react";
import { TableColumn, Table } from "@components/Table";
import { ITenantDetailInfo } from "@interfaces/user.interface";

interface MaintenanceRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  completedAt?: string;
  description: string;
}

interface MaintenanceTabProps {
  tenant: ITenantDetailInfo & { profile: any };
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ tenant }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const maintenanceRequests: MaintenanceRequest[] =
    tenant.maintenanceRequests || [];

  const maintenanceColumns: TableColumn<MaintenanceRequest>[] = [
    {
      title: "Request",
      dataIndex: "title",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">{record.title}</div>
          <div className="table-secondary-text">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority: string) => {
        const priorityConfig: Record<string, { className: string; label: string }> = {
          high: { className: "danger", label: "High" },
          medium: { className: "warning", label: "Medium" },
          low: { className: "success", label: "Low" },
        };
        const config = priorityConfig[priority] || { className: "default", label: priority };
        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusConfig: Record<string, { className: string; label: string }> = {
          completed: { className: "success", label: "Completed" },
          in_progress: { className: "warning", label: "In Progress" },
          pending: { className: "default", label: "Pending" },
        };
        const config = statusConfig[status] || { className: "default", label: status };
        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Completed",
      dataIndex: "completedAt",
      render: (date?: string) => (date ? formatDate(date) : "-"),
    },
  ];

  return (
    <div className="maintenance-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Maintenance Requests
      </h3>
      {maintenanceRequests.length > 0 ? (
        <Table
          columns={maintenanceColumns}
          dataSource={maintenanceRequests}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
      ) : (
        <div className="empty-state">
          <i className="bx bx-wrench" style={{ fontSize: "48px", color: "#ccc" }}></i>
          <p>No maintenance requests</p>
        </div>
      )}
    </div>
  );
};

MaintenanceTab.displayName = "MaintenanceTab";
