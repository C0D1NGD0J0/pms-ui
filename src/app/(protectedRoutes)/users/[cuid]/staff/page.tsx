"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChartContainer } from "@components/Charts";
import { FilteredUser } from "@interfaces/user.interface";
import { PageHeader } from "@components/PageElements/Header";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
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

  const departmentStats = useMemo(() => {
    return aggregateEmployeesByDepartment(employees);
  }, [employees]);

  const legendColors = useMemo(() => {
    return generateLegendColors(departmentStats.length);
  }, [departmentStats.length]);

  // Compute role distribution from real employee data
  const roleDistribution = useMemo(() => {
    const roleMap = new Map<string, number>();

    employees.forEach((employee) => {
      employee.roles.forEach((role) => {
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
        roleMap.set(capitalizedRole, (roleMap.get(capitalizedRole) || 0) + 1);
      });
    });

    return Array.from(roleMap.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, [employees]);

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

  return (
    <div className="page-container">
      <div className="page add-users-page">
        <PageHeader title="Employee Management" />
        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
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
            </Panel>
          </PanelsWrapper>
        </div>

        {/* Analytics Section */}
        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <PanelHeader
                header={{ title: "Employee Department Distribution" }}
              />
              <PanelContent>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <ChartContainer
                      type="donut"
                      data={departmentStats}
                      height={300}
                      colors={legendColors}
                      chartProps={{
                        showTotal: true,
                        showTooltip: true,
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
              </PanelContent>
            </Panel>

            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Employee Role Distribution" }} />
              <PanelContent>
                <ChartContainer
                  type="verticalBar"
                  data={roleDistribution}
                  height={300}
                  chartProps={{
                    valueKey: "value",
                    nameKey: "name",
                    showAxis: true,
                    showGrid: true,
                  }}
                  emptyStateMessage="No role data available"
                  emptyStateIcon={<i className="bx bx-user-voice"></i>}
                />
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>
      </div>
    </div>
  );
}
