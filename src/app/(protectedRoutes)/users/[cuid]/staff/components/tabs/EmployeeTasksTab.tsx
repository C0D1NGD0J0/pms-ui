import React from "react";
import { TableColumn, Table } from "@components/Table";
import { PriorityBadge, StatusBadge } from "@components/Badge";
import { EmployeeDetailResponse } from "@interfaces/user.interface";

interface EmployeeTasksTabProps {
  employee: EmployeeDetailResponse;
}

export const EmployeeTasksTab: React.FC<EmployeeTasksTabProps> = ({
  employee,
}) => {
  const { tasks } = employee;

  const columns: TableColumn<typeof tasks[0]>[] = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (value: 'high' | 'medium' | 'low') => (
        <PriorityBadge priority={value} size="small" />
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: 'in-progress' | 'pending' | 'completed') => (
        <StatusBadge status={value} variant="text" size="small">
          {value === 'in-progress' ? 'In Progress' : 
           value === 'pending' ? 'Pending' : 'Completed'}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="employee-tasks">
      <h3 className="tab-section-title">Active Tasks & Tickets</h3>
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={false}
        className="employee-tasks-table"
      />
    </div>
  );
};

EmployeeTasksTab.displayName = 'EmployeeTasksTab';