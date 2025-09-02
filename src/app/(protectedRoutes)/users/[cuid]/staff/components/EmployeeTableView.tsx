"use client";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { FilterOption } from "@app/(protectedRoutes)/shared-hooks/constants";

interface EmployeeTableViewProps {
  employees: FilteredUserTableData[];
  filterOptions: FilterOption[];
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  handleSortChange: (sort: "asc" | "desc") => void;
  isLoading?: boolean;
  onEdit: (employee: FilteredUserTableData) => void;
  onToggleStatus: (employeeId: string, isActive: boolean) => void;
  onViewDetails: (employee: FilteredUserTableData) => void;
  pagination: IPaginationQuery;
  totalCount: number;
  headerTitle?: string;
  permissions: ReturnType<typeof useUnifiedPermissions>;
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({
  employees,
  filterOptions,
  handlePageChange,
  handleSortByChange,
  handleSortChange,
  isLoading = false,
  onEdit,
  onToggleStatus,
  onViewDetails,
  pagination,
  totalCount,
  permissions,
  headerTitle = "Employee Directory",
}) => {
  const [searchValue, setSearchValue] = useState("");

  const canEditResource = (record: {
    id: string;
    key: "sub" | "id" | "uid";
  }) => {
    const canEdit = permissions.can("user.update", {
      resourceOwner: record.id,
    });
    const isResourceOwner = permissions.isOwner(record.key, record.id);
    return {
      hasPermission: canEdit,
      isResourceOwner,
    };
  };

  const formatDepartment = (department?: string) => {
    if (!department) return "N/A";
    return department.charAt(0).toUpperCase() + department.slice(1);
  };

  const formatJobTitle = (jobTitle?: string) => {
    if (!jobTitle) return "N/A";
    return jobTitle;
  };

  const formatStartDate = (startDate?: Date | string) => {
    if (!startDate) return "N/A";
    return new Date(startDate).toLocaleDateString();
  };

  const getStatusBadgeClass = (isActive: boolean, isConnected: boolean) => {
    if (isActive && isConnected) return "success";
    if (isActive && !isConnected) return "warning";
    return "danger";
  };

  const getStatusText = (isActive: boolean, isConnected: boolean) => {
    if (isActive && isConnected) return "Active";
    if (isActive && !isConnected) return "Pending";
    return "Inactive";
  };

  const employeeColumns: TableColumn<FilteredUserTableData>[] = [
    {
      title: "Employee",
      dataIndex: "fullName",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">
            {record.fullName || record.displayName}
          </div>
          <div className="table-secondary-text">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      render: (_, record) => formatJobTitle(record.employeeInfo?.jobTitle),
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (_, record) => (
        <span className="department-badge">
          {formatDepartment(record.employeeInfo?.department)}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (_, record) => record.phoneNumber || "N/A",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (_, record) => formatStartDate(record.employeeInfo?.startDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => {
        const badgeClass = getStatusBadgeClass(
          record.isActive,
          record.isConnected
        );
        const statusText = getStatusText(record.isActive, record.isConnected);
        return <span className={`badge ${badgeClass}`}>{statusText}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const { isResourceOwner, hasPermission } = canEditResource({
          id: record.uid,
          key: "uid",
        });
        console.log("Edit permissions:", isResourceOwner, hasPermission);
        return (
          <div className="table-actions">
            <Button
              label="View"
              className="btn-sm btn-primary"
              onClick={() => onViewDetails(record)}
              title="View employee details"
            />

            {(isResourceOwner || hasPermission) && (
              <Button
                label="Edit"
                className="btn-sm btn-outline"
                onClick={() => onEdit(record)}
                title="Edit employee information"
              />
            )}
            {permissions.isAdmin && (
              <Button
                label={record.isActive ? "Deactivate" : "Activate"}
                className={`btn-sm ${
                  record.isActive ? "btn-danger" : "btn-success"
                }`}
                onClick={() => onToggleStatus(record.uid, !record.isActive)}
                title={
                  record.isActive ? "Deactivate employee" : "Activate employee"
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Table
      columns={employeeColumns}
      dataSource={employees}
      loading={isLoading}
      withHeader={true}
      showRowNumbers={true}
      headerTitle={headerTitle}
      searchOpts={{
        value: searchValue,
        isVisible: true,
        placeholder: "Search employees by name, email, or job title...",
        onChange: handleSearchChange,
      }}
      filterOpts={{
        value: pagination.sortBy ?? "",
        isVisible: true,
        options: filterOptions,
        filterPlaceholder: "Sort by...",
        onFilterChange: (value: string) => {
          handleSortByChange(value);
        },
        sortDirection: pagination.sort,
        onSortDirectionChange: (sort: "asc" | "desc") => {
          handleSortChange(sort);
        },
      }}
      pagination={{
        total: totalCount,
        current: pagination.page,
        pageSize: pagination.limit,
        onChange: (page: number) => {
          handlePageChange(page);
        },
      }}
      tableVariant="alt-2"
      rowKey="uid"
    />
  );
};
