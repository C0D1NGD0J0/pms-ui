import React from "react";
import { EmployeeTag } from "@components/Badge";

import { EmployeeDetail } from "../../hooks/useGetEmployee";

interface EmployeeOverviewTabProps {
  employee: EmployeeDetail;
}

export const EmployeeOverviewTab: React.FC<EmployeeOverviewTabProps> = ({
  employee,
}) => {
  const { employeeInfo, skills, about } = employee;

  return (
    <div className="employee-overview">
      <div className="info-section">
        <h4>Employee Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-id-card"></i>
            <div className="info-content">
              <div className="info-label">Employee ID</div>
              <div className="info-value">{employeeInfo.employeeId}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-calendar"></i>
            <div className="info-content">
              <div className="info-label">Hire Date</div>
              <div className="info-value">{employeeInfo.hireDate}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-briefcase"></i>
            <div className="info-content">
              <div className="info-label">Employment Type</div>
              <div className="info-value">{employeeInfo.employmentType}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-user-check"></i>
            <div className="info-content">
              <div className="info-label">Direct Manager</div>
              <div className="info-value">{employeeInfo.directManager}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Skills & Expertise</h4>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <EmployeeTag
              key={index}
              variant="skill"
              size="default"
            >
              {skill}
            </EmployeeTag>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>About</h4>
        <p className="about-text">
          {about}
        </p>
      </div>
    </div>
  );
};

EmployeeOverviewTab.displayName = 'EmployeeOverviewTab';