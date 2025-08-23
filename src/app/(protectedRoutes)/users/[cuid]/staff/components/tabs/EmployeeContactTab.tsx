import React from "react";
import { EmployeeDetailResponse } from "@interfaces/user.interface";

interface EmployeeContactTabProps {
  employee: EmployeeDetailResponse;
}

export const EmployeeContactTab: React.FC<EmployeeContactTabProps> = ({
  employee,
}) => {
  const { profile, employeeInfo } = employee;
  const { contact } = profile;
  const { emergencyContact } = employeeInfo;

  return (
    <div className="employee-contact">
      <h3 className="tab-section-title">Contact Information</h3>
      
      <div className="contact-grid">
        <div className="contact-card">
          <h4>Primary Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <span>{profile.fullName}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contact.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{contact.email}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Office Information</h4>
          <div className="contact-item">
            <i className="bx bx-map"></i>
            <span>{employeeInfo.officeInfo.address}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-city"></i>
            <span>{employeeInfo.officeInfo.city}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <span>{employeeInfo.officeInfo.workHours}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Emergency Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <span>{emergencyContact.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{emergencyContact.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-info-circle"></i>
            <span>Relationship: {emergencyContact.relationship}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Direct Manager</h4>
          <div className="contact-item">
            <i className="bx bx-user-check"></i>
            <span>{employeeInfo.directManager}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>N/A</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

EmployeeContactTab.displayName = 'EmployeeContactTab';