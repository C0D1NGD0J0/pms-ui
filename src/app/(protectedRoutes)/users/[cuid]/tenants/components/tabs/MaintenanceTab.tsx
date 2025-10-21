import React from "react";
import { TableColumn, Table } from "@components/Table";

interface MaintenanceRequest {
  requestId: string;
  date: Date;
  type: string;
  status: "pending" | "in_progress" | "completed";
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface MaintenanceTabProps {
  tenant: any;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ tenant }) => {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Access maintenance requests from nested tenantInfo
  const maintenanceRequests: MaintenanceRequest[] =
    tenant.tenantInfo?.maintenanceRequests || [];

  const totalRequests = tenant.tenantMetrics?.totalMaintenanceRequests || 0;
  const completedRequests = maintenanceRequests.filter(
    (r) => r.status === "completed"
  ).length;
  const inProgressRequests = maintenanceRequests.filter(
    (r) => r.status === "in_progress"
  ).length;
  const pendingRequests = maintenanceRequests.filter(
    (r) => r.status === "pending"
  ).length;

  const maintenanceColumns: TableColumn<MaintenanceRequest>[] = [
    {
      title: "Request",
      dataIndex: "type",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">{record.type}</div>
          <div className="table-secondary-text">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority: string) => {
        const priorityConfig: Record<
          string,
          { className: string; label: string }
        > = {
          urgent: { className: "danger", label: "Urgent" },
          high: { className: "danger", label: "High" },
          medium: { className: "warning", label: "Medium" },
          low: { className: "success", label: "Low" },
        };
        const config = priorityConfig[priority] || {
          className: "default",
          label: priority,
        };
        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusConfig: Record<
          string,
          { className: string; label: string }
        > = {
          completed: { className: "success", label: "Completed" },
          in_progress: { className: "warning", label: "In Progress" },
          pending: { className: "default", label: "Pending" },
        };
        const config = statusConfig[status] || {
          className: "default",
          label: status,
        };
        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
    {
      title: "Request Date",
      dataIndex: "date",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Request ID",
      dataIndex: "requestId",
      render: (id: string) => (
        <code style={{ fontSize: "12px", color: "#666" }}>{id}</code>
      ),
    },
  ];

  const maintenanceMetrics = [
    { label: "Total Requests", value: totalRequests },
    { label: "Completed", value: completedRequests },
    { label: "In Progress", value: inProgressRequests },
    { label: "Pending", value: pendingRequests },
  ];

  return (
    <div className="user-detail-tab">
      <h3 className="detail-section-title">Maintenance Overview</h3>
      <div className="metrics-grid">
        {maintenanceMetrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <h3 className="detail-section-title">Maintenance Requests</h3>
      {maintenanceRequests.length > 0 ? (
        <Table
          columns={maintenanceColumns}
          dataSource={maintenanceRequests}
          rowKey="requestId"
          pagination={false}
          tableVariant="default"
        />
      ) : (
        <div className="detail-empty-state">
          <i className="bx bx-wrench"></i>
          <p>No maintenance requests</p>
          <p>
            Maintenance requests will appear here once they are created.
          </p>
        </div>
      )}
    </div>
  );
};

MaintenanceTab.displayName = "MaintenanceTab";
