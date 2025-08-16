import React from "react";

import { EmployeeDetail } from "../../hooks/useGetEmployee";

interface EmployeeContactTabProps {
  employee: EmployeeDetail;
}

export const EmployeeContactTab: React.FC<EmployeeContactTabProps> = ({
  employee,
}) => {
  const { contact } = employee;

  return (
    <div className="employee-contact">
      <h3 className="tab-section-title">Contact Information</h3>
      
      <div className="contact-grid">
        <div className="contact-card">
          <h4>Primary Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <span>{contact.primary.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contact.primary.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{contact.primary.email}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Office Information</h4>
          <div className="contact-item">
            <i className="bx bx-map"></i>
            <span>{contact.office.address}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-city"></i>
            <span>{contact.office.city}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <span>{contact.office.hours}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Emergency Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <span>{contact.emergency.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contact.emergency.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-info-circle"></i>
            <span>Relationship: {contact.emergency.relationship}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Direct Manager</h4>
          <div className="contact-item">
            <i className="bx bx-user-check"></i>
            <span>{contact.manager.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contact.manager.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{contact.manager.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

EmployeeContactTab.displayName = 'EmployeeContactTab';