import React from "react";
import { TableColumn, Table } from "@components/Table";
import { EmployeeDetailResponse } from "@interfaces/user.interface";

interface EmployeePerformanceTabProps {
  employee: EmployeeDetailResponse;
}

export const EmployeePerformanceTab: React.FC<EmployeePerformanceTabProps> = ({
  employee,
}) => {
  const { employeeInfo } = employee;
  const { performance } = employeeInfo;

  // Mock monthly trends data since it's not in the interface
  const mockMonthlyTrends = [
    { month: 'Jan 2024', tasksCompleted: 15, avgResponseTime: '2.3 hrs', tenantRating: '4.8/5', performanceScore: 92 },
    { month: 'Feb 2024', tasksCompleted: 18, avgResponseTime: '2.1 hrs', tenantRating: '4.9/5', performanceScore: 94 },
    { month: 'Mar 2024', tasksCompleted: 12, avgResponseTime: '2.8 hrs', tenantRating: '4.6/5', performanceScore: 89 }
  ];

  const trendColumns: TableColumn<typeof mockMonthlyTrends[0]>[] = [
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
        dataSource={mockMonthlyTrends}
        rowKey="month"
        pagination={false}
        className="performance-trend-table"
      />
    </div>
  );
};

EmployeePerformanceTab.displayName = 'EmployeePerformanceTab';