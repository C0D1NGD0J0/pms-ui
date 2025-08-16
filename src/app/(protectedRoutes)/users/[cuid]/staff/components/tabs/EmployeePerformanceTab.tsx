import React from "react";
import { TableColumn, Table } from "@components/Table";

import { EmployeeDetail } from "../../hooks/useGetEmployee";

interface EmployeePerformanceTabProps {
  employee: EmployeeDetail;
}

export const EmployeePerformanceTab: React.FC<EmployeePerformanceTabProps> = ({
  employee,
}) => {
  const { performance } = employee;

  const trendColumns: TableColumn<typeof performance.monthlyTrends[0]>[] = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Tasks Completed",
      dataIndex: "tasksCompleted",
      key: "tasksCompleted",
    },
    {
      title: "Avg Response Time",
      dataIndex: "avgResponseTime",
      key: "avgResponseTime",
    },
    {
      title: "Tenant Rating",
      dataIndex: "tenantRating",
      key: "tenantRating",
    },
    {
      title: "Performance Score",
      dataIndex: "performanceScore",
      key: "performanceScore",
      render: (value: number) => {
        const colorClass = value >= 90 ? 'success' : value >= 85 ? 'warning' : 'muted';
        return <strong className={`${colorClass}`}>{value}%</strong>;
      },
    },
  ];

  return (
    <div className="employee-performance">
      <h3 className="tab-section-title">Performance Metrics</h3>
      
      <div className="performance-grid">
        <div className="performance-card">
          <span className="performance-value">{performance.taskCompletionRate}</span>
          <span className="performance-label">Task Completion Rate</span>
        </div>
        <div className="performance-card">
          <span className="performance-value">{performance.tenantSatisfaction}</span>
          <span className="performance-label">Tenant Satisfaction</span>
        </div>
        <div className="performance-card">
          <span className="performance-value">{performance.avgOccupancyRate}</span>
          <span className="performance-label">Avg Occupancy Rate</span>
        </div>
        <div className="performance-card">
          <span className="performance-value">{performance.avgResponseTime}</span>
          <span className="performance-label">Avg Response Time</span>
        </div>
      </div>

      <h4 className="performance-trend-title">Monthly Performance Trend</h4>
      
      <Table
        columns={trendColumns}
        dataSource={performance.monthlyTrends}
        rowKey="month"
        pagination={false}
        className="performance-trend-table"
      />
    </div>
  );
};

EmployeePerformanceTab.displayName = 'EmployeePerformanceTab';