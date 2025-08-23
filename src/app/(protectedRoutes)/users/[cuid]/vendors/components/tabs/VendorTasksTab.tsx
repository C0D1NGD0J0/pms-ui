import React from "react";
import { TableColumn, Table } from "@components/Table";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorTasksTabProps {
  vendor: VendorDetailResponse;
}

interface TaskData {
  id: string;
  title: string;
  property: string;
  status: string;
  priority: string;
  dueDate: string;
  category: string;
  assignedTo?: string;
}

export const VendorTasksTab: React.FC<VendorTasksTabProps> = ({
  vendor,
}) => {
  // Mock task data with proper structure for the table
  const tasks = vendor.tasks || [];
  
  const taskData: TaskData[] = tasks.length > 0 
    ? tasks.map((task, index) => ({
        id: task.id || `task-${index}`,
        title: task.title || `Work Order ${index + 1}`,
        property: task.property || "Various Properties",
        status: task.status || "In Progress",
        priority: task.priority || "Medium",
        dueDate: task.dueDate 
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date",
        category: task.category || "Maintenance",
        assignedTo: task.assignedTo || "Vendor Team"
      }))
    : [
        {
          id: "task-1",
          title: "HVAC System Maintenance",
          property: "Building A - Unit 205",
          status: "In Progress",
          priority: "High",
          dueDate: new Date().toLocaleDateString(),
          category: "HVAC",
          assignedTo: "John Doe"
        },
        {
          id: "task-2", 
          title: "Plumbing Repair",
          property: "Building B - Unit 102",
          status: "Completed",
          priority: "Medium",
          dueDate: new Date(Date.now() - 86400000).toLocaleDateString(),
          category: "Plumbing",
          assignedTo: "Jane Smith"
        },
        {
          id: "task-3",
          title: "Electrical Inspection",
          property: "Building C - Common Area",
          status: "Pending",
          priority: "Low",
          dueDate: new Date(Date.now() + 172800000).toLocaleDateString(),
          category: "Electrical",
          assignedTo: "Mike Johnson"
        }
      ];

  const taskColumns: TableColumn<TaskData>[] = [
    {
      title: "Task",
      dataIndex: "title",
      render: (title: string, record: TaskData) => (
        <div>
          <strong>{title}</strong>
          <div style={{ fontSize: "0.9rem", color: "hsl(213, 14%, 56%)" }}>
            {record.category}
          </div>
        </div>
      ),
    },
    {
      title: "Property",
      dataIndex: "property",
    },
    {
      title: "Status",
      dataIndex: "status",
      isStatus: true,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority: string) => (
        <span className={`priority-badge ${priority.toLowerCase()}`}>
          {priority}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
    },
  ];

  return (
    <div className="vendor-tasks">
      <div className="tasks-header">
        <h4>Work Orders & Projects</h4>
        <div className="tasks-actions">
          <button className="btn btn-primary">
            <i className="bx bx-plus"></i>
            Create Work Order
          </button>
        </div>
      </div>

      <div className="tasks-content">
        <Table
          columns={taskColumns}
          dataSource={taskData}
          rowKey="id"
          pagination={true}
          tableVariant="default"
          withHeader={true}
          headerTitle="Work Orders & Projects"
          searchOpts={{
            isVisible: true,
            placeholder: "Search tasks...",
            value: "",
            onChange: (e) => console.log("Search:", e.target.value),
          }}
          filterOpts={{
            isVisible: true,
            value: "all",
            options: [
              { label: "All Tasks", value: "all" },
              { label: "Active", value: "active" },
              { label: "Completed", value: "completed" },
              { label: "Pending", value: "pending" },
            ],
            onFilterChange: (value) => console.log("Filter:", value),
            filterPlaceholder: "Filter by status",
          }}
        />
      </div>

      <div className="tasks-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <i className="bx bx-task"></i>
            </div>
            <div className="summary-content">
              <div className="summary-value">{taskData.length}</div>
              <div className="summary-label">Total Tasks</div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <i className="bx bx-loader"></i>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {taskData.filter(t => t.status.toLowerCase().includes('progress') || t.status.toLowerCase() === 'active').length}
              </div>
              <div className="summary-label">Active</div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <i className="bx bx-check-circle"></i>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {taskData.filter(t => t.status.toLowerCase() === 'completed').length}
              </div>
              <div className="summary-label">Completed</div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <i className="bx bx-time-five"></i>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {vendor.vendorInfo?.stats?.responseTime || 'N/A'}
              </div>
              <div className="summary-label">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorTasksTab.displayName = "VendorTasksTab";