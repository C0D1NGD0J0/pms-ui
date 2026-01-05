import React from "react";
import { TableColumn, Table } from "@components/Table";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface ProjectData {
  id: string;
  project: string;
  property: string;
  date: string;
  status: "completed" | "in-progress" | "available";
  amount: string;
}

interface VendorProjectsTabProps {
  vendor: VendorDetailResponse;
}

export const ProjectsTab: React.FC<VendorProjectsTabProps> = ({ vendor }) => {
  // Prepare project data for the Table component
  const projectData: ProjectData[] =
    vendor.tasks && vendor.tasks.length > 0
      ? vendor.tasks.slice(0, 5).map((task: any, index: number) => ({
          id: `project-${index}`,
          project: task.title || `Project ${index + 1}`,
          property: task.property || "Various Properties",
          date: task.date || "Recent",
          status: task.status === "completed" ? "completed" : "in-progress",
          amount: task.amount || "Contact for Quote",
        }))
      : [
          {
            id: "project-default",
            project: "General Maintenance Projects",
            property: "Various Properties",
            date: "Ongoing",
            status: "available" as const,
            amount: "Contact for Quote",
          },
        ];

  // Define table columns for projects
  const projectColumns: TableColumn<ProjectData>[] = [
    {
      title: "Project",
      dataIndex: "project",
      render: (project: string) => <strong>{project}</strong>,
    },
    {
      title: "Property",
      dataIndex: "property",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: ProjectData["status"]) => {
        const statusConfig = {
          completed: { className: "completed", label: "Completed" },
          "in-progress": { className: "in-progress", label: "In Progress" },
          available: { className: "completed", label: "Available" },
        };
        const config = statusConfig[status];
        return (
          <span className={`status-badge ${config.className}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: string) => <span className="price">{amount}</span>,
    },
  ];

  return (
    <div className="projects-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Project History
      </h3>
      <Table
        columns={projectColumns}
        dataSource={projectData}
        rowKey="id"
        pagination={false}
        tableVariant="default"
      />
    </div>
  );
};

ProjectsTab.displayName = "ProjectsTab";
