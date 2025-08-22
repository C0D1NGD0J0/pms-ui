"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@src/components/Loading";
import { ChartContainer } from "@components/Charts";
import { usePermissions } from "@src/hooks/usePermissions";
import { generateLegendColors } from "@utils/employeeUtils";
import { PageHeader } from "@components/PageElements/Header";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useGetUserStats } from "@app/(protectedRoutes)/shared-hooks/useGetUserStats";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

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
  const permission = usePermissions();

  // Separate stats query that won't re-render charts on pagination changes
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
    console.log("Edit employee:", employee);
    // TODO: Implement edit employee modal/form
  };

  const handleViewEmployeeDetails = (employee: FilteredUserTableData) => {
    router.push(`/users/${cuid}/staff/${employee.uid}`);
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
                )}
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>
      </div>
    </div>
  );
}
