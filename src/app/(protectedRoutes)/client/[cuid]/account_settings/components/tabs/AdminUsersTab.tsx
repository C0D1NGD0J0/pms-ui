"use client";

import React, { use } from "react";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { useGetEmployees } from "@app/(protectedRoutes)/users/[cuid]/staff/hooks";
import { EmployeeTableView } from "@app/(protectedRoutes)/users/[cuid]/staff/components/EmployeeTableView";

// interface AdminUsersTabProps {
//   inEditMode: boolean;
//   clientInfo: IClient;
// }

export function AdminUsersTab({
  params,
}: {
  params: Promise<{ cuid: string }>;
}) {
  const { cuid } = use(params);
  const permissions = useUnifiedPermissions();

  const {
    employees: adminUsers,
    sortOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetEmployees(cuid || "", {
    role: "admin", // Only fetch admin users
  });

  const handleEditAdmin = (admin: FilteredUserTableData) => {
    console.log("Edit admin user:", admin);
    // TODO: Implement edit admin user modal/form
  };

  const handleViewAdminDetails = (admin: FilteredUserTableData) => {
    console.log("View admin details:", admin);
    // TODO: Navigate to admin user details page or show modal
  };

  const handleToggleAdminStatus = (adminId: string, isActive: boolean) => {
    console.log("Toggle admin status:", adminId, isActive);
    // TODO: Implement admin user status toggle
  };

  return (
    <div className="admin-users-tab">
      <EmployeeTableView
        headerTitle="Admin Users"
        employees={adminUsers}
        filterOptions={sortOptions}
        handlePageChange={handlePageChange}
        handleSortByChange={handleSortByChange}
        handleSortChange={handleSortChange}
        isLoading={isLoading}
        onEdit={handleEditAdmin}
        onToggleStatus={handleToggleAdminStatus}
        onViewDetails={handleViewAdminDetails}
        pagination={pagination}
        totalCount={totalCount}
        permissions={permissions}
      />
    </div>
  );
}
