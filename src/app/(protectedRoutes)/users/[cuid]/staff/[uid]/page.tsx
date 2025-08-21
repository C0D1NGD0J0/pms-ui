"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { Skeleton } from "@components/Skeleton";
import { Button } from "@components/FormElements";
import { TabItem } from "@components/Tab/interface";
import { TabContainer } from "@components/Tab/components";
import { PageHeader } from "@components/PageElements/Header";
import { UserProfileHeader } from "@components/UserManagement";
import {
  PerformanceTab,
  PropertiesTab,
  DocumentsTab,
  OverviewTab,
  ContactTab,
  TasksTab,
} from "@components/UserDetail";

import { useGetEmployeeInfo } from "../hooks/useGetEmployee";
import { usePermissions } from "@src/hooks/usePermissions";

interface EmployeeDetailPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

export default function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const router = useRouter();
  const permission = usePermissions();
  const { cuid, uid } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const { employee, isLoading, error } = useGetEmployeeInfo(cuid, uid);
  const { isResourceOwner } = permission.checkPermissionWithOwnership("user", {
    ownerId: employee?.user.uid,
    key: "uid",
  });
  const handleBack = () => {
    router.back();
  };

  const handleSendMessage = () => {
    console.log("Send message to employee");
    // TODO: Implement send message functionality
  };

  const handleViewSchedule = () => {
    console.log("View employee schedule");
    // TODO: Implement view schedule functionality
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: "Staff", href: `/users/${cuid}/staff` },
    { title: employee?.profile?.fullName || "Employee Details" },
  ];

  if (isLoading) {
    return <Loading description="Loading employee details..." size="regular" />;
  }

  if (!employee) {
    const errorBreadcrumbItems = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Users", href: "#" },
      { title: "Staff", href: `/users/${cuid}/staff` },
      { title: "Employee Details" },
    ];

    return (
      <div className="page employee-detail">
        <PageHeader
          title="Employee Not Found"
          subtitle={error?.message || "Unable to load employee details."}
          withBreadcrumb={true}
          breadcrumbItems={errorBreadcrumbItems}
          headerBtn={
            <Button
              className="btn btn-default"
              label="Back"
              icon={<i className="bx bx-arrow-back"></i>}
              onClick={handleBack}
            />
          }
        />
        <div className="employee-container">
          <Skeleton type="card" paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const tabItems: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <i className="bx bx-user"></i>,
      content: (
        <OverviewTab
          userType="employee"
          personalInfo={{
            fullName: employee.profile.fullName,
            employeeId: employee.employeeInfo.employeeId,
            hireDate: formatDate(employee.employeeInfo.hireDate),
            employmentType: employee.employeeInfo.employmentType,
            directManager: employee.employeeInfo.directManager,
            tenure: employee.employeeInfo.tenure,
            department: employee.employeeInfo.department,
            position: employee.employeeInfo.position,
          }}
          skills={employee.employeeInfo.skills || []}
          about={employee.profile.about || ""}
        />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      icon: <i className="bx bx-phone"></i>,
      content: (
        <ContactTab
          userType="employee"
          contactInfo={{
            primary: {
              name: employee.profile.fullName,
              phone: employee.profile.phoneNumber,
              email: employee.profile.email,
            },
            office: {
              address: employee.employeeInfo.officeInfo.address,
              city: employee.employeeInfo.officeInfo.city,
              hours: employee.employeeInfo.officeInfo.workHours,
            },
            emergency: {
              name: employee.employeeInfo.emergencyContact.name,
              phone: employee.employeeInfo.emergencyContact.phone,
              relationship: employee.employeeInfo.emergencyContact.relationship,
            },
            manager: {
              name: employee.employeeInfo.directManager,
              title: "Direct Manager",
              phone: "",
              email: "",
            },
          }}
        />
      ),
      isHidden: !isResourceOwner,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <i className="bx bx-trending-up"></i>,
      content: (
        <PerformanceTab
          userType="employee"
          metrics={{
            taskCompletionRate:
              employee.employeeInfo.performance.taskCompletionRate,
            satisfaction: employee.employeeInfo.performance.tenantSatisfaction,
            occupancyRate: employee.employeeInfo.performance.avgOccupancyRate,
            responseTime: employee.employeeInfo.performance.avgResponseTime,
          }}
          monthlyData={[]} // TODO: Add monthly performance data when available
        />
      ),
      isHidden: !isResourceOwner,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <i className="bx bx-task"></i>,
      content: <TasksTab userType="employee" tasks={employee.tasks || []} />,
    },
    {
      id: "properties",
      label: "Properties",
      icon: <i className="bx bx-buildings"></i>,
      content: (
        <PropertiesTab
          userType="employee"
          properties={employee.properties || []}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: (
        <DocumentsTab
          userType="employee"
          documents={employee.documents || []}
        />
      ),
      isHidden: !isResourceOwner,
    },
  ];

  const employeeTags = [
    ...employee.user.roles.map((role: string) => ({
      type: "employment" as const,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      icon: "bx bx-user-check",
    })),
    ...(employee.employeeInfo.tags || []).map((tag: string) => ({
      type: "achievement" as const,
      label: tag,
      icon: "bx bx-award",
    })),
  ];

  const statistics = {
    "Properties Managed": employee.employeeInfo.stats.propertiesManaged,
    "Units Managed": employee.employeeInfo.stats.unitsManaged,
    "Tasks Completed": employee.employeeInfo.stats.tasksCompleted,
    "On Time Rate": employee.employeeInfo.stats.onTimeRate,
    Rating: employee.employeeInfo.stats.rating,
    "Active Tasks": employee.employeeInfo.stats.activeTasks,
  };

  return (
    <div className="page employee-detail">
      <PageHeader
        title=""
        subtitle=""
        withBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
        headerBtn={
          <Button
            className="btn btn-default"
            label="Back"
            icon={<i className="bx bx-arrow-back"></i>}
            onClick={handleBack}
          />
        }
      />

      <div className="employee-container">
        <UserProfileHeader
          user={{
            personalInfo: {
              fullName: employee.profile.fullName,
              initials: `${employee.profile.firstName?.[0] || ""}${
                employee.profile.lastName?.[0] || ""
              }`,
              avatar: employee.profile.avatar?.url,
            },
            status: employee.user.isActive ? "active" : "inactive",
            metaInfo: {
              primary: employee.employeeInfo.position,
              secondary:
                employee.employeeInfo.department.charAt(0).toUpperCase() +
                employee.employeeInfo.department.slice(1),
              tertiary: `Employee ID: ${employee.employeeInfo.employeeId} • ${employee.employeeInfo.tenure}`,
            },
            tags: employeeTags,
            statistics: statistics,
          }}
          primaryAction={{
            label: "Send Message",
            icon: <i className="bx bx-message"></i>,
            onClick: handleSendMessage,
          }}
          secondaryAction={{
            label: "View Schedule",
            icon: <i className="bx bx-calendar"></i>,
            onClick: handleViewSchedule,
          }}
        />

        <div className="employee-tabs">
          <TabContainer
            variant="profile"
            tabItems={tabItems}
            defaultTab={activeTab}
            onChange={handleTabChange}
            scrollOnChange={false}
            ariaLabel="Employee information tabs"
          />
        </div>
      </div>
    </div>
  );
}
