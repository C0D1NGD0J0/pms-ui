import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";

export interface MaintenanceRecord {
  id: string;
  date?: string;
  dateSubmitted?: string;
  issue: string;
  priority: string;
  status: string;
  cost?: string;
  contractor?: string;
  lastUpdate?: string;
}

export interface MaintenanceTableProps {
  viewType: "landlord" | "tenant";
  data: MaintenanceRecord[];
  onAddRequest?: () => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export function MaintenanceTable({
  viewType,
  data,
  onAddRequest,
  onViewDetails,
  className = "",
}: MaintenanceTableProps) {
  // Define columns based on view type
  const getColumns = (): TableColumn<MaintenanceRecord>[] => {
    const baseColumns: TableColumn<MaintenanceRecord>[] = [
      {
        title: viewType === "landlord" ? "Date" : "Date Submitted",
        dataIndex: viewType === "landlord" ? "date" : "dateSubmitted",
      },
      { title: "Issue", dataIndex: "issue" },
      { title: "Priority", dataIndex: "priority", isStatus: true },
      { title: "Status", dataIndex: "status", isStatus: true },
    ];

    // Add landlord-specific columns
    if (viewType === "landlord") {
      baseColumns.push(
        { title: "Cost", dataIndex: "cost" },
        { title: "Contractor", dataIndex: "contractor" }
      );
    } else {
      // Add tenant-specific columns
      baseColumns.push({ title: "Last Update", dataIndex: "lastUpdate" });
    }

    // Add actions column
    baseColumns.push({
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record: MaintenanceRecord) => (
        <Button
          key={`action-${record.id}`}
          className="btn btn-sm btn-outline"
          label={viewType === "landlord" ? "Details" : "View Details"}
          onClick={() => onViewDetails?.(record.id)}
        />
      ),
    });

    return baseColumns;
  };

  return (
    <div className={`maintenance-table ${className}`}>
      <Table dataSource={data} columns={getColumns()} pagination={true} />
    </div>
  );
}
