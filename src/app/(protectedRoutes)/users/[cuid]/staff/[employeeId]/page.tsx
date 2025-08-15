"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumb } from "@components/Breadcrumb";
import { PageHeader } from "@components/PageElements/Header";

interface EmployeeDetailPageProps {
  params: Promise<{
    cuid: string;
    employeeId: string;
  }>;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { cuid, employeeId } = React.use(params);

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: "Staff", href: `/users/${cuid}/staff` },
    { title: "Employee Details", href: `/users/${cuid}/staff/${employeeId}` },
  ];

  const headerButtons = (
    <div className="flex-row">
      <Link href={`/users/${cuid}/staff`} className="btn btn-outline">
        <i className="bx bx-arrow-back"></i>
        Back to Staff
      </Link>
    </div>
  );

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="page">
        <PageHeader 
          title="Employee Details" 
          subtitle={`Employee ID: ${employeeId}`}
          headerBtn={headerButtons}
        />
        
        <div className="content-placeholder">
          <div className="placeholder-card">
            <h3>Employee Detail View</h3>
            <p>
              This is where the individual employee detail page will be implemented.
            </p>
            <div className="employee-info">
              <p><strong>Employee ID:</strong> {employeeId}</p>
              <p><strong>Client ID:</strong> {cuid}</p>
            </div>
            <ul>
              <li>Employee profile information</li>
              <li>Contact details</li>
              <li>Job title and department</li>
              <li>Performance metrics</li>
              <li>Recent activity</li>
              <li>Edit and action buttons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}