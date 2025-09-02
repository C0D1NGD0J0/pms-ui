import React from 'react';
import { TableColumn, Table } from '@components/Table';

interface Property {
  id: string;
  name: string;
  location: string;
  units: number;
  occupancy: string;
  since: string;
}

interface PropertiesTabProps {
  userType: 'employee' | 'vendor';
  properties: Property[];
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  userType,
  properties
}) => {
  const columns: TableColumn<Property>[] = [
    {
      title: 'Property Name',
      dataIndex: 'name',
      render: (value: string) => <strong>{value}</strong>
    },
    {
      title: 'Location',
      dataIndex: 'location'
    },
    {
      title: 'Units',
      dataIndex: 'units'
    },
    {
      title: 'Occupancy',
      dataIndex: 'occupancy',
      render: (value: string) => {
        const occupancyRate = parseInt(value.replace('%', ''));
        const color = occupancyRate >= 90 ? 'hsl(130, 100%, 37%)' : 'hsl(39, 73%, 49%)';
        return <span style={{ color }}>{value}</span>;
      }
    },
    {
      title: 'Since',
      dataIndex: 'since'
    }
  ];

  const title = userType === 'employee' ? 'Managed Properties' : 'Serviced Properties';

  return (
    <div className="properties-tab">
      <h3 style={{ marginBottom: '1.5rem', color: 'hsl(194, 66%, 24%)' }}>
        {title}
      </h3>
      <Table<Property>
        columns={columns}
        dataSource={properties}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};