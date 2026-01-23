"use client";

import React from "react";
import { useGetEmployees } from "@users/staff/hooks";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { EmployeeTableView } from "@users/staff/components/EmployeeTableView";

export function AdminUsersTab({ cuid }: { cuid: string }) {
  const permissions = useUnifiedPermissions();

  const {
    employees: adminUsers,
    sortOptions,
    pagination,
    totalCount,
    handleSortDirectionChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetEmployees(cuid || "", {
    role: "admin",
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
        handleSortDirectionChange={handleSortDirectionChange}
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
