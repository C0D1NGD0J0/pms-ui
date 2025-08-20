"use client";

import React, { useState } from "react";
import { UserProfileHeader } from "@components/UserManagement";
import { TabPanelContent } from "@components/Tab/components/TabPanelContent";
import { TabContainer, TabListItem, TabList } from "@components/Tab/components";
import {
  PerformanceTab,
  PropertiesTab,
  DocumentsTab,
  OverviewTab,
  ContactTab,
  TasksTab,
} from "@components/UserDetail";

import { useGetEmployee } from "../hooks";

interface EmployeeDetailPageProps {
  params: Promise<{
    cuid: string;
    puid: string;
  }>;
}

export default function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { cuid, puid } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");

  const { employee, isLoading, error } = useGetEmployee(cuid, puid);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading employee details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Employee Not Found</h2>
          <p>{error || "Unable to load employee details."}</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <i className="bx bx-user"></i>,
      content: (
        <OverviewTab
          userType="employee"
          personalInfo={{
            fullName: employee.personalInfo.fullName,
            employeeId: employee.employeeInfo.employeeId,
            hireDate: employee.employeeInfo.hireDate,
            employmentType: employee.employeeInfo.employmentType,
            directManager: employee.employeeInfo.directManager,
          }}
          skills={employee.skills}
          about={employee.about}
        />
      ),
    },
    {
      id: "properties",
      label: "Properties",
      icon: <i className="bx bx-building-house"></i>,
      content: (
        <PropertiesTab
          userType="employee"
          properties={employee.properties}
        />
      ),
    },
    {
      id: "tasks",
      label: "Tasks & Tickets",
      icon: <i className="bx bx-task"></i>,
      content: (
        <TasksTab
          userType="employee"
          tasks={employee.tasks}
        />
      ),
    },
    {
      id: "performance",
      label: "Performance",
      icon: <i className="bx bx-trending-up"></i>,
      content: (
        <PerformanceTab
          userType="employee"
          metrics={{
            taskCompletionRate: employee.performance.taskCompletionRate,
            satisfaction: employee.performance.tenantSatisfaction,
            occupancyRate: employee.performance.avgOccupancyRate,
            responseTime: employee.performance.avgResponseTime,
          }}
          monthlyData={employee.performance.monthlyTrends.map((trend, index) => ({
            id: `month-${index}`,
            month: trend.month,
            tasksCompleted: trend.tasksCompleted,
            responseTime: trend.avgResponseTime,
            rating: trend.tenantRating,
            performanceScore: `${trend.performanceScore}%`,
          }))}
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
          documents={employee.documents.map(doc => ({
            id: doc.id,
            title: doc.name,
            description: doc.date,
            type: doc.type.toLowerCase() as 'certification' | 'contract' | 'license' | 'insurance' | 'report',
          }))}
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
            primary: employee.contact.primary,
            office: employee.contact.office,
            emergency: employee.contact.emergency,
            manager: {
              ...employee.contact.manager,
              title: "Direct Manager",
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="employee-container">
        {/* Employee Profile Header */}
        <UserProfileHeader
          user={{
            personalInfo: {
              fullName: employee.personalInfo.fullName,
              initials: employee.personalInfo.initials,
            },
            status: employee.employeeInfo.status,
            metaInfo: {
              primary: employee.employeeInfo.jobTitle,
              secondary: employee.employeeInfo.department,
              tertiary: employee.employeeInfo.tenure,
            },
            tags: employee.tags.map(tag => ({
              type: tag.type as 'employment' | 'achievement' | 'permission',
              label: tag.label,
              icon: tag.icon,
            })),
            statistics: employee.statistics,
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

        {/* Employee Tabs */}
        <div className="employee-tabs">
          <TabContainer
            variant="profile"
            defaultTab={activeTab}
            onChange={handleTabChange}
            scrollOnChange={false}
            ariaLabel="Employee information tabs"
          >
            <TabList variant="profile">
              {tabItems.map((tab) => (
                <TabListItem
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                />
              ))}
            </TabList>

            {tabItems.map((tab) => (
              <TabPanelContent key={tab.id} id={tab.id}>
                {tab.content}
              </TabPanelContent>
            ))}
          </TabContainer>
        </div>
      </div>
    </div>
  );
}
