"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@components/Breadcrumb";
import { InsightCard } from "@components/Cards";
import { Button } from "@components/FormElements";
import { PageHeader } from "@components/PageElements/Header";
import { FilteredUser } from "@interfaces/user.interface";
import { EmployeeTableView } from "./components/EmployeeTableView";
import { useGetEmployees } from "./hooks";

interface StaffPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function StaffPage({ params }: StaffPageProps) {
  const { cuid } = React.use(params);
  const router = useRouter();

  const {
    employees,
    sortOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetEmployees(cuid);

  const handleEditEmployee = (employee: FilteredUser) => {
    console.log("Edit employee:", employee);
    // TODO: Implement edit employee modal/form
  };

  const handleViewEmployeeDetails = (employee: FilteredUser) => {
    router.push(`/users/${cuid}/staff/${employee.id}`);
  };

  const handleToggleEmployeeStatus = (
    employeeId: string,
    isActive: boolean
  ) => {
    console.log("Toggle employee status:", employeeId, isActive);
    // TODO: Implement employee status toggle
  };

  const handleAddNewEmployee = () => {
    console.log("Add new employee");
    // TODO: Implement add new employee modal/form
  };

  const headerButtons = (
    <div className="flex-row">
      <Button
        label="Add new employee"
        className="btn btn-primary"
        onClick={handleAddNewEmployee}
        icon={<i className={`bx bx-plus-circle`}></i>}
      />
      <Button
        label="Import employee list"
        className="btn btn-secondary"
        onClick={() => console.log("Import employees")}
        icon={<i className={`bx bx-import`}></i>}
      />
    </div>
  );

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: "Staff", href: `/users/${cuid}/staff` },
  ];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="page add-users-page">
        <PageHeader title="Employee Management" headerBtn={headerButtons} />

        <div className="insights">
          <InsightCard
            title="Total Employees"
            value={totalCount}
            icon={<i className="bx bx-id-card"></i>}
            trend={{
              value: "2",
              direction: "up",
              period: "this quarter"
            }}
          />

          <InsightCard
            title="Task Completion"
            value="92%"
            icon={<i className="bx bx-task"></i>}
            trend={{
              value: "4%",
              direction: "up",
              period: "vs last month"
            }}
          />

          <InsightCard
            title="Avg. Response Time"
            value="4.2 hrs"
            icon={<i className="bx bx-time"></i>}
            trend={{
              value: "0.8 hrs",
              direction: "up",
              period: "improvement"
            }}
          />

          <InsightCard
            title="Properties per Manager"
            value="8.5"
            icon={<i className="bx bx-building-house"></i>}
            trend={{
              value: "1.2",
              direction: "down",
              period: "vs last year"
            }}
          />
        </div>

        {/* Main Employee Table */}
        <EmployeeTableView
          employees={employees}
          filterOptions={sortOptions}
          handlePageChange={handlePageChange}
          handleSortByChange={handleSortByChange}
          handleSortChange={handleSortChange}
          isLoading={isLoading}
          onEdit={handleEditEmployee}
          onToggleStatus={handleToggleEmployeeStatus}
          onViewDetails={handleViewEmployeeDetails}
          pagination={pagination}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}