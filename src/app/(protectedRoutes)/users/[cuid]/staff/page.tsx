"use client";

import { Panel } from "@components/Panel";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { Button } from "@components/FormElements";
import { invitationService } from "@services/invite";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { FilteredUser } from "@interfaces/user.interface";
import { AddUserModal } from "@components/UserManagement";
import { PageHeader } from "@components/PageElements/Header";
import { InsightCardList, InsightData } from "@components/Cards";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import {
  aggregateEmployeesByDepartment,
  generateLegendColors,
} from "@utils/employeeUtils";

import { useGetEmployees } from "./hooks";
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

  // Compute department statistics from real employee data
  const departmentStats = useMemo(() => {
    return aggregateEmployeesByDepartment(employees);
  }, [employees]);

  // Generate dynamic colors for the legend
  const legendColors = useMemo(() => {
    return generateLegendColors(departmentStats.length);
  }, [departmentStats.length]);

  // Define insight data for the cards
  const insightData: InsightData[] = [
    {
      title: "Total Employees",
      value: totalCount,
      icon: <i className="bx bx-id-card"></i>,
      trend: {
        value: "2",
        direction: "up",
        period: "this quarter",
      },
    },
    {
      title: "Task Completion",
      value: "92%",
      icon: <i className="bx bx-task"></i>,
      trend: {
        value: "4%",
        direction: "up",
        period: "vs last month",
      },
    },
    {
      title: "Avg. Response Time",
      value: "4.2 hrs",
      icon: <i className="bx bx-time"></i>,
      trend: {
        value: "0.8 hrs",
        direction: "up",
        period: "improvement",
      },
    },
    {
      title: "Properties per Manager",
      value: "8.5",
      icon: <i className="bx bx-building-house"></i>,
      trend: {
        value: "1.2",
        direction: "down",
        period: "vs last year",
      },
    },
  ];

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
      queryClient.invalidateQueries({
        queryKey: ["/clients/filtered-users/employees", cuid],
      });
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

        <InsightCardList insights={insightData} />

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

        <div className="flex-row">
          <div className="panels">
            <Panel variant="alt-2">
              <div className="panel-header">
                <div className="panel-header__title">
                  <h4>Employee Department Distribution</h4>
                </div>
              </div>
              <div className="panel-content">
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <div className="chart-container">
                      {departmentStats.length > 0 ? (
                        <DonutChart
                          data={departmentStats}
                          height={300}
                          showTotal={true}
                          showTooltip={true}
                        />
                      ) : (
                        <div className="empty-chart-state">
                          <p>No department data available</p>
                        </div>
                      )}
                    </div>
                    <div className="chart-legend">
                      {departmentStats.map((dept, index) => (
                        <div key={dept.name} className="legend-item">
                          <span
                            className="legend-color"
                            style={{ backgroundColor: legendColors[index] }}
                          ></span>
                          <span>
                            {dept.name} ({dept.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Employee Performance Panel */}
            <Panel variant="alt-2">
              <div className="panel-header">
                <div className="panel-header__title">
                  <h4>Top Employee Performance</h4>
                </div>
              </div>
              <div className="panel-content">
                <div className="chart-container">
                  <HorizontalBarChart
                    data={[
                      { name: "Sarah Johnson", value: 4.9 },
                      { name: "Mike Rodriguez", value: 4.7 },
                      { name: "Emily Davis", value: 4.5 },
                      { name: "James Wilson", value: 4.3 },
                      { name: "Lisa Anderson", value: 4.1 },
                    ]}
                    height={300}
                    valueKey="value"
                    nameKey="name"
                    showAxis={true}
                  />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddUserModal
        userType="employee"
        isOpen={isAddEmployeeModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployeeInvite}
        isSubmitting={isSubmittingInvite}
      />
    </div>
  );
}
