import React from 'react';
import { TableColumn, Table } from '@components/Table';

interface PerformanceMetrics {
  taskCompletionRate: string;
  satisfaction: string;
  occupancyRate?: string;
  responseTime: string;
  qualityRating?: string;
}

interface MonthlyPerformance {
  id: string;
  month: string;
  tasksCompleted: number;
  responseTime: string;
  rating: string;
  performanceScore: string;
}

interface PerformanceTabProps {
  userType: 'employee' | 'vendor';
  metrics: PerformanceMetrics;
  monthlyData: MonthlyPerformance[];
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  userType,
  metrics,
  monthlyData
}) => {
  const getMetricCards = () => {
    if (userType === 'employee') {
      return [
        { label: 'Task Completion Rate', value: metrics.taskCompletionRate },
        { label: 'Tenant Satisfaction', value: metrics.satisfaction },
        { label: 'Avg Occupancy Rate', value: metrics.occupancyRate || 'N/A' },
        { label: 'Avg Response Time', value: metrics.responseTime }
      ];
    } else {
      return [
        { label: 'Service Completion Rate', value: metrics.taskCompletionRate },
        { label: 'Client Satisfaction', value: metrics.satisfaction },
        { label: 'Quality Rating', value: metrics.qualityRating || 'N/A' },
        { label: 'Avg Response Time', value: metrics.responseTime }
      ];
    }
  };

  const columns: TableColumn<MonthlyPerformance>[] = [
    {
      title: 'Month',
      dataIndex: 'month'
    },
    {
      title: userType === 'employee' ? 'Tasks Completed' : 'Jobs Completed',
      dataIndex: 'tasksCompleted'
    },
    {
      title: 'Avg Response Time',
      dataIndex: 'responseTime'
    },
    {
      title: userType === 'employee' ? 'Tenant Rating' : 'Client Rating',
      dataIndex: 'rating'
    },
    {
      title: 'Performance Score',
      dataIndex: 'performanceScore',
      render: (value: string) => {
        const score = parseInt(value.replace('%', ''));
        const color = score >= 90 ? 'hsl(130, 100%, 37%)' : 'hsl(39, 73%, 49%)';
        return <strong style={{ color }}>{value}</strong>;
      }
    }
  ];

  return (
    <div className="performance-tab">
      <h3 style={{ marginBottom: '1.5rem', color: 'hsl(194, 66%, 24%)' }}>
        Performance Metrics
      </h3>
      
      <div className="performance-grid">
        {getMetricCards().map((metric, index) => (
          <div key={index} className="performance-card">
            <span className="performance-value">{metric.value}</span>
            <span className="performance-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'hsl(194, 66%, 24%)' }}>
        Monthly Performance Trend
      </h4>
      
      <Table<MonthlyPerformance>
        columns={columns}
        dataSource={monthlyData}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};