"use client";

import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { Loading } from "@src/components/Loading";
import { Button } from "@components/FormElements";
import { ChartContainer } from "@components/Charts";
import { invitationService } from "@services/invite";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { withClientAccess } from "@hooks/permissionHOCs";
import { generateLegendColors } from "@utils/employeeUtils";
import { PageHeader } from "@components/PageElements/Header";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { DeactivateUserModal, AddUserModal } from "@components/UserManagement";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useGetUserStats } from "../../shared-hooks";
import { EmployeeTableView } from "./components/EmployeeTableView";
import { useReconnectEmployee, useRemoveEmployee, useGetEmployees } from "./hooks";

interface StaffPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

function StaffPage({ params }: StaffPageProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { message } = useNotification();

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const {
    employees,
    sortOptions,
    pagination,
    totalCount,
    handleSortDirectionChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetEmployees(cuid);
  const permission = useUnifiedPermissions();

  const { stats, isLoading: statsLoading } = useGetUserStats(cuid, {
    role: ["staff", "manager"],
  });

  const departmentStats = useMemo(() => {
    return stats?.departmentDistribution || [];
  }, [stats?.departmentDistribution]);

  const legendColors = useMemo(() => {
    return generateLegendColors(departmentStats.length);
  }, [departmentStats.length]);

  const roleDistribution = useMemo(() => {
    return stats?.roleDistribution || [];
  }, [stats?.roleDistribution]);

  const handleEditEmployee = (employee: FilteredUserTableData) => {
    router.push(`/users/${cuid}/user-edit/${employee.uid}?type=employee`);
  };

  const handleViewEmployeeDetails = (employee: FilteredUserTableData) => {
    router.push(`/users/${cuid}/staff/${employee.uid}`);
  };

  const removeEmployeeMutation = useRemoveEmployee(
    cuid,
    selectedEmployee?.uid || ""
  );
  const reconnectEmployeeMutation = useReconnectEmployee(
    cuid,
    selectedEmployee?.uid || ""
  );

  const handleDeactivateEmployee = (employee: FilteredUserTableData) => {
    setSelectedEmployee({
      uid: employee.uid,
      name: employee.fullName || employee.displayName || employee.email,
    });
    setShowDeactivateModal(true);
  };

  const handleReconnectEmployee = async (employee: FilteredUserTableData) => {
    setSelectedEmployee({
      uid: employee.uid,
      name: employee.fullName || employee.displayName || employee.email,
    });
    try {
      await reconnectEmployeeMutation.mutateAsync();
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to reconnect employee:", error);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedEmployee) return;

    try {
      await removeEmployeeMutation.mutateAsync();
      setShowDeactivateModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to remove employee:", error);
      setShowDeactivateModal(false);
    }
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
    setSelectedEmployee(null);
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

      // Refresh the employee list
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
        className="btn btn-success"
        onClick={handleAddNewEmployee}
        icon={<i className="bx bx-plus-circle"></i>}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page add-users-page">
        <PageHeader title="Employee Management" headerBtn={headerButtons} />
        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <EmployeeTableView
                employees={employees}
                filterOptions={sortOptions}
                handlePageChange={handlePageChange}
                handleSortByChange={handleSortByChange}
                handleSortDirectionChange={handleSortDirectionChange}
                isLoading={isLoading}
                onEdit={handleEditEmployee}
                onDeactivate={handleDeactivateEmployee}
                onReconnect={handleReconnectEmployee}
                onViewDetails={handleViewEmployeeDetails}
                pagination={pagination}
                totalCount={totalCount}
                permissions={permission}
              />
            </Panel>
          </PanelsWrapper>
        </div>

        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <PanelHeader
                header={{ title: "Employee Department Distribution" }}
              />
              <PanelContent>
                {statsLoading ? (
                  <Loading description="Loading stats..." />
                ) : (
                  <div className="analytics-cards">
                    <div className="analytics-card">
                      <ChartContainer
                        type="donut"
                        data={departmentStats}
                        height={300}
                        colors={legendColors}
                        chartProps={{
                          donutchart: { showTotal: true, showTooltip: true },
                        }}
                        showLegend={true}
                        legend={departmentStats.map((dept, index) => ({
                          name: dept.name,
                          color: legendColors[index],
                          percentage: dept.percentage,
                        }))}
                        emptyStateMessage="No department data available"
                        emptyStateIcon={<i className="bx bx-building"></i>}
                      />
                    </div>
                  </div>
                )}
              </PanelContent>
            </Panel>

            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Employee Role Distribution" }} />
              <PanelContent>
                {statsLoading ? (
                  <Loading description="Loading stats..." />
                ) : (
                  <div className="analytics-cards">
                    <div className="analytics-card">
                      <ChartContainer
                        type="verticalBar"
                        data={roleDistribution}
                        height={300}
                        chartProps={{
                          barChart: {
                            valueKey: "value",
                            nameKey: "name",
                            showAxis: true,
                            showGrid: true,
                          },
                        }}
                        emptyStateMessage="No role data available"
                        emptyStateIcon={<i className="bx bx-user-voice"></i>}
                      />
                    </div>
                  </div>
                )}
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>
      </div>

      <AddUserModal
        userType="employee"
        isOpen={isAddEmployeeModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployeeInvite}
        isSubmitting={isSubmittingInvite}
      />

      <DeactivateUserModal
        isOpen={showDeactivateModal}
        userName={selectedEmployee?.name || ""}
        userType="employee"
        onClose={handleCancelDeactivate}
        onConfirm={handleConfirmDeactivate}
        isSubmitting={removeEmployeeMutation.isPending}
      />
    </div>
  );
}

export default withClientAccess(StaffPage);
