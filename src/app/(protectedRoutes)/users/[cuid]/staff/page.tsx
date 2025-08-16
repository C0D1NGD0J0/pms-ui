"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InsightCard } from "@components/Cards";
import { Button } from "@components/FormElements";
import { Breadcrumb } from "@components/Breadcrumb";
import { invitationService } from "@services/invite";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { FilteredUser } from "@interfaces/user.interface";
import { PageHeader } from "@components/PageElements/Header";
import { IInvitationFormData } from "@interfaces/invitation.interface";

import { useGetEmployees } from "./hooks";
import { AddEmployeeModal } from "./components/AddEmployeeModal";
import { EmployeeTableView } from "./components/EmployeeTableView";

interface StaffPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function StaffPage({ params }: StaffPageProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { message } = useNotification();

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

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
    setIsAddEmployeeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddEmployeeModalOpen(false);
  };

  const handleSubmitEmployeeInvite = async (
    data: Partial<IInvitationFormData>
  ) => {
    try {
      setIsSubmittingInvite(true);
      await invitationService.sendInvite(cuid, data);

      message.success("Employee invitation sent successfully!");
      setIsAddEmployeeModalOpen(false);

      // Refresh the employee list (this will refetch the data)
      queryClient.invalidateQueries({ queryKey: [`/employees/${cuid}`, cuid] });
    } catch (error: any) {
      console.error("Failed to send employee invitation:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to send employee invitation. Please try again."
      );
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const headerButtons = (
    <div className="flex-row">
      <Button
        label="Add new employee"
        className="btn btn-primary"
        onClick={handleAddNewEmployee}
        icon={<i className={`bx bx-plus-circle`}></i>}
      />
    </div>
  );

  return (
    <div className="page-container">
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
              period: "this quarter",
            }}
          />

          <InsightCard
            title="Task Completion"
            value="92%"
            icon={<i className="bx bx-task"></i>}
            trend={{
              value: "4%",
              direction: "up",
              period: "vs last month",
            }}
          />

          <InsightCard
            title="Avg. Response Time"
            value="4.2 hrs"
            icon={<i className="bx bx-time"></i>}
            trend={{
              value: "0.8 hrs",
              direction: "up",
              period: "improvement",
            }}
          />

          <InsightCard
            title="Properties per Manager"
            value="8.5"
            icon={<i className="bx bx-building-house"></i>}
            trend={{
              value: "1.2",
              direction: "down",
              period: "vs last year",
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

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployeeInvite}
        isSubmitting={isSubmittingInvite}
      />
    </div>
  );
}
