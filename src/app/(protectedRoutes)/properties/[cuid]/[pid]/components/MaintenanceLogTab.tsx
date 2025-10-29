import React from "react";
import { MaintenanceRecord, MaintenanceTable } from "@components/Property";

const maintenanceData: MaintenanceRecord[] = [
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

export function MaintenanceLogTab() {
  const handleViewDetails = (id: string) => {
    console.log("View details for:", id);
  };

  return (
    <MaintenanceTable
      viewType="landlord"
      data={maintenanceData}
      onViewDetails={handleViewDetails}
    />
  );
}
