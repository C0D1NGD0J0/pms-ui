"use client";

import Link from "next/link";
import { useAuth } from "@src/store";
import React, { useMemo } from "react";
import { formatCurrency } from "@utils/currencyMapper";
import { renderTruncatedText } from "@src/components/Utils";
import { LeaseListItem } from "@src/interfaces/lease.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

import { useGetLeaseStats, useGetAllLeases } from "../../hooks";

export function useLeasesListLogic() {
  const { user } = useAuth();
  const permissions = useUnifiedPermissions();
  const cuid = user?.client?.cuid || "";

  const {
    leases,
    totalCount,
    isLoading,
    pagination,
    filters,
    filterOptions,
    handleSortDirectionChange,
    handlePageChange,
    handleFilterChange,
  } = useGetAllLeases(cuid);

  const { data: statsData } = useGetLeaseStats(cuid);

  const insightData = useMemo(() => {
    if (!statsData) {
      return [
        {
          id: "active-leases",
          title: "Active Leases",
          value: 0,
          icon: <i className="bx bx-file-blank"></i>,
        },
        {
          id: "expiring-soon",
          title: "Expiring Soon",
          value: 0,
          icon: <i className="bx bx-calendar-x"></i>,
          description: <span>Next 30 days</span>,
        },
        {
          id: "total-monthly-rent",
          title: "Total Monthly Rent",
          value: "$0",
          icon: <i className="bx bx-dollar-circle"></i>,
        },
        {
          id: "occupancy-rate",
          title: "Occupancy Rate",
          value: "0%",
          icon: <i className="bx bx-home-circle"></i>,
        },
      ];
    }

    return [
      {
        id: "active-leases",
        title: "Active Leases",
        value: statsData.data?.leasesByStatus?.active || 0,
        icon: <i className="bx bx-file-blank"></i>,
      },
      {
        id: "expiring-soon",
        title: "Expiring Soon",
        value: statsData.data?.expiringIn30Days || 0,
        icon: <i className="bx bx-calendar-x"></i>,
        description: <span>Next 30 days</span>,
      },
      {
        id: "total-monthly-rent",
        title: "Total Monthly Rent",
        value: `$${statsData.data?.totalMonthlyRent?.toLocaleString() || 0}`,
        icon: <i className="bx bx-dollar-circle"></i>,
      },
      {
        id: "occupancy-rate",
        title: "Occupancy Rate",
        value: `${statsData.data?.occupancyRate?.toFixed(1) || 0}%`,
        icon: <i className="bx bx-home-circle"></i>,
      },
    ];
  }, [statsData]);

  const leaseColumns = useMemo(
    () => [
      {
        title: "Lease #",
        dataIndex: "luid",
        render: (luid: string) => renderTruncatedText(luid, "150px"),
      },
      {
        title: "Property",
        dataIndex: "propertyAddress",
        key: "propertyAddress",
        sorter: (a: LeaseListItem, b: LeaseListItem) => {
          return a.propertyAddress.localeCompare(b.propertyAddress);
        },
        render: (address: string) => renderTruncatedText(address, "250px"),
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        sorter: (a: LeaseListItem, b: LeaseListItem) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        },
        render: (startDate: any) => {
          return new Date(startDate).toLocaleDateString();
        },
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        render: (endDate: string) => {
          return new Date(endDate).toLocaleDateString();
        },
      },
      {
        title: "Monthly Rent",
        dataIndex: "monthlyRent",
        render: (monthlyRent: number, record: LeaseListItem) => {
          return formatCurrency(monthlyRent, record.currency || "USD");
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => {
          let statusClass = "muted";

          switch (status) {
            case "active":
              statusClass = "success";
              break;
            case "pending_signature":
              statusClass = "warning";
              break;
            case "draft":
              statusClass = "primary";
              break;
            case "expired":
            case "terminated":
            case "cancelled":
              statusClass = "danger";
              break;
          }

          const displayStatus = status.replace(/_/g, " ");
          return (
            <span className={`status ${statusClass}`}>{displayStatus}</span>
          );
        },
      },
      {
        title: "Actions",
        dataIndex: "luid",
        render: (luid: string) => (
          <div className="action-icons">
            <Link
              href={`/leases/${cuid}/${luid}`}
              className="action-icon view-icon"
              title="View Lease"
            >
              <i className="bx bx-show"></i>
            </Link>
            {permissions.isManagerOrAbove && (
              <>
                <Link
                  href={`/leases/${cuid}/${luid}/edit`}
                  className="action-icon edit-icon"
                  title="Edit Lease"
                >
                  <i className="bx bx-edit"></i>
                </Link>
                <Link
                  href={`/leases/${cuid}/new?duplicate=${luid}`}
                  className="action-icon duplicate-icon"
                  title="Duplicate Lease"
                >
                  <i className="bx bx-copy"></i>
                </Link>
              </>
            )}
          </div>
        ),
      },
    ],
    [cuid, permissions.isManagerOrAbove]
  );

  return {
    cuid,
    leases,
    totalCount,
    isLoading,
    pagination,
    filters,
    filterOptions,
    handleSortDirectionChange,
    handlePageChange,
    handleFilterChange,
    insightData,
    leaseColumns,
  };
}
