"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FilteredUser } from "@interfaces/user.interface";
import { PageHeader } from "@components/PageElements/Header";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
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

  // Compute department statistics from real employee data
  const departmentStats = useMemo(() => {
    return aggregateEmployeesByDepartment(employees);
  }, [employees]);

  // Generate dynamic colors for the legend
  const legendColors = useMemo(() => {
    return generateLegendColors(departmentStats.length);
  }, [departmentStats.length]);

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
            <Panel variant="default">
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
              </PanelContent>
            </Panel>

            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Top Employee Performance" }} />
              <PanelContent>
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
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>
      </div>
    </div>
  );
}
