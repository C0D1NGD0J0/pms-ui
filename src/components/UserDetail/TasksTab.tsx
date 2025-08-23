import React from 'react';
import { TableColumn, Table } from '@components/Table';

interface Task {
  id: string;
  title: string;
  property: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface TasksTabProps {
  userType: 'employee' | 'vendor';
  tasks: Task[];
}

export const TasksTab: React.FC<TasksTabProps> = ({
  userType,
  tasks
}) => {
  const renderPriorityBadge = (priority: string) => {
    const badgeClass = `priority-badge ${priority}`;
    return <span className={badgeClass}>{priority}</span>;
  };

  const renderStatusBadge = (status: string) => {
    const badgeClass = `status-badge ${status}`;
    return <span className={badgeClass}>{status}</span>;
  };

  const columns: TableColumn<Task>[] = [
    {
      title: userType === 'employee' ? 'Task' : 'Work Order',
      dataIndex: 'title',
      render: (value: string) => <strong>{value}</strong>
    },
    {
      title: 'Property',
      dataIndex: 'property'
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: renderPriorityBadge
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: renderStatusBadge
    }
  ];

  const title = userType === 'employee' 
    ? 'Active Tasks & Tickets' 
    : 'Active Work Orders & Requests';

  return (
    <div className="tasks-tab">
      <h3 style={{ marginBottom: '1.5rem', color: 'hsl(194, 66%, 24%)' }}>
        {title}
      </h3>
      <Table<Task>
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};