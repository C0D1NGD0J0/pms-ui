import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { PanelsWrapper, Panel } from "@src/components/Panel";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

import { useGetVendorTeamMembers } from "../../hooks";

interface VendorUserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
  isTeamMember: boolean;
}

interface VendorUsersTabProps {
  cuid: string;
  vuid: string;
}

export const VendorUsersTab: React.FC<VendorUsersTabProps> = (props) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const permissions = useUnifiedPermissions();

  const {
    teamMembers,
    totalCount,
    pagination,
    sortOptions,
    handlePageChange,
    handleSortByChange,
    handleSortChange,
    isLoading,
  } = useGetVendorTeamMembers(props.cuid, props.vuid);

  const formatPhoneNumber = (phoneNumber?: string) => {
    if (!phoneNumber) return "N/A";
    return phoneNumber;
  };

  const formatJoinDate = (joinDate?: Date | string) => {
    if (!joinDate) return "N/A";
    return new Date(joinDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (isActive: boolean, isConnected?: boolean) => {
    if (isActive) return "success";
    if (isActive && isConnected) return "success";
    if (isActive && !isConnected) return "warning";
    return "danger";
  };

  const getStatusText = (isActive: boolean, isConnected?: boolean) => {
    if (isActive) return "Active";
    if (isActive && isConnected) return "Active";
    if (isActive && !isConnected) return "Pending";
    return "Inactive";
  };

  const canEditResource = (record: { id: string }) => {
    const canEdit = permissions.can("user.update", {
      resourceOwner: record.id,
    });
    const isResourceOwner = permissions.isOwner("uid", record.id);
    return {
      hasPermission: canEdit,
      isResourceOwner,
    };
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleViewProfile = (record: VendorUserData) => {
    router.push(
      `/users/${props.cuid}/vendors/${record.uid}?isTeamMember=${record.isTeamMember}`
    );
  };

  const handleEditUser = (record: VendorUserData) => {
    console.log(`Edit user ${record.firstName} ${record.lastName}`, record);
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    console.log("Toggle user status:", userId, isActive);
  };

  const vendorUserColumns: TableColumn<VendorUserData>[] = [
    {
      title: "Name",
      dataIndex: "fullName",
      render: (_, record) => {
        return (
          <div className="table-user-cell">
            <div className="user-avatar">
              {`${record.firstName} ${record.lastName}`}
            </div>
          </div>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "email",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">{record.email}</div>
          <div className="table-secondary-text">
            {formatPhoneNumber(record.phoneNumber)}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => {
        const badgeClass = getStatusBadgeClass(record.isActive);
        const statusText = getStatusText(record.isActive);
        return <span className={`badge ${badgeClass}`}>{statusText}</span>;
      },
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      render: (_, record) => formatJoinDate(record.joinedDate),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const { isResourceOwner, hasPermission } = canEditResource({
          id: record.uid,
        });
        return (
          <div className="table-actions">
            <Button
              label="View"
              className="btn-sm btn-primary"
              onClick={() => handleViewProfile(record)}
              title="View team member details"
            />

            {(isResourceOwner || hasPermission) && (
              <Button
                label="Edit"
                className="btn-sm btn-outline"
                onClick={() => handleEditUser(record)}
                title="Edit team member information"
              />
            )}

            {permissions.isAdmin && (
              <Button
                label={record.isActive ? "Deactivate" : "Activate"}
                className={`btn-sm ${
                  record.isActive ? "btn-danger" : "btn-success"
                }`}
                onClick={() =>
                  handleToggleUserStatus(record.uid, !record.isActive)
                }
                title={
                  record.isActive
                    ? "Deactivate team member"
                    : "Activate team member"
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <PanelsWrapper>
      <Panel variant="alt-2">
        <Table
          columns={vendorUserColumns}
          dataSource={teamMembers}
          loading={isLoading}
          withHeader={true}
          showRowNumbers={true}
          headerTitle={`Team Members (${totalCount})`}
          searchOpts={{
            value: searchValue,
            isVisible: true,
            placeholder: "Search team members by name, email, or role...",
            onChange: handleSearchChange,
          }}
          filterOpts={{
            value: pagination.sortBy ?? "",
            isVisible: true,
            options: sortOptions,
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
      </Panel>
    </PanelsWrapper>
  );
};

VendorUsersTab.displayName = "VendorUsersTab";
