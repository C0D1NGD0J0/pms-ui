"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { FilterOption } from "@app/(protectedRoutes)/shared-hooks/constants";
import {
  getLeaseStatusBadgeClass,
  getRentStatusBadgeClass,
  getLeaseStatusText,
  getRentStatusText,
  formatRent,
} from "@utils/tenantUtils";

interface TenantTableViewProps {
  tenants: FilteredUserTableData[];
  filterOptions: FilterOption[];
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  handleSortChange: (sort: "asc" | "desc") => void;
  isLoading?: boolean;
  onEdit: (tenant: FilteredUserTableData) => void;
  onToggleStatus: (tenantId: string, isActive: boolean) => void;
  onViewDetails: (tenant: FilteredUserTableData) => void;
  pagination: IPaginationQuery;
  totalCount: number;
  headerTitle?: string;
  permissions: ReturnType<typeof useUnifiedPermissions>;
}

export const TenantTableView: React.FC<TenantTableViewProps> = ({
  tenants,
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
  headerTitle = "Tenant Directory",
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

  const tenantColumns: TableColumn<FilteredUserTableData>[] = [
    {
      title: "Tenant",
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
      title: "Property",
      dataIndex: "property",
      render: (_, record) => (
        <div>
          <div className="table-secondary-text">
            {record.tenantInfo?.propertyName || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Monthly Rent",
      dataIndex: "rent",
      render: (_, record) => formatRent(record.tenantInfo?.monthlyRent),
    },
    {
      title: "Lease Status",
      dataIndex: "leaseStatus",
      render: (_, record) => {
        const status = record.tenantInfo?.leaseStatus || "inactive";
        const badgeClass = getLeaseStatusBadgeClass(status);
        const statusText = getLeaseStatusText(status);
        return <span className={`badge ${badgeClass}`}>{statusText}</span>;
      },
    },
    {
      title: "Rent Status",
      dataIndex: "rentStatus",
      render: (_, record) => {
        const status = record.tenantInfo?.rentStatus || "n/a";
        const badgeClass = getRentStatusBadgeClass(status);
        const statusText = getRentStatusText(status);
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
        return (
          <div className="table-actions">
            <Button
              label="View"
              className="btn-sm btn-primary"
              onClick={() => onViewDetails(record)}
              title="View tenant details"
            />

            {(isResourceOwner || hasPermission) && (
              <Button
                label="Edit"
                className="btn-sm btn-outline"
                onClick={() => onEdit(record)}
                title="Edit tenant information"
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
                  record.isActive ? "Deactivate tenant" : "Activate tenant"
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
      columns={tenantColumns}
      dataSource={tenants}
      loading={isLoading}
      withHeader={true}
      showRowNumbers={true}
      headerTitle={headerTitle}
      searchOpts={{
        value: searchValue,
        isVisible: true,
        placeholder: "Search tenants by name, email, unit, or property...",
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
