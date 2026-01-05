import React from "react";

interface PersonalInfo {
  fullName: string;
  employeeId?: string;
  vendorId?: string;
  hireDate?: string;
  registrationDate?: string;
  employmentType?: string;
  businessType?: string;
  directManager?: string;
  accountManager?: string;
  tenure?: string;
  department?: string;
  position?: string;
}

interface OverviewTabProps {
  userType: "employee" | "vendor";
  personalInfo: PersonalInfo;
  skills: string[];
  about: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userType,
  personalInfo,
  skills,
  about,
}) => {
  return (
    <div className="overview-tab">
      <div className="info-section">
        <h4>
          {userType === "employee"
            ? "Employee Information"
            : "Vendor Information"}
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-id-card"></i>
            <div className="info-content">
              <div className="info-label">
                {userType === "employee" ? "Employee ID" : "Vendor ID"}
              </div>
              <div className="info-value">
                {userType === "employee"
                  ? personalInfo.employeeId
                  : personalInfo.vendorId}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-calendar"></i>
            <div className="info-content">
              <div className="info-label">
                {userType === "employee" ? "Hire Date" : "Registration Date"}
              </div>
              <div className="info-value">
                {userType === "employee"
                  ? personalInfo.hireDate
                  : personalInfo.registrationDate}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-briefcase"></i>
            <div className="info-content">
              <div className="info-label">
                {userType === "employee" ? "Employment Type" : "Business Type"}
              </div>
              <div className="info-value">
                {userType === "employee"
                  ? personalInfo.employmentType
                  : personalInfo.businessType}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-user-check"></i>
            <div className="info-content">
              <div className="info-label">
                {userType === "employee" ? "Direct Manager" : "Account Manager"}
              </div>
              <div className="info-value">
                {userType === "employee"
                  ? personalInfo.directManager
                  : personalInfo.accountManager}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>
          {userType === "employee"
            ? "Skills & Expertise"
            : "Services & Specialties"}
        </h4>
        <div>
          {skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>About</h4>
        <p className="about-text">{about}</p>
      </div>
    </div>
  );
};
