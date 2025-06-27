import React from "react";
import { Table } from "@components/Table";
import { Button } from "@components/FormElements";

const maintenanceData = [
  {
    id: "1",
    date: "June 20, 2025",
    issue: "Leaky faucet in kitchen",
    priority: "Medium",
    status: "In Progress",
    cost: "$150",
    contractor: "ABC Plumbing",
  },
  {
    id: "2",
    date: "June 15, 2025",
    issue: "HVAC filter replacement",
    priority: "Low",
    status: "Completed",
    cost: "$45",
    contractor: "Johnson HVAC",
  },
  {
    id: "3",
    date: "June 10, 2025",
    issue: "Garage door repair",
    priority: "High",
    status: "Completed",
    cost: "$320",
    contractor: "Door Masters",
  },
  {
    id: "4",
    date: "May 28, 2025",
    issue: "Lawn maintenance",
    priority: "Low",
    status: "Completed",
    cost: "$85",
    contractor: "Green Lawns Inc",
  },
  {
    id: "5",
    date: "May 15, 2025",
    issue: "Dishwasher not draining",
    priority: "Medium",
    status: "Completed",
    cost: "$175",
    contractor: "Appliance Pros",
  },
];

const maintenanceColumns = [
  { title: "Date", dataIndex: "date" },
  { title: "Issue", dataIndex: "issue" },
  { title: "Priority", dataIndex: "priority", isStatus: true },
  { title: "Status", dataIndex: "status", isStatus: true },
  { title: "Cost", dataIndex: "cost" },
  { title: "Contractor", dataIndex: "contractor" },
  {
    title: "Actions",
    dataIndex: "actions",
    render: () => <Button className="btn btn-sm btn-outline" label="Details" />,
  },
];

export function MaintenanceLogTab() {
  return (
    <div className="maintenance-log">
      <Table
        dataSource={maintenanceData}
        columns={maintenanceColumns}
        pagination={true}
      />
      <div
        className="form-actions"
        style={{ marginTop: "1rem", justifyContent: "flex-end" }}
      >
        <Button
          className="btn btn-primary"
          label="Add Maintenance Request"
          icon={<i className="bx bx-plus"></i>}
        />
      </div>
    </div>
  );
}
