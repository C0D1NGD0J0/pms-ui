"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Table } from "@components/Table";
import { InsightCard } from "@components/Cards";
import { Button } from "@components/FormElements";
import { ChartContainer } from "@components/Charts";
import { PageHeader } from "@components/PageElements";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

// Dummy data for insight cards
const leaseInsightData = [
  {
    id: "active-leases",
    title: "Active Leases",
    value: 24,
    icon: <i className="bx bx-file-blank"></i>,
    trend: {
      value: "4%",
      direction: "up" as const,
      period: "vs last month",
    },
  },
  {
    id: "expiring-soon",
    title: "Expiring Soon",
    value: 6,
    icon: <i className="bx bx-calendar-x"></i>,
    description: (
      <>
        <span>Next 30 days</span>
      </>
    ),
  },
  {
    id: "total-monthly-rent",
    title: "Total Monthly Rent",
    value: "$32,450",
    icon: <i className="bx bx-dollar-circle"></i>,
    trend: {
      value: "4.3%",
      direction: "up" as const,
      period: "vs last month",
    },
  },
  {
    id: "renewal-rate",
    title: "Renewal Rate",
    value: "78%",
    icon: <i className="bx bx-refresh"></i>,
    trend: {
      value: "3%",
      direction: "up" as const,
      period: "vs previous quarter",
    },
  },
];

// Dummy lease data
const leaseData = [
  {
    id: "1",
    property: "26 Wellington Ave, New York",
    tenant: "James Wilson",
    startDate: "02/01/2023",
    endDate: "01/31/2024",
    monthlyRent: 1850,
    status: "active",
  },
  {
    id: "2",
    property: "45 Central Park, New York",
    tenant: "Sarah Williams",
    startDate: "03/15/2023",
    endDate: "03/14/2024",
    monthlyRent: 2200,
    status: "active",
  },
  {
    id: "3",
    property: "112 Broadway St, New York",
    tenant: "Michael Chen",
    startDate: "04/01/2023",
    endDate: "03/31/2024",
    monthlyRent: 1950,
    status: "pending renewal",
  },
  {
    id: "4",
    property: "8 Madison Ave, New York",
    tenant: "Emily Johnson",
    startDate: "01/10/2023",
    endDate: "01/09/2024",
    monthlyRent: 1775,
    status: "pending renewal",
  },
  {
    id: "5",
    property: "167 Hudson St, New York",
    tenant: "Robert Davis",
    startDate: "06/01/2023",
    endDate: "05/31/2024",
    monthlyRent: 2100,
    status: "active",
  },
  {
    id: "6",
    property: "92 Thompson St, New York",
    tenant: "Jennifer Lopez",
    startDate: "02/15/2024",
    endDate: "02/14/2025",
    monthlyRent: 2350,
    status: "new",
  },
  {
    id: "7",
    property: "53 Greene St, New York",
    tenant: "David Kim",
    startDate: "10/01/2022",
    endDate: "09/30/2023",
    monthlyRent: 1900,
    status: "expired",
  },
];

// Dummy data for lease expiration timeline
const leaseExpirationData = [
  { name: "Mar 2024", value: 3 },
  { name: "Apr 2024", value: 2 },
  { name: "May 2024", value: 1 },
  { name: "Jun 2024", value: 4 },
  { name: "Jul 2024", value: 4 },
];

// Dummy data for renewal status distribution
const renewalStatusData = [
  { name: "Renewed", value: 65, percentage: 65 },
  { name: "Pending", value: 20, percentage: 20 },
  { name: "Not Renewing", value: 15, percentage: 15 },
];

const legendColors = ["#4CAF50", "#FF9800", "#F44336"];

export default function LeasesPage() {
  const permissions = useUnifiedPermissions();
  const [filterValue, setFilterValue] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const filterOptions = [
    { label: "All Leases", value: "all" },
    { label: "Active", value: "active" },
    { label: "Pending Renewal", value: "pending renewal" },
    { label: "Expired", value: "expired" },
    { label: "New", value: "new" },
  ];

  // Filter leases based on current filter
  const filteredLeases = leaseData.filter((lease) => {
    if (filterValue === "all") return true;
    return lease.status.toLowerCase() === filterValue.toLowerCase();
  });

  const leaseColumns = [
    {
      title: "Property",
      dataIndex: "property",
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
    },
    {
      title: "Monthly Rent",
      dataIndex: "monthlyRent",
      render: (rent: number) => `$${rent.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      isStatus: true,
      render: (status: string) => {
        let statusClass = "muted";
        const statusLower = status.toLowerCase();

        if (statusLower === "active") {
          statusClass = "success";
        } else if (statusLower === "pending renewal") {
          statusClass = "warning";
        } else if (statusLower === "new") {
          statusClass = "primary";
        } else if (statusLower === "expired") {
          statusClass = "danger";
        }

        return <span className={`status ${statusClass}`}>{status}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (lease: any) => (
        <div className="action-icons">
          <Link
            href={`/leases/${lease.luid}`}
            className="action-icon view-icon"
            title="View Property"
          >
            <i className="bx bx-show"></i>
          </Link>
          {permissions.isManagerOrAbove && (
            <Link
              href={`/leases/${lease.luid}/edit`}
              className="action-icon edit-icon"
              title="Edit Lease"
            >
              <i className="bx bx-edit"></i>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page leases">
      <PageHeader
        title="Leases"
        headerBtn={
          <Button
            label="ADD NEW LEASE"
            className="btn btn-primary"
            icon={<i className="bx bx-plus-circle"></i>}
          />
        }
      />

      {/* Insight Cards Row */}
      <div className="insights">
        {leaseInsightData.map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            description={card.description}
          />
        ))}
      </div>

      {/* Lease Portfolio Table */}
      <div className="flex-row">
        <PanelsWrapper>
          <Panel variant="alt-2">
            <Table
              tableVariant="alt-2"
              columns={leaseColumns}
              dataSource={filteredLeases}
              showRowNumbers={true}
              searchOpts={{
                isVisible: true,
                value: searchValue,
                onChange: (e) => setSearchValue(e.target.value),
                placeholder: "Search by property or tenant",
              }}
              filterOpts={{
                value: filterValue,
                isVisible: true,
                options: filterOptions,
                onFilterChange: (value: string) => {
                  setFilterValue(value);
                },
                sortDirection: "desc",
                onSortDirectionChange: (sort: "asc" | "desc") => {
                  console.log("Sort direction:", sort);
                },
              }}
              pagination={{
                pageSize: 10,
              }}
              rowKey="id"
              withHeader
              headerTitle="Lease Portfolio"
            />
          </Panel>
        </PanelsWrapper>
      </div>

      {/* Analytics Section */}
      <div className="flex-row">
        <PanelsWrapper>
          <Panel variant="alt-2">
            <PanelHeader header={{ title: "Lease Expiration Timeline" }} />
            <PanelContent>
              <div className="analytics-cards">
                <div className="analytics-card">
                  <ChartContainer
                    type="horizontalBar"
                    data={leaseExpirationData}
                    height={300}
                    chartProps={{
                      barChart: {
                        valueKey: "value",
                        nameKey: "name",
                        showAxis: true,
                        showGrid: true,
                      },
                    }}
                    emptyStateMessage="No lease expiration data available"
                    emptyStateIcon={<i className="bx bx-calendar"></i>}
                  />
                </div>
              </div>
            </PanelContent>
          </Panel>

          <Panel variant="alt-2">
            <PanelHeader header={{ title: "Renewal Status" }} />
            <PanelContent>
              <div className="analytics-cards">
                <div className="analytics-card">
                  <ChartContainer
                    type="donut"
                    data={renewalStatusData}
                    height={300}
                    colors={legendColors}
                    chartProps={{
                      donutchart: {
                        showTotal: true,
                        showTooltip: true,
                      },
                    }}
                    showLegend={true}
                    legend={renewalStatusData.map((item, index) => ({
                      name: item.name,
                      color: legendColors[index],
                      percentage: item.percentage,
                    }))}
                    emptyStateMessage="No renewal status data available"
                    emptyStateIcon={<i className="bx bx-refresh"></i>}
                  />
                </div>
              </div>
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
