import React from "react";
import { TableColumn, Table } from "@components/Table";

import { EmployeeDetail } from "../../hooks/useGetEmployee";

interface EmployeePropertiesTabProps {
  employee: EmployeeDetail;
}

export const EmployeePropertiesTab: React.FC<EmployeePropertiesTabProps> = ({
  employee,
}) => {
  const { properties } = employee;

  const columns: TableColumn<typeof properties[0]>[] = [
    {
      title: "Property Name",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "Location", 
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Units",
      dataIndex: "units", 
      key: "units",
    },
    {
      title: "Occupancy",
      dataIndex: "occupancy",
      key: "occupancy",
      render: (value: string, record) => {
        const rate = record.occupancyRate;
        const colorClass = rate >= 95 ? 'success' : rate >= 90 ? 'warning' : 'muted';
        return <span className={`status ${colorClass}`}>{value}</span>;
      },
    },
    {
      title: "Since",
      dataIndex: "since",
      key: "since",
    },
  ];

  return (
    <div className="employee-properties">
      <h3 className="tab-section-title">Managed Properties</h3>
      <Table
        columns={columns}
        dataSource={properties}
        rowKey="id"
        pagination={false}
        className="employee-properties-table"
      />
    </div>
  );
};

EmployeePropertiesTab.displayName = 'EmployeePropertiesTab';