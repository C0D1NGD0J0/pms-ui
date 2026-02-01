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

  const handleDeactivateAdmin = (admin: FilteredUserTableData) => {
    console.log("Deactivate admin user:", admin);
    // TODO: Implement admin user deactivation with modal
  };

  const handleReconnectAdmin = (admin: FilteredUserTableData) => {
    console.log("Reconnect admin user:", admin);
    // TODO: Implement admin user reconnection
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
        onDeactivate={handleDeactivateAdmin}
        onReconnect={handleReconnectAdmin}
        onViewDetails={handleViewAdminDetails}
        pagination={pagination}
        totalCount={totalCount}
        permissions={permissions}
      />
    </div>
  );
}
