import React from "react";
import { Button } from "@components/FormElements";
import { DepartmentTag, EmployeeTag, StatusBadge } from "@components/Badge";

import { EmployeeDetail } from "../hooks/useGetEmployee";

interface EmployeeProfileHeaderProps {
  employee: EmployeeDetail;
  onSendMessage?: () => void;
  onViewSchedule?: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  onSendMessage,
  onViewSchedule,
}) => {
  const { personalInfo, employeeInfo, statistics, tags } = employee;

  return (
    <div className="employee-header">
      <div className="employee-header-top">
        <div className="employee-profile">
          <div className="employee-avatar">
            {personalInfo.initials}
            <StatusBadge
              status={employeeInfo.status}
              variant="text"
              className="employee-status"
            >
              {employeeInfo.status === "active" ? "Active" : "Inactive"}
            </StatusBadge>
          </div>

          <div className="employee-info">
            <h1>{personalInfo.fullName}</h1>
            <div className="employee-meta">
              <span className="employee-role">{employeeInfo.jobTitle}</span>
              <div className="employee-department">
                <DepartmentTag
                  icon={<i className="bx bx-buildings"></i>}
                  size="default"
                >
                  {employeeInfo.department}
                </DepartmentTag>
              </div>
              <span className="employee-tenure">{employeeInfo.tenure}</span>
            </div>

            <div className="employee-tags">
              {tags.map((tag, index) => (
                <EmployeeTag
                  key={index}
                  variant={tag.type}
                  icon={tag.icon ? <i className={tag.icon}></i> : undefined}
                >
                  {tag.label}
                </EmployeeTag>
              ))}
            </div>
          </div>

          <div className="employee-actions">
            <Button
              className="btn-primary"
              onClick={onSendMessage}
              icon={<i className="bx bx-message"></i>}
              label="Send Message"
            />
            <Button
              className="btn-outline"
              onClick={onViewSchedule}
              icon={<i className="bx bx-calendar"></i>}
              label="View Schedule"
            />
          </div>
        </div>
      </div>

      <div className="employee-stats">
        <div className="stat-item">
          <span className="stat-number">{statistics.propertiesManaged}</span>
          <span className="stat-label">Properties</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{statistics.unitsManaged}</span>
          <span className="stat-label">Units Managed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{statistics.tasksCompleted}</span>
          <span className="stat-label">Tasks Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{statistics.onTimeRate}</span>
          <span className="stat-label">On-Time Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{statistics.rating}</span>
          <span className="stat-label">Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{statistics.activeTasks}</span>
          <span className="stat-label">Active Tasks</span>
        </div>
      </div>
    </div>
  );
};

EmployeeProfileHeader.displayName = "EmployeeProfileHeader";
