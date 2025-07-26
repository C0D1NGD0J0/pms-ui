"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@components/Breadcrumb";

interface UserPageProps {
  params: Promise<{
    cuid: string;
    userType: string;
  }>;
}

// Define valid user types
const VALID_USER_TYPES = ["tenants", "vendors", "staff"] as const;
type UserType = (typeof VALID_USER_TYPES)[number];

function isValidUserType(userType: string): userType is UserType {
  return VALID_USER_TYPES.includes(userType as UserType);
}

function getUserTypeDisplayName(userType: UserType): string {
  const displayNames = {
    tenants: "Tenants",
    vendors: "Vendors",
    staff: "Staff",
  };
  return displayNames[userType];
}

const TenantsView = () => (
  <div className="user-management-container">
    <div className="page-header">
      <h2>
        <i className="bx bx-user"></i>
        Tenant Management
      </h2>
      <p>Manage tenant accounts, leases, and information</p>
    </div>
    <div className="content-placeholder">
      <div className="placeholder-card">
        <h3>Tenants Section</h3>
        <p>
          This is where tenant management functionality will be implemented.
        </p>
        <ul>
          <li>View all tenants</li>
          <li>Add new tenants</li>
          <li>Edit tenant information</li>
          <li>Manage tenant leases</li>
        </ul>
      </div>
    </div>
  </div>
);

const VendorsView = () => (
  <div className="user-management-container">
    <div className="page-header">
      <h2>
        <i className="bx bx-building"></i>
        Vendor Management
      </h2>
      <p>Manage vendor accounts, services, and contracts</p>
    </div>
    <div className="content-placeholder">
      <div className="placeholder-card">
        <h3>Vendors Section</h3>
        <p>
          This is where vendor management functionality will be implemented.
        </p>
        <ul>
          <li>View all vendors</li>
          <li>Add new vendors</li>
          <li>Edit vendor information</li>
          <li>Manage vendor contracts</li>
        </ul>
      </div>
    </div>
  </div>
);

const EmployeesView = () => (
  <div className="user-management-container">
    <div className="page-header">
      <h2>
        <i className="bx bx-id-card"></i>
        Employee Management
      </h2>
      <p>Manage employee accounts, roles, and permissions</p>
    </div>
    <div className="content-placeholder">
      <div className="placeholder-card">
        <h3>Employees Section</h3>
        <p>
          This is where employee management functionality will be implemented.
        </p>
        <ul>
          <li>View all employees</li>
          <li>Add new employees</li>
          <li>Edit employee information</li>
          <li>Manage roles and permissions</li>
        </ul>
      </div>
    </div>
  </div>
);

export default function UsersPage({ params }: UserPageProps) {
  const { cuid, userType } = React.use(params);

  if (!isValidUserType(userType)) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: getUserTypeDisplayName(userType), href: `/users/${userType}` },
  ];

  const renderUserTypeContent = () => {
    switch (userType) {
      case "tenants":
        return <TenantsView />;
      case "vendors":
        return <VendorsView />;
      case "staff":
        return <EmployeesView />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
      {renderUserTypeContent()}
    </div>
  );
}
