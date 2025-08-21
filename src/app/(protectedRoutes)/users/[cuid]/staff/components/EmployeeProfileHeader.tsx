import React from "react";
import { Button } from "@components/FormElements";
import { EmployeeDetailResponse } from "@interfaces/user.interface";
import { DepartmentTag, EmployeeTag, StatusBadge } from "@components/Badge";

interface EmployeeProfileHeaderProps {
  employee: EmployeeDetailResponse;
  onSendMessage?: () => void;
  onViewSchedule?: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  onSendMessage,
  onViewSchedule,
}) => {
  const { profile, employeeInfo, user } = employee;

  return (
    <div className="employee-header">
      <div className="employee-header-top">
        <div className="employee-profile">
          <div className="employee-avatar">
            {`${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`}
            <StatusBadge
              status={user.isActive ? "active" : "inactive"}
              variant="text"
              className="employee-status"
            >
              {user.isActive ? "Active" : "Inactive"}
            </StatusBadge>
          </div>

          <div className="employee-info">
            <h1>{profile.fullName}</h1>
            <div className="employee-meta">
              <span className="employee-role">{employeeInfo.position}</span>
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
              {employeeInfo.tags?.map((tag, index) => (
                <EmployeeTag
                  key={index}
                  variant="achievement"
                  icon={<i className="bx bx-award"></i>}
                >
                  {tag}
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
          <span className="stat-number">{employeeInfo.stats.propertiesManaged}</span>
          <span className="stat-label">Properties</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employeeInfo.stats.unitsManaged}</span>
          <span className="stat-label">Units Managed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employeeInfo.stats.tasksCompleted}</span>
          <span className="stat-label">Tasks Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employeeInfo.stats.onTimeRate}</span>
          <span className="stat-label">On-Time Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employeeInfo.stats.rating}</span>
          <span className="stat-label">Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employeeInfo.stats.activeTasks}</span>
          <span className="stat-label">Active Tasks</span>
        </div>
      </div>
    </div>
  );
};

EmployeeProfileHeader.displayName = "EmployeeProfileHeader";
