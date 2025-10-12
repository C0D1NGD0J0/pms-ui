"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@src/components/Loading";
import { ChartContainer } from "@components/Charts";
import { PageHeader } from "@components/PageElements/Header";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  calculateLeaseDuration,
  generateLegendColors,
} from "@utils/tenantUtils";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useGetTenants } from "./hooks";
import { TenantTableView } from "./components/TenantTableView";

interface TenantsPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function TenantsPage({ params }: TenantsPageProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const {
    tenants,
    sortOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetTenants(cuid);
  const permission = useUnifiedPermissions();

  // Tenant Status Distribution
  const tenantStatusDistribution = useMemo(() => {
    const statusCounts = {
      active: 0,
      pending_renewal: 0,
      inactive: 0,
    };

    tenants.forEach((tenant) => {
      const status = tenant.tenantInfo?.leaseStatus || "inactive";
      statusCounts[status as keyof typeof statusCounts] =
        (statusCounts[status as keyof typeof statusCounts] || 0) + 1;
    });

    const total = tenants.length || 1;

    return [
      {
        name: "Active",
        value: statusCounts.active,
        percentage: Math.round((statusCounts.active / total) * 100),
      },
      {
        name: "Pending Renewal",
        value: statusCounts.pending_renewal,
        percentage: Math.round((statusCounts.pending_renewal / total) * 100),
      },
      {
        name: "Inactive",
        value: statusCounts.inactive,
        percentage: Math.round((statusCounts.inactive / total) * 100),
      },
    ].filter((item) => item.value > 0);
  }, [tenants]);

  // Lease Duration Distribution
  const leaseDurationDistribution = useMemo(() => {
    const durationCounts = {
      "6 Months": 0,
      "12 Months": 0,
      "18 Months": 0,
      "24 Months": 0,
    };

    tenants.forEach((tenant) => {
      if (
        tenant.tenantInfo?.leaseStartDate &&
        tenant.tenantInfo?.leaseEndDate
      ) {
        const months = calculateLeaseDuration(
          tenant.tenantInfo.leaseStartDate,
          tenant.tenantInfo.leaseEndDate
        );

        if (months <= 6) {
          durationCounts["6 Months"]++;
        } else if (months <= 12) {
          durationCounts["12 Months"]++;
        } else if (months <= 18) {
          durationCounts["18 Months"]++;
        } else {
          durationCounts["24 Months"]++;
        }
      }
    });

    return Object.entries(durationCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tenants]);

  const legendColors = useMemo(() => {
    return generateLegendColors(tenantStatusDistribution.length);
  }, [tenantStatusDistribution.length]);

  const handleEditTenant = (tenant: FilteredUserTableData) => {
    console.log("Edit tenant:", tenant);
    // TODO: Implement edit tenant modal/form
  };

  const handleViewTenantDetails = (tenant: FilteredUserTableData) => {
    router.push(`/users/${cuid}/tenants/${tenant.uid}`);
  };

  const handleToggleTenantStatus = (tenantId: string, isActive: boolean) => {
    console.log("Toggle tenant status:", tenantId, isActive);
    // TODO: Implement tenant status toggle
  };

  return (
    <div className="page-container">
      <div className="page add-users-page">
        <PageHeader title="Tenant Management" />
        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <TenantTableView
                tenants={tenants}
                filterOptions={sortOptions}
                handlePageChange={handlePageChange}
                handleSortByChange={handleSortByChange}
                handleSortChange={handleSortChange}
                isLoading={isLoading}
                onEdit={handleEditTenant}
                onToggleStatus={handleToggleTenantStatus}
                onViewDetails={handleViewTenantDetails}
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
              <PanelHeader header={{ title: "Tenant Status Distribution" }} />
              <PanelContent>
                {isLoading ? (
                  <Loading description="Loading stats..." />
                ) : (
                  <div className="analytics-cards">
                    <div className="analytics-card">
                      <ChartContainer
                        type="donut"
                        data={tenantStatusDistribution}
                        height={300}
                        colors={legendColors}
                        chartProps={{
                          donutchart: { showTotal: true, showTooltip: true },
                        }}
                        showLegend={true}
                        legend={tenantStatusDistribution.map(
                          (status, index) => ({
                            name: status.name,
                            color: legendColors[index],
                            percentage: status.percentage,
                          })
                        )}
                        emptyStateMessage="No tenant data available"
                        emptyStateIcon={<i className="bx bx-user"></i>}
                      />
                    </div>
                  </div>
                )}
              </PanelContent>
            </Panel>

            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Lease Duration Distribution" }} />
              <PanelContent>
                {isLoading ? (
                  <Loading description="Loading stats..." />
                ) : (
                  <div className="analytics-cards">
                    <div className="analytics-card">
                      <ChartContainer
                        type="verticalBar"
                        data={leaseDurationDistribution}
                        height={300}
                        chartProps={{
                          barChart: {
                            valueKey: "value",
                            nameKey: "name",
                            showAxis: true,
                            showGrid: true,
                          },
                        }}
                        emptyStateMessage="No lease duration data available"
                        emptyStateIcon={<i className="bx bx-calendar"></i>}
                      />
                    </div>
                  </div>
                )}
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>
      </div>
    </div>
  );
}
